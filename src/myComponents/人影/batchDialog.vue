<template>
  <el-dialog
    :close-on-click-modal="false"
    v-model="pointDialogVisible"
    title="作业批量申请"
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
            :min="1"
            :max="5"
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
        <el-button
          @click="pointDialogVisible = false">取消</el-button
        >
        <el-button
          type="primary"
          @click="confirm"
        >
          网络上报
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {reactive,ref,watch,onMounted, onBeforeUnmount} from 'vue'
import type { CheckboxValueType } from "element-plus";
import moment from "moment";
import { airspacesApply } from '../../api/人影';
import { fromDMS } from '~/tools/index'
import { eventbus } from '~/eventbus'
const applyPointForm = reactive({
  date: moment().format('YYYY-MM-DD'),
  time: moment().format('HH:mm:ss'),
  workTimeLen: 3,
  workCat: 2,
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
function confirm() {
  const data = {
    "workRevID": "990201000",//作业接收单位
    "applyBeginTime": "2025-04-20 14:30:00",//申请开始作业的时间(格式：yyyy-MM-dd hh:mm:ss)
    "workTimeLen": 180,//申请作业时长(单位：秒)
    "workCat": 0,//作业类型
    // "relayID": "110000000",//作业上报单位
    "relayID": "510000000",//作业上报单位
    "lonlatNum": 4,//作业范围经纬度个数
    "lonArea": "115.68973,115.73187,116.01579,115.84223",//作业范围经度数组
    "latArea": "40.55156,40.35536,40.38823,40.57899",//作业范围纬度数组
    "reverse": "",//预留字段
    "zydData": [//数据json字符串
      {
        "zydID": "110108091",
        "longitude": "116.114200",
        "latitude": "39.594600",
        "shootRange": 10001,
        "maxShootHeight": 8001,
        "startShotDirention": "300",
        "endShotDirention": "350",
        "reverse": ""
      },
      {
        "zydID": "110108092",
        "longitude": "116.0454",
        "latitude": "40.0522",
        "shootRange": 10001,
        "maxShootHeight": 8001,
        "startShotDirention": "300",
        "endShotDirention": "350",
        "reverse": ""
      }
    ]
  }
  data.applyBeginTime = `${applyPointForm.date} ${applyPointForm.time}`
  data.workTimeLen = applyPointForm.workTimeLen * 60
  data.workCat = applyPointForm.workCat
  data.zydData.length = 0
  batchList.value.forEach((item:any) => {
    const lngLat = fromDMS(item.strPos)
    if(checkedPoints.value.includes(item.strID)){
      data.zydData.push({
        "zydID": item.strID,
        "longitude": lngLat[0].toString(),
        "latitude": lngLat[1].toString(),
        "shootRange": item.iMaxShotRange,
        "maxShootHeight": item.iMaxShotHei,
        "startShotDirention": item.iShortAngelBegin,
        "endShotDirention": item.iShortAngelEnd,
        "reverse": ""
      })
    }
  })
  pointDialogVisible.value = false
  airspacesApply(data).then(res=>{
    pointDialogVisible.value = false
    eventbus.emit('移除draw绘制的所有图形')
  })
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