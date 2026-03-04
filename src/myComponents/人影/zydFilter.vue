<template>
  <div class="zydFilter" @mousedown.stop>
    <el-input
      class="filter-input"
      v-model="filterText"
      clearable
      highlight-current
      placeholder="请输入过滤条件"
    />
    <el-tree
      ref="treeRef"
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      :default-expand-all="false"
      :filter-node-method="filterNode"
      show-checkbox
      @check="handleCheck"
      node-key="id"
      :check-strictly="false"
    >
      <template #default="{ node, data }">
        <span>{{ data.name }}</span><div style="color:cyan">{{data.cnt}}</div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts" setup>
import { useSysStatusStore } from '~/stores/sysStatus'
const sys = useSysStatusStore()
import { useUserStore } from '~/stores/user'
const user = useUserStore()
import { ref, watch, reactive, onMounted, nextTick } from 'vue'
import { buildTree } from '~/tools'
import { getSubRegion,getRegion } from '~/api/天工.ts'
import type { FilterNodeMethodFunction, TreeInstance } from 'element-plus'
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()

interface Tree {
  [key: string]: any
}

const filterText = ref('')
const treeRef = ref<TreeInstance>()

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}
const data: Tree[] = reactive<Tree[]>([]);
const handleCheck = (data, { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes }) => {
  // console.log("当前点击节点:", data)
  // console.log("选中的 keys:", checkedKeys)
  // console.log("选中的 nodes:", checkedNodes)
  // console.log("半选的 keys:", halfCheckedKeys)
  setting.人影.监控.checkedKeys = checkedKeys
}
watch([()=>user.strUnitID,()=>sys.作业点原始数据],async([unitID])=>{
  data.length = 0
  let prefix = unitID
  if(unitID.endsWith('0000000')){
    prefix = unitID.substring(0,2)
  }else if(unitID.endsWith('00000')){
    prefix = unitID.substring(0,4)
  }else if(unitID.endsWith('000')){
    prefix = unitID.substring(0,6)
  }
  getRegion().then(res=>{
    const arr = buildTree(res.data.results,prefix.padEnd(6,'0'))
    data.splice(0,data.length,...arr)
    nextTick(()=>{
      treeRef.value?.setCheckedKeys(setting.人影.监控.checkedKeys)
    })
  })
  // await getSubRegion(prefix).then((res:any)=>{
  //   res.data.results.map((item:any)=>{
  //     data.push({
  //       id: item.adcode,
  //       label: item.name,
  //       cnt:item.cnt,
  //     })
  //     // if(!setting.人影.监控.checkedKeys.includes(item.adcode)){
  //     //   setting.人影.监控.checkedKeys.push(item.adcode)
  //     // }
  //   })
  // })
  // treeRef.value!.setCheckedKeys(setting.人影.监控.checkedKeys)
},{immediate:true})
</script>

<style lang="scss" scoped>
.zydFilter{
  padding:10px 20px;
  cursor:default;
  width:100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .filter-input{
    width:100%;
    font-size: 20px;
    padding:10px 0 10px 10px;
  }
  .filter-tree{
    padding:10px;
    font-size: 16px;
    box-sizing: border-box;
    position: relative;
    width:100%;
    height: 100%;
    overflow: auto;
  }
}
</style>