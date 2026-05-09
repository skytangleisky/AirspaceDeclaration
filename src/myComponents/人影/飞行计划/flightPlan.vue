<template>
  <el-table :data="sys.飞行计划数据" style="width: 100%">
    <el-table-column prop="uavFlightPlan.plan_type" label="计划名称" width="180" :formatter="(row:any)=>row.uavFlightPlan.plan_name" />
    <el-table-column prop="uavFlightPlan.plan_type" label="计划类型" width="100" :formatter="(row:any)=>formatPlanType(row.uavFlightPlan.plan_type)" />
    <el-table-column prop="uavFlightPlan.plan_nature" label="计划性质" width="120" :formatter="(row:any)=>formatPlanNature(row.uavFlightPlan.plan_nature)"/>
    <el-table-column prop="uavFlightPlan.control_mode" label="操作模式" width="100" :formatter="(row:any)=>formatControlMode(row.uavFlightPlan.control_mode)"/>
    <el-table-column prop="uavFlightPlan.flight_mode" label="飞行模式" width="100" :formatter="(row:any)=>formatFlightMode(row.uavFlightPlan.flight_mode)"/>
    <el-table-column prop="uavFlightPlan.start_time" label="开始时间" width="200">
      <template #default="{ row }">
        {{ row.uavFlightPlan.start_time.replace(/.000000$/,'') }}
      </template>
    </el-table-column>
    <el-table-column prop="uavFlightPlan.end_time" label="结束时间" width="200">
      <template #default="{ row }">
        {{ row.uavFlightPlan.end_time.replace(/.000000$/,'') }}
      </template>
    </el-table-column>
    <el-table-column prop="operate_type" label="计划状态" width="100">
      <template #default="{row}">
        <el-tag :color="getColor(row)" style="color:white">{{ formatOperateType(row) }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #default="{row}">
        <el-button size="small" style="color:cyan" @click="handlePosition(row)">
          定位
        </el-button>
        <el-button size="small" style="color:cyan" @click="handleReply(row)">审批</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts" setup>
import {formatOperateType,formatControlMode,formatFlightMode,formatPlanType,formatPlanNature} from './utils'
import { useSettingStore } from '~/stores/setting'
import { useSysStatusStore } from '~/stores/sysStatus'
import { eventbus } from '~/eventbus'
const setting = useSettingStore()
const sys = useSysStatusStore()
function handleReply(row:any){
  sys.当前飞行计划数据 = row
  sys.显示飞行计划 = true
}
function handlePosition(row:any){
  console.log(row)
  eventbus.emit('飞行计划定位',row)
}
function getColor(row:any){
  switch(row.operate_type){
    case 1:
      return '#fff'//'待申报'
    case 2:
      return '#fa0'//'审批中'
    case 3:
      return '#00f'//'审批通过'
    case 4:
      return '#f88'//'审批驳回'
    case 5:
      return '#f48'//'执行中'
    case 6:
      return '#888'//'已完成'
    default:
      return `未知状态${row.operate_type}`
  }
}
</script>
