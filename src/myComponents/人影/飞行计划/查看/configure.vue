<template>
  <div v-if="sys.当前飞行计划数据.uavFlightPlan" class="view" @mousedown.stop>
    <w-Module-box title="基本信息">
      <el-descriptions>
        <el-descriptions-item label="计划名称">{{sys.当前飞行计划数据.uavFlightPlan.plan_name}}</el-descriptions-item>
        <el-descriptions-item label="计划类型">{{formatPlanType(sys.当前飞行计划数据.uavFlightPlan.plan_type)}}</el-descriptions-item>
        <el-descriptions-item label="计划性质">{{formatPlanNature(sys.当前飞行计划数据.uavFlightPlan.plan_nature)}}</el-descriptions-item>
        <el-descriptions-item label="操作模式">{{formatControlMode(sys.当前飞行计划数据.uavFlightPlan.control_mode)}}</el-descriptions-item>
        <el-descriptions-item label="飞行模式">{{formatFlightMode(sys.当前飞行计划数据.uavFlightPlan.flight_mode)}}</el-descriptions-item>
        <el-descriptions-item label="开始时间">
          {{ sys.当前飞行计划数据.uavFlightPlan.start_time.replace(/.000000$/,'') }}
        </el-descriptions-item>
        <el-descriptions-item label="结束时间">
          {{ sys.当前飞行计划数据.uavFlightPlan.end_time.replace(/.000000$/,'') }}
        </el-descriptions-item>
        <el-descriptions-item label="起降备降场地">{{ sys.当前飞行计划数据.uavFlightPlan.alternate_airports }}</el-descriptions-item>
        <el-descriptions-item label="应急处理程序">{{ sys.当前飞行计划数据.uavFlightPlan.emergency_procedure }}</el-descriptions-item>
        <el-descriptions-item label="特殊飞行保障需求">{{ sys.当前飞行计划数据.uavFlightPlan.special_support_demand }}</el-descriptions-item>
        <el-descriptions-item label="通信、导航和被监视能力">{{ sys.当前飞行计划数据.uavFlightPlan.com_nav_surv_capability }}</el-descriptions-item>
        <el-descriptions-item label="飞行速度和进出空域方法">{{ sys.当前飞行计划数据.uavFlightPlan.flight_speed_entry_method }}</el-descriptions-item>
        <el-descriptions-item label="指挥控制链路无线电频率以及占用带宽">{{ sys.当前飞行计划数据.uavFlightPlan.command_control_freq }}</el-descriptions-item>
        <el-descriptions-item label="二次雷达应答机或有关自动监视设备代码">{{ sys.当前飞行计划数据.uavFlightPlan.transponder_code }}</el-descriptions-item>
        <el-descriptions-item label="其他必要信息">{{ sys.当前飞行计划数据.uavFlightPlan.other_requirements }}</el-descriptions-item>
        <el-descriptions-item label="是否涉及以下活动">{{ sys.当前飞行计划数据.uavFlightPlan.has_special_activity }}</el-descriptions-item>
      </el-descriptions>
    </w-Module-box>
    <w-Module-box title="航空器信息">
      <el-descriptions>
        <el-descriptions-item label="实名登记标志">{{ sys.当前飞行计划数据.uavFlightPlan.uav.real_name_reg_id }}</el-descriptions-item>
        <el-descriptions-item label="厂商名称">{{ sys.当前飞行计划数据.uavFlightPlan.uav.manufacturer_name }}</el-descriptions-item>
        <el-descriptions-item label="产品名称">{{ sys.当前飞行计划数据.uavFlightPlan.uav.product_name }}</el-descriptions-item>
        <el-descriptions-item label="产品类别">{{ formatUavType(sys.当前飞行计划数据.uavFlightPlan.uav.product_type) }}</el-descriptions-item>
        <el-descriptions-item label="产品类型">{{ formatUavCategory(sys.当前飞行计划数据.uavFlightPlan.uav.product_category) }}</el-descriptions-item>
        <el-descriptions-item label="产品序列号（SN）">{{ sys.当前飞行计划数据.uavFlightPlan.uav.product_serial_no }}</el-descriptions-item>
      </el-descriptions>
    </w-Module-box>
    <w-Module-box title="航空器信息">
      <el-descriptions title="临时空域信息">
        <el-descriptions-item label="空域名称">{{ sys.当前飞行计划数据.uavFlightPlan.tempAirspace.temp_airspace_name }}</el-descriptions-item>
        <el-descriptions-item label="空域底高">{{ sys.当前飞行计划数据.uavFlightPlan.tempAirspace.bottom_height }}</el-descriptions-item>
        <el-descriptions-item label="空域顶高">{{ sys.当前飞行计划数据.uavFlightPlan.tempAirspace.top_height }}</el-descriptions-item>
        <el-descriptions-item label="空域形状">{{ formatAirspaceShape(sys.当前飞行计划数据.uavFlightPlan.tempAirspace.airspace_shape) }}</el-descriptions-item>
        <el-descriptions-item label="空域数据">
          <el-input
            :model-value="sys.当前飞行计划数据.uavFlightPlan.tempAirspace.airspace_data"
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
import {formatOperateType,formatControlMode,formatFlightMode,formatPlanType,formatPlanNature,formatUavType,formatUavCategory,formatAirspaceShape} from '../utils'
import { useSysStatusStore } from '~/stores/sysStatus';
import WModuleBox from './WModuleBox.vue'
import {批准,驳回} from '../flightPlan'
function reject(){
  驳回(sys.当前飞行计划数据.plan_id)
  sys.显示飞行计划 = false
}
function accept(){
  批准(sys.当前飞行计划数据.plan_id)
  sys.显示飞行计划 = false
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