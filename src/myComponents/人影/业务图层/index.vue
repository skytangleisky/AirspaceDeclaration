<template>
  <div v-if="setting.showBusinessLayer" class="business-layer">
    <div class="top">
      <div class="title">业务图层</div>
      <div class="close-btn" @click="close" @mousedown.stop><el-icon v-html="closeRaw"></el-icon></div>
    </div>
    <hr style="border:none;border-bottom:var(--el-color-primary) 1px solid;margin: 0 5px;"></hr>
    <el-tree
      style="flex:1;overflow: auto;"
      :allow-drop="allowDrop"
      :allow-drag="allowDrag"
      :data="data"
      draggable
      default-expand-all
      node-key="id"
      @node-drag-start="handleDragStart"
      @node-drag-enter="handleDragEnter"
      @node-drag-leave="handleDragLeave"
      @node-drag-over="handleDragOver"
      @node-drag-end="handleDragEnd"
      @node-drop="handleDrop"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node" @click.stop>
          <span>{{ node.label }}</span>
          <div style="display: flex;justify-content: space-between;align-items: center;">
            <el-icon v-if="!data.hide" @click="handleClick(node)" class="icon" v-html="viewRaw"></el-icon>
            <el-icon v-else @click="handleClick(node)" class="icon" style="color:black" v-html="closeViewRaw"></el-icon>
            <el-icon class="icon" v-html="queryRaw"></el-icon>
            <el-icon class="icon" v-html="editRaw"></el-icon>
            <el-icon class="icon" v-html="appendRaw"></el-icon>
            <el-icon class="icon" v-html="shiftRaw"></el-icon>
            <el-icon class="icon" v-html="moveUpRaw"></el-icon>
            <el-icon class="icon" v-html="moveDownRaw"></el-icon>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>
<script setup lang="ts">
import moveDownRaw from '~/assets/movedown.svg?raw'
import moveUpRaw from '~/assets/moveup.svg?raw'
import shiftRaw from '~/assets/shift.svg?raw'
import appendRaw from '~/assets/append.svg?raw'
import editRaw from '~/assets/edit.svg?raw'
import queryRaw from '~/assets/query.svg?raw'
import viewRaw from '~/assets/view.svg?raw'
import closeRaw from '~/assets/close.svg?raw'
import closeViewRaw from '~/assets/closeView.svg?raw'
import { useSettingStore } from '~/stores/setting'
import { reactive, computed } from 'vue'
function handleClick(node: Node) {
  node.data.hide = !node.data.hide
}
const setting = useSettingStore()
const close = () => {
  setting.showBusinessLayer = false;
}
import type {
  AllowDropType,
  NodeDropType,
  RenderContentContext,
} from 'element-plus'
import { modelRef } from '~/tools'

type Node = RenderContentContext['node']

const handleDragStart = (node: Node, ev: DragEvent) => {
  console.log('drag start', node)
}
const handleDragEnter = (draggingNode: Node, dropNode: Node, ev: DragEvent) => {
  console.log('tree drag enter:', dropNode.label)
}
const handleDragLeave = (draggingNode: Node, dropNode: Node, ev: DragEvent) => {
  console.log('tree drag leave:', dropNode.label)
}
const handleDragOver = (draggingNode: Node, dropNode: Node, ev: DragEvent) => {
  console.log('tree drag over:', dropNode.label)
}
const handleDragEnd = (
  draggingNode: Node,
  dropNode: Node | null,
  dropType: NodeDropType,
  ev: DragEvent
) => {
  console.log('tree drag end:', dropNode && dropNode.label, dropType)
}
const handleDrop = (
  draggingNode: Node,
  dropNode: Node,
  dropType: Exclude<NodeDropType, 'none'>,
  ev: DragEvent
) => {
  console.log('tree drop:', dropNode.label, dropType)
}
const allowDrop = (draggingNode: Node, dropNode: Node, type: AllowDropType) => {
  if (dropNode.data.label === 'Level two 3-1') {
    return type !== 'inner'
  } else {
    return true
  }
}
const allowDrag = (draggingNode: Node) => {
  return !draggingNode.data.label.includes('Level three 3-1-1')
}
interface Item {
  label:string,
  hide?:boolean,
  children?:Item[],
}
const data = reactive<Item[]>([
  {
    label: '地面作业图层',
    hide:computed({
      get() {
        return !setting.人影.监控.zyd
      },
      set(val:boolean){
        setting.人影.监控.zyd = !val
      }
    }),
    children: [
      {
        label: '作业点图层'
      },
      {
        label: '区县显示图层'
      },
      {
        label: '批量申请区域图层'
      },
      {
        label: '航迹显示图层'
      }
    ]
  },
  {
    label: '天气雷达图层'
  }
])
</script>
<style lang="scss" scoped>
.business-layer{
  border-radius: 4px;
  position: absolute;
  display: flex;
  flex-direction: column;
  bottom: 10px;
  left: 10px;
  border:1px solid var(--el-color-primary);
  &:hover {
    .close-btn {
      display: flex;
    }
  }
  .close-btn {
    right:-1px;
    top:-1px;
    position: absolute;
    justify-content: center;
    align-items:center;
    font-size: 0.16rem;
    z-index:999;
    color:white;
    display: none;
    cursor:pointer;
    &:hover {
      display: flex;
      .el-icon {
        color: #ff4d4f;
      }
    }
    &:active {
      transform: rotateX(180deg);
      transition: transform 0.3s;
      transition-timing-function: ease-in-out;
      .el-icon {
        color: #d32f2f;
      }
    }
  }
  .top{
    display: flex;
    width: 300px;
    margin-bottom: 0;
    justify-content: center;
    align-items: center;
    cursor:default;
  }

  height:180px;
  background-color: var(--el-bg-color-opacity-8);
  box-sizing: border-box;
  backdrop-filter: blur(10px);
  .custom-tree-node{
    border-bottom:gray 1px solid;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .icon{
      font-size: large;
    }
  }
}
</style>
