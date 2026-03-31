<template>
  <el-dialog
    :close-on-click-modal="false"
    v-model="pointDialogVisible"
    title="作业批量批复"
    width="560"
    :before-close="handlePointDialogClose"
  >
    <el-form
      :model="applyPointForm"
      inline
      class="inline-form"
    >
      <el-form-item label="当前日期">
        <el-date-picker
          v-model="applyPointForm.date"
          format-value="yyyy-MM-DD"
          value-format="yyyy-MM-DD"
          type="date"
          disabled
        />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-time-picker
          v-model="applyPointForm.time"
          format="HH:mm:ss"
          value-format="HH:mm:ss"
          placeholder="请选择开始时间"
        />
      </el-form-item>
        <el-form-item label="作业时长">
          <el-input-number
            :min="10"
            :max="300"
            v-model="applyPointForm.workTimeLen"
          >
            <template #suffix>
              <span>分钟</span>
            </template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="作业目的">
          <el-select
            v-model="applyPointForm.workCat"
            placeholder="请选择作业目的"
          >
            <el-option
              v-for="item in purposeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
    </el-form>
    <div class="checkbox-title">作业点列表</div>
    <div class="checkbox">
      <el-checkbox
        v-model="checkAllPoint"
        :indeterminate="isIndeterminate"
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>
        <el-checkbox-group
          v-model="checkedPoints"
          @change="handleCheckedPointsChange"
        >
        <el-checkbox
          v-for="item in batchList"
          :key="item.strID"
          :label="item.strName"
          :value="item.strID"
        />
        </el-checkbox-group>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="accept">批准</el-button>
        <el-button type="primary" @click="reject">不批准</el-button>
        <el-button type="primary" @click="pointDialogVisible = false">退出</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
//该组件用于批量批复
import {reactive,ref,watch,onMounted, onBeforeUnmount} from 'vue'
import type { CheckboxValueType } from "element-plus";
import moment from "moment";
import {空域申请批准,空域申请拒绝} from '~/api/天工'
import { fromDMS } from '~/tools/index'
import { eventbus } from '~/eventbus'
const applyPointForm = reactive({
  date: moment().format('YYYY-MM-DD'),
  time: moment().format('HH:mm:ss'),
  workTimeLen: 60,
  workCat: 1,
});

let timer
onMounted(()=>{
  timer = setInterval(()=>{
    if(moment(moment().format('YYYY-MM-DD ')+applyPointForm.time,'YYYY-MM-DD HH:mm:ss').isBefore(moment())){
      applyPointForm.time = moment().format('HH:mm:ss')
    }
  },1000)
})
onBeforeUnmount(()=>{
  clearInterval(timer)
})
// 作业目的配置项
const purposeOptions = [
  {
    label: "未定义",
    value: 0,
  },
  {
    label: "增雨",
    value: 1,
  },
  {
    label: "防雹",
    value: 2,
  },
  {
    label: "大气污染治理",
    value: 3,
  },
  {
    label: "其他",
    value: 4,
  },
];
/**
 * @author yhl 2025-03-24 14:25:14
 * @description 选择作业点数据配置
 * @param
 */
const pointDialogVisible = defineModel<boolean>('pointDialogVisible',{
  default: false,
});
const batchList = defineModel<Array<any>>('batchList',{
  default: [],
});
watch(pointDialogVisible,(val)=>{
  if(val){
    applyPointForm.time = moment().format('HH:mm:ss')
  }
})
let checkAllPoint = ref(true);
let isIndeterminate = ref(false);
let checkedPoints = ref(new Array<any>());
watch(batchList,()=>{
  checkAllPoint.value = true
  isIndeterminate.value = false
  checkedPoints.value.length = 0
  batchList.value.forEach((item:any) => {
    checkedPoints.value.push(item.strID);
  })
},{
  immediate:true,
  deep:true,
})
// 全选
const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedPoints.value.length = 0;
  if (val) {
    batchList.value.forEach((item) => {
      checkedPoints.value.push(item.strID);
    });
  }
  isIndeterminate.value = false;
};
// 单选某一项
const handleCheckedPointsChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length;
  checkAllPoint.value = checkedCount === batchList.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < batchList.value.length;
};
// 选择作业点弹窗关闭
const handlePointDialogClose = () => {
  pointDialogVisible.value = false;
};
function accept() {
  batchList.value.forEach(async(item:any) => {
    const lngLat = fromDMS(item.strPos)
    if(checkedPoints.value.includes(item.strID)){
      item.beginTime = applyPointForm.time
      item.workTimeLen = applyPointForm.workTimeLen
      item.iworkType = applyPointForm.workCat
      await 空域申请批准(item).then(res=>{
        pointDialogVisible.value = false
        eventbus.emit('移除draw绘制的所有图形')
      })
    }
  })
  pointDialogVisible.value = false
}
function reject() {
  batchList.value.forEach(async(item:any) => {
    const lngLat = fromDMS(item.strPos)
    if(checkedPoints.value.includes(item.strID)){

console.log(applyPointForm.date+' '+applyPointForm.time)
      const data = {
        "strWorkID": item.properties.strWorkID,
        "strID": item.strID,
        "replyUnitID": item.strRelayUnit,
        "workReceiveUnit": item.strID,
        "workReceiveUser": "",
        "delayTimeLen": applyPointForm.workTimeLen,
        "denyCode":0
      }
      await 空域申请拒绝(data).then(res=>{
        pointDialogVisible.value = false
        eventbus.emit('移除draw绘制的所有图形')
      })
    }
  })
  pointDialogVisible.value = false
}

</script>
<style lang="scss" scoped>
.checkbox {
  border: 1px solid var(--el-border-color);
  border-radius: $border-radius-1;
  padding: $grid-2 $grid-3;
  margin-top: $grid-2;
  max-height: 400px;
  overflow: auto;
}
.inline-form {
  :deep(.el-date-editor.el-input),
  :deep(.el-date-editor.el-input__wrapper),
  .el-input,
  .el-select,
  .el-input-number {
    width: 180px;
  }
  .el-form-item {
    &:nth-child(2n) {
      margin-right: 0;
    }
  }
}
</style>