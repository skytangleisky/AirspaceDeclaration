<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer"></svg-icon>
                <span style="user-select: none;cursor:default;">标绘工具</span>
            </div>
            <div class="title-right">
                <slot name="select"></slot>
            </div>
        </div>
        <div class="tool-mode-content">
            <slot name="content"></slot>
            <div class="tool-mode-item radio-item" style="white-space: nowrap;" v-for="(item,index) in renderDict" :key="item.value"
                    :class="{active:item.isActive}" @click="changeVal(item)">{{
                    item.label
                }}
            </div>
            <el-button type="primary" size="small" @click="clear">清除</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted, reactive} from "vue";
    import SvgIcon from "~/myComponents/SvgIcon.vue";
    import {useSettingStore} from '~/stores/setting';
    const setting = useSettingStore();

    const emits = defineEmits(['change'])
    const modelValue = defineModel('modelValue',{
        type: Number,
        default: 0
    })
    type Dict = {
        value: number, label: string, isActive: boolean, icon?: string
    }
    import {modelRef} from '~/tools'
    const renderDict = reactive([
        {label:'标点',isActive:modelRef(setting,'标点')},
        {label:'标线',isActive:modelRef(setting,'标线')},
        {label:'标面',isActive:modelRef(setting,'标面')},
    ])
    function clear(){
        setting.清除()
    }
    function changeVal(item){
        item.isActive = !item.isActive
    }
</script>

<style scoped lang="scss">
    .toolMode {
        background-color: var(--el-bg-color);
        border-radius: $border-radius-1;
        padding: $grid-1;
        .tool-mode-title {
            display: flex;
            justify-content: space-between;
        }
        .title-left {
            display: flex;
            align-items: center;
            margin-bottom: $grid-1;
            .svg-icon {
                margin-right: 0.04rem;
            }
        }
        .tool-mode-content {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: -$grid-1;
            .tool-mode-item {
                box-sizing: border-box;
                height: .24rem;
                line-height: .20rem;
                margin-bottom: $grid-1;
            }
            .radio-item {
                cursor: pointer;
                user-select: none;;
                text-align: center;
                border: 1px solid transparent;
                border-radius: $border-radius-1;
                width:20%;
                &:hover {
                    border-color: var(--el-color-primary);
                }
            }
            .radio-item.active {
                background-color: var(--el-color-primary);
                border-color: var(--el-color-primary);
                color: #fff;
            }
        }
    }
</style>