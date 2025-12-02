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
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, onMounted } from 'vue'
import { getSubRegion } from '~/api/天工.ts'
import 北京raw from '/省市县/北京.csv?url&raw'
import 天津raw from '/省市县/天津.csv?url&raw'
import 河北raw from '/省市县/河北.csv?url&raw'
import 山西raw from '/省市县/山西.csv?url&raw'
import 内蒙古raw from '/省市县/内蒙古.csv?url&raw'
import { csv2list } from '~/tools'
const 北京 = csv2list(北京raw)
const 河北 = csv2list(河北raw)
const 山西 = csv2list(山西raw)
const 内蒙古 = csv2list(内蒙古raw)
const 天津 = csv2list(天津raw)
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
  return data.label.includes(value)
}
type Item = {
  provice:string,
  district:string,
  code:string,
}


import {getMask} from '~/api/天工.ts'
const mask = getMask()

const data: Tree[] = reactive<Tree[]>([])
mask=='%%'&&data.push({
  id: "11",
  label: '北京',
  children: (北京 as Item[]).map((item:Item)=>{
    setting.人影.监控.checkedKeys.push(item.code)
    return {
      id:item.code,
      label:item.district,
    }
  })
});
(mask=='%%'||mask=='12%')&&data.push({
  id: "12",
  label: '天津',
  children: (天津 as Item[]).map((item:Item)=>{
    setting.人影.监控.checkedKeys.push(item.code)
    return {
      id:item.code,
      label:item.district,
    }
  })
});
(mask=='%%'||mask=='13%')&&data.push({
  id: "13",
  label: '河北',
  children: (河北 as Item[]).map((item:Item)=>{
    setting.人影.监控.checkedKeys.push(item.code)
    return {
      id:item.code,
      label:item.district,
    }
  })
});
(mask=='%%'||mask=='14%')&&data.push({
  id: "14",
  label: '山西',
  children: (山西 as Item[]).map((item:Item)=>{
    setting.人影.监控.checkedKeys.push(item.code)
    return {
      id:item.code,
      label:item.district,
    }
  })
});
(mask=='%%'||mask=='15%')&&data.push({
  id: "15",
  label: '内蒙古',
  children: (内蒙古 as Item[]).map((item:Item)=>{
    setting.人影.监控.checkedKeys.push(item.code)
    return {
      id:item.code,
      label:item.district,
    }
  })
})


const handleCheck = (data, { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes }) => {
  // console.log("当前点击节点:", data)
  // console.log("选中的 keys:", checkedKeys)
  // console.log("选中的 nodes:", checkedNodes)
  // console.log("半选的 keys:", halfCheckedKeys)
  setting.人影.监控.checkedKeys = checkedKeys
}

onMounted(async()=>{
  await getSubRegion().then((res:any)=>{
    (mask=='%%'||mask=='15%')&&data.push({
      id: "62",
      label: '甘肃',
      children: (res.data.results as Item[]).map((item:Item)=>{
        setting.人影.监控.checkedKeys.push(item.adcode.substring(0,4))
        return {
          id:item.adcode.substring(0,4),
          label:item.name,
        }
      })
    })
  })
  treeRef.value!.setCheckedKeys(setting.人影.监控.checkedKeys)
})
</script>

<style lang="scss" scoped>
.zydFilter{
  padding:10px 20px;
  cursor:default;
  width:100%;
  height:100%;
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