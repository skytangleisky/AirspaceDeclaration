<template>
  <div class="configure-region" @mousedown.stop>
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
      :default-expanded-keys="expendedKeys"
      :check-strictly="true"
    >
      <template #default="{ node, data }">
        <span>
          <span style="margin-left: 6px">{{ data.name }}</span>
          <el-tag size="small" type="success" style="margin-left: 6px">
            {{ data.adcode }}
          </el-tag>
        </span>
      </template>
    </el-tree>
  </div>
</template>
<script lang="ts" setup>
  import { useSettingStore } from '~/stores/setting'
  const setting = useSettingStore()
  import { watch, ref, reactive, onMounted, nextTick } from 'vue'
  import type { FilterNodeMethodFunction, TreeInstance, LoadFunction } from 'element-plus'
  interface Tree {
    [key: string]: any
  }
  const filterText = ref('')
  const expendedKeys = ref<string[]>([])
  const treeRef = ref<TreeInstance>()
  watch(filterText, (val) => {
    treeRef.value!.filter(val)
  })
  const filterNode: FilterNodeMethodFunction = (value: string, data: Tree) => {
    if (!value) return true
    return data.name.includes(value) || data.adcode.includes(value)
  }
  const defaultProps = {
    label: 'name',
    children: 'children',
    isLeaf: 'leaf',
  }
  const handleCheck = (data: Tree, { checkedKeys, checkedNodes, halfCheckedKeys, halfCheckedNodes }) => {
    // console.log("当前点击节点:", data)
    // console.log("选中的 keys:", checkedKeys)
    // console.log("选中的 nodes:", checkedNodes)
    // console.log("半选的 keys:", halfCheckedKeys)
    setting.人影.监控.selectedRegion = checkedKeys
  }



function buildTree(list: Array<any>, parentId: string | null = null): Array<any> {
  return list.filter(item => item.parent_adcode === parentId).map(item => ({
    ...item,
    leaf: item.childrenNum === 0,
    id: item.adcode,
    children: buildTree(list, item.adcode)
  }))
}

  import { getRegion,getAllShouldExpendRegion } from '~/api/天工'



  const data = reactive<Array<any>>([])

  onMounted(()=>{
    // getAllShouldExpendRegion().then(res=>{
    //   expendedKeys.value = res.data.results.map((item:any)=>item.adcode)
    // })
    getRegion().then(res=>{
      const arr = buildTree(res.data.results)
      data.splice(0,data.length,...arr)
      nextTick(()=>{
        treeRef.value!.setCheckedKeys(setting.人影.监控.selectedRegion)
      })
    })
  })

</script>
<style lang="scss" scoped>
  .configure-region{
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