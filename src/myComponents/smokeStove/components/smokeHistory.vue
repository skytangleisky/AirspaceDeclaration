<template>
  <div>
    <el-table class="table" :data="option.arr" style="width: 100%" height="256">
      <el-table-column prop="stoveID" label="烟炉ID" width="150" />
      <el-table-column prop="stoveName" label="烟炉名称" width="200" />
      <el-table-column prop="mgr_unit" label="管理单位" width="120" />
      <el-table-column prop="applyTm" label="申请时间" width="200" />
      <!-- <el-table-column prop="telNumber" label="电话号码" width="100"/> -->
      <el-table-column prop="fireCount" label="点火的烟条数量" width="130" />
      <el-table-column prop="fireStoveBarNo" label="点火时烟条的编号" width="160" />
      <el-table-column prop="beginTm" label="开始时间" width="200" />
      <el-table-column prop="endTm" label="结束时间" width="200" />
      <el-table-column prop="writeTm" label="记录时间" width="200" />
      <el-table-column prop="bEdit" label="操作">
        <template #default="scope">
          <el-popconfirm
            class="box-item"
            :title="scope.row.bEdit ? '重置该烟条确认状态' : '确认该烟条已经被使用'"
            placement="right"
            type="error"
            @confirm="handleConfirm(scope.row)"
          >
            <template #reference>
              <el-button size="small" :type="scope.row.bEdit ? 'success' : 'warning'">{{ scope.row.bEdit ? '已确认' : '未确认' }}</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
            class="box-item"
            title="删除数据后无法恢复"
            placement="right"
            type="error"
            @confirm="handleDelete(scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: space-between">
      <el-pagination
        class="pagination"
        v-model:current-page="paginationOption.currentPage"
        v-model:page-size="paginationOption.pageSize"
        :page-sizes="[5, 10, 15, 20]"
        size="default"
        :background="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationOption.total"
        :teleported="false"
      />
      <div>
        <el-date-picker
          v-model="range"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :default-value="defaultDates"
          unlink-panels
        />
      </div>
      <div style="display: flex;justify-content: center;align-items: center;cursor:pointer" @click="数据更新时间=moment().format('YYYY-MM-DD HH:mm:ss')">
        <el-icon><Refresh /></el-icon>
        {{ 数据更新时间 }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {exec} from '~/api/index.js'
import { useSettingStore } from "~/stores/setting";
const setting = useSettingStore()
import { Refresh } from "@element-plus/icons-vue";
import {烟炉历史,修改烟炉历史,删除烟炉历史} from '~/api/天工'
import { reactive, watch, ref } from 'vue';
import moment from 'moment';
import { wrapKeys } from "~/tools";
const Tomorrow = moment().add(1, 'day')
const range = ref<[Date, Date]>([
  new Date(moment().year(), moment().month(), moment().date(), 0, 0),
  new Date(Tomorrow.year(), Tomorrow.month(), Tomorrow.date(), 0, 0),
])
const now = new Date()
const defaultDates = [
  new Date(now.getFullYear(), now.getMonth() - 1, 1), // 上个月
  new Date(now.getFullYear(), now.getMonth(), 1)      // 当前月
]

const 数据更新时间 = ref(moment().format('YYYY-MM-DD HH:mm:ss'))
const paginationOption = reactive({
  currentPage:1,
  pageSize:5,
  total:0
})
watch([paginationOption,range],()=>{
  数据更新时间.value = moment().format('YYYY-MM-DD HH:mm:ss')
})
const option = reactive({
  arr:new Array()
})
watch([()=>setting.人影.监控.checkedKeys_stove,数据更新时间],()=>{
  if(setting.人影.监控.checkedKeys_stove.length > 0){
    烟炉历史(paginationOption,range.value,setting.人影.监控.checkedKeys_stove).then(res=>{
      paginationOption.total = res.data.total
      option.arr = res.data.results
    })
  }else{
    option.arr = new Array()
    paginationOption.total = 0
  }
  let sql =
`SELECT
    m.name,
    t.mgr_unit_prefix,
    t.cnt
FROM (
    SELECT
        SUBSTR(mgr_unit, 1, 6) AS mgr_unit_prefix,
        COUNT(*) AS cnt
    FROM stovefirehis
    WHERE mgr_unit IS NOT NULL AND bEdit = 1
    GROUP BY SUBSTR(mgr_unit, 1, 6)
) t
JOIN map_border_info m
  ON t.mgr_unit_prefix = m.adcode;
`
if(range.value){
sql = `SELECT
    m.name,
    t.mgr_unit_prefix,
    t.cnt
FROM (
    SELECT
        SUBSTR(mgr_unit, 1, 6) AS mgr_unit_prefix,
        COUNT(*) AS cnt
    FROM stovefirehis
    WHERE mgr_unit IS NOT NULL
      AND bEdit = 1
      AND beginTm >= '${moment(range.value[0]).format('YYYY-MM-DD HH:mm:ss')}'
      AND beginTm < '${moment(range.value[1]).format('YYYY-MM-DD HH:mm:ss')}'
    GROUP BY SUBSTR(mgr_unit, 1, 6)
) t
JOIN map_border_info m
  ON t.mgr_unit_prefix = m.adcode;
`
}
  exec({sqls:[sql]}).then((res:any)=>{
    res.data[0] = res.data[0].filter((item:any)=>{
      return setting.人影.监控.checkedKeys_stove.some(key=>item.MGR_UNIT_PREFIX.includes(key))
    })
    const totalCnt = res.data[0].reduce((sum:number, item:any) => {
      return sum + Number(item.CNT || 0);
    }, 0);
    if(res.data[0].length>0){
      if(range.value){
        setting.人影.监控.烟炉统计信息 = moment(range.value[0]).format('YYYY-MM-DD HH:mm') + '至' + moment(range.value[1]).format('YYYY-MM-DD HH:mm') + '，共'+moment(range.value[1]).diff(moment(range.value[0]),'days',true).toFixed(1) + '天，'+ res.data[0].map((item:any)=>`${item.name}<div class="numberText">${item.CNT}</div>次`).join('，')+','+`共计<div class="sumText">${totalCnt}</div>次`
      }else{
        setting.人影.监控.烟炉统计信息 = res.data[0].map((item:any)=>`${item.name}<div class="numberText">${item.CNT}</div>次`).join('，')+','+`共计<div class="sumText">${totalCnt}</div>次`
      }
    }else{
      setting.人影.监控.烟炉统计信息 = ''
    }
  })
},{deep:true,immediate:true})
function handleConfirm(row:any){
  const data = Object.assign({},row,{bEdit:row.bEdit?0:1})
  修改烟炉历史(wrapKeys(data,(key)=>['beginTm','stoveID'].includes(key))).then(res=>{
    数据更新时间.value = moment().format('YYYY-MM-DD HH:mm:ss')
  })
}
function handleDelete(row:any){
  删除烟炉历史({stoveID:row.stoveID,beginTm:row.beginTm}).then(res=>{
    数据更新时间.value = moment().format('YYYY-MM-DD HH:mm:ss')
  })
}
</script>
<style lang="scss" scoped>
.table{
  padding-bottom:10px;
}
</style>
<style>
  .dark .numberText{
    color:cyan;
  }
  .numberText{
    color:darkcyan;
  }
  .sumText{
    color:lightcoral;
    font-weight: bolder;
  }
</style>
