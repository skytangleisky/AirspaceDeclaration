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
        <el-button type="primary" @click="accept">批准</el-button>
        <el-button type="primary" @click="reject">不批准</el-button>
        <el-button type="primary" @click="pointDialogVisible = false">退出</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {reactive,ref,watch,onMounted} from 'vue'
import type { CheckboxValueType } from "element-plus";
import moment from "moment";
import {空域申请批准,空域申请拒绝} from '~/api/天工'
import { fromDMS } from '~/tools/index'
import { eventbus } from '~/eventbus'
const applyPointForm = reactive({
  date: moment().format('YYYY-MM-DD'),
  time: moment().format('HH:mm:ss'),
  workTimeLen: 3,
  workCat: 2,
});
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
// item = {
//     "bAutoDownSend": true,
//     "bAutoUpSend": true,
//     "connectType": 0,
//     "dataver": 393,
//     "iAltitude": 0,
//     "iMaxShotHei": 8000,
//     "iMaxShotRange": 10000,
//     "iShortAngelBegin": 300,
//     "iShortAngelEnd": 25,
//     "iType": 0,
//     "iVersion": 2,
//     "listenPort": 15,
//     "strCode": "801",
//     "strID": "110117001",
//     "strIP": "",
//     "strMgrUnit": "990701000",
//     "strMgrUnitName": "北京分区",
//     "strName": "黑豆峪",
//     "strPos": "117135900E40122000N",
//     "strRelayUnit": "110117000",
//     "strRelayUnitName": "北京平谷区",
//     "strShotAngle": "0090",
//     "strShotSector": "300025",
//     "strSimNo": "",
//     "strWeapon": 2,
//     "properties": {
//         "strID": "110117001",
//         "opacity": 0.5,
//         "ubyStatus": "作业申请待批复",
//         "bAnswerAccept": false,
//         "bAnswerValid": true,
//         "bApplyValid": false,
//         "bEndValid": false,
//         "bRevOver": false,
//         "iActingTimeLen": 0,
//         "iAngleBegin": 300,
//         "iAngleEnd": 25,
//         "iAnswerTimeLen": 0,
//         "iApplyTimeLen": 180,
//         "iEndType": 0,
//         "iMaxShotHei": 8000,
//         "iRange": 10000,
//         "strATCUnitID": "990701000",
//         "strATCUnitIDName": "北京分区",
//         "strAnswerMark": "",
//         "strAnswerUnit": "",
//         "strApplyMark": "",
//         "strApplyUnit": "110000000PYCLIENT",
//         "strCode": "801",
//         "strCurPos": "117135900E40122000N",
//         "strEndMark": "",
//         "strEndUnit": "",
//         "strName": "黑豆峪",
//         "strUpApplyUnit": "110000000",
//         "strUpApplyUnitName": "北京气象局",
//         "strWeapon": "火箭+高炮",
//         "strWorkID": "RY1101170012025-07-09-1449540",
//         "strZydID": "110117001",
//         "tmAnswerCreate": "",
//         "tmAnswerRev": "",
//         "tmAnswerSend": "",
//         "tmApplyCreate": "1970-01-01 08:00:00",
//         "tmApplyRev": "2025-07-09 14:49:55",
//         "tmApplySend": "",
//         "tmBeginActing": "",
//         "tmBeginAnswer": "",
//         "tmBeginApply": "2025-07-09 14:49:42",
//         "tmEnd": "",
//         "tmEndCreate": "",
//         "tmEndRev": "",
//         "tmEndSend": "",
//         "tmUpdate": "2025-07-09 14:49:55",
//         "ubyProcStatus": 3,
//         "ubySendStatus": 3,
//         "ubyWorkCat": 2,
//         "vecProcess": ";14:49:55,收到批量申请",
//         "fillColor": "#000"
//     }
// }

      const data = {
        "strWorkID": item.properties.strWorkID,
        "strID": item.strID,
        "replyUnitID": "110000000",//北京气象局
        "workReceiveUnit": item.strID,
        "workReceiveUser": "",
        "workBeginTime": applyPointForm.time,
        "workTimeLen": applyPointForm.workTimeLen,
        "beginDirection": 20,
        "endDirection": 80,
      }



      await 空域申请批准(data).then(res=>{
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
        "replyUnitID": "110000000",//北京气象局
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