<template>
  <div v-if="sys.当前空域申请数据.tempAirspace" class="view" @mousedown.stop>
    <w-Module-box title="基本信息">
      <el-descriptions>
        <el-descriptions-item label="空域名称">{{sys.当前空域申请数据.tempAirspace.temp_airspace_name}}</el-descriptions-item>
        <el-descriptions-item label="空域性质">{{formatPlanType(sys.当前空域申请数据.tempAirspace.plan_nature)}}</el-descriptions-item>
        <el-descriptions-item label="管制分区">{{ formatControlZone(sys.当前空域申请数据.tempAirspace.control_zone) }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ sys.当前空域申请数据.tempAirspace.start_time.replace(/.000000$/,'') }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ sys.当前空域申请数据.tempAirspace.end_time.replace(/.000000$/,'') }}
        </el-descriptions-item>
      </el-descriptions>
    </w-Module-box>
    <w-Module-box title="空域信息">
      <el-descriptions>
        <el-descriptions-item label="空域名称">{{ sys.当前空域申请数据.tempAirspace.temp_airspace_name }}</el-descriptions-item>
        <el-descriptions-item label="空域底高">{{ sys.当前空域申请数据.tempAirspace.bottom_height }}米</el-descriptions-item>
        <el-descriptions-item label="空域顶高">{{ sys.当前空域申请数据.tempAirspace.top_height }}米</el-descriptions-item>
        <el-descriptions-item label="空域形状">{{ formatAirspaceShape(sys.当前空域申请数据.tempAirspace.airspace_shape) }}</el-descriptions-item>
        <el-descriptions-item label="空域数据">
          <el-input
            :model-value="sys.当前空域申请数据.tempAirspace.airspace_data"
            style="width:200px"
            :rows="1"
            resize="none"
            readonly
          />
        </el-descriptions-item>
      </el-descriptions>
    </w-Module-box>
    <div class="bottom">
      <el-button type="info" @click="reject">驳回</el-button>
      <el-button type="primary" @click="accept">批准</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {formatOperateType,formatControlMode,formatFlightMode,formatPlanType,formatPlanNature,formatUavType,formatUavCategory,formatAirspaceShape,formatControlZone} from '../utils'
import { useSysStatusStore } from '~/stores/sysStatus';
import WModuleBox from './WModuleBox.vue'
import {批准,驳回} from '../flightArea'
function reject(){
  驳回(sys.当前空域申请数据.temp_airspace_id)
  sys.显示空域申请 = false
}
function accept(){
  批准(sys.当前空域申请数据.temp_airspace_id)
  sys.显示空域申请 = false
}
const sys = useSysStatusStore()
</script>
<style lang="scss" scoped>
.view{
  height: 100%;
  display: flex;
  flex-direction: column;
  padding:20px;
  box-sizing: border-box;
}
.bottom{
  background-color: transparent;
  width:100%;
  flex:1;
  display: inline-flex;
  justify-content: flex-end;
  align-items: flex-end;
}
</style>