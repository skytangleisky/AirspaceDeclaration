<template>
    <div v-if="setting.showBusinessLayer" class="business-layer">
        <el-button type="danger" link class="close-btn" :icon="Close" @click="close" @mousedown.stop></el-button>
        <div class="top">
            <div class="title">业务图层</div>
        
        
        </div>
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
                    <div class="tree-node-label">{{ node.label }}</div>
                    <div class="tree-node-btns">
                        <el-button link type="primary" v-if="!data.hide" @click="handleClick(node)">
                            <el-icon v-html="viewRaw"></el-icon>
                        </el-button>
                        <el-button link type="primary" v-else @click="handleClick(node)">
                            <el-icon v-html="closeViewRaw"></el-icon>
                        </el-button>
                        <el-button link type="primary">
                            <el-icon v-html="queryRaw"></el-icon>
                        </el-button>
                        <el-button link type="primary">
                            <el-icon v-html="editRaw"></el-icon>
                        </el-button>
                        <el-button link type="primary">
                            <el-icon v-html="appendRaw"></el-icon>
                        </el-button>
                        <el-button link type="primary">
                            <el-icon v-html="shiftRaw"></el-icon>
                        </el-button>
                        <el-button link type="primary">
                            <el-icon v-html="moveUpRaw"></el-icon>
                        </el-button>
                        <el-button link type="primary">
                            <el-icon v-html="moveDownRaw"></el-icon>
                        </el-button>
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
    import {useSettingStore} from '~/stores/setting'
    import {reactive, computed} from 'vue'
    
    function handleClick(node: Node) {
        node.data.hide = !node.data.hide
    }
    
    const setting = useSettingStore()
    const close = () => {
        setting.showBusinessLayer = false;
    }
    import type {
        AllowDropType, NodeDropType, RenderContentContext,
    } from 'element-plus'
    import {modelRef} from '~/tools'
    import {Close} from "@element-plus/icons-vue";
    
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
    const handleDragEnd = (draggingNode: Node, dropNode: Node | null, dropType: NodeDropType, ev: DragEvent) => {
        console.log('tree drag end:', dropNode && dropNode.label, dropType)
    }
    const handleDrop = (draggingNode: Node, dropNode: Node, dropType: Exclude<NodeDropType, 'none'>, ev: DragEvent) => {
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
        label: string,
        hide?: boolean,
        children?: Item[],
    }
    
    const data = reactive<Item[]>([{
        label: '地面作业图层',
        hide: computed({
            get() {
                return !setting.人影.监控.zyd
            },
            set(val: boolean) {
                setting.人影.监控.zyd = !val
            }
        }),
        children: [{
            label: '作业点图层'
        }, {
            label: '区县显示图层'
        }, {
            label: '批量申请区域图层'
        }, {
            label: '航迹显示图层'
        }]
    }, {
        label: '天气雷达图层'
    }])
</script>
<style lang="scss" scoped>
    .business-layer {
        padding: $grid-2;
        border-radius: $border-radius-1;
        //width:3.2rem;
        //height: 1.8rem;
        position: absolute;
        display: flex;
        flex-direction: column;
        bottom: $page-padding;
        left: $page-padding;
        border: 1px solid var(--el-border-color);
        background-color: var(--el-bg-color-opacity-8);
        box-sizing: border-box;
        backdrop-filter: blur(.12rem);
        .close-btn {
            right: .04rem;
            top: .04rem;
            position: absolute;
            z-index: 999;
            font-size: .18rem;
            //display: none;
        }
        
        .top {
            display: flex;
            margin-bottom: $grid-2;
            justify-content: center;
            align-items: center;
            cursor: default;
        }
        
        .custom-tree-node {
            display: flex;
            justify-content: space-between;
            width: 100%;
            gap: $grid-3;
            
            .tree-node-label {
            
            }
            
            .tree-node-btns {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .el-button + .el-button {
                    margin-left: 0;
                }
                .el-icon {
                    font-size: .18rem;
                }
            }
        }
        
        ::v-deep(.el-tree) {
            background-color: transparent;
        }
    }
</style>
