<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer"></svg-icon>
                <span style="user-select: none;cursor:default;">自动站雨量</span>
            </div>
            <div class="title-right">
                <slot name="select"></slot>
            </div>
        </div>
        <div class="tool-mode-content">
            <slot name="content"></slot>
            <div class="tool-mode-item radio-item" style="white-space: nowrap;" v-for="(item,index) in renderDict" :key="index"
                    :class="{active:item.value}" @click="changeVal(item)">{{
                    item.label
                }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted, reactive,computed} from "vue";
    import SvgIcon from "~/myComponents/SvgIcon.vue";
    import { useSettingStore } from "~/stores/setting";
    const setting = useSettingStore()
    import {modelRef} from '~/tools'
    const emits = defineEmits(['change'])
    const modelValue = defineModel('modelValue',{
        type: Number,
        default: 0
    })
    type Dict = {[key:string]:any}
    const renderDict = ref([
        {label: '基本站',value:modelRef(setting,'人影.监控.基本站')},
        {label: '一般站',value: modelRef(setting,'人影.监控.一般站')},
        {label: '区域站',value: modelRef(setting,'人影.监控.区域站')},
    ])
    /**
     * @author yhl 2025/7/17 14:16
     * @description 修改表单值时的修改
     * @params
     */
    const changeVal = (item: Dict) => {
        // for(let i=0;i<renderDict.value.length;i++){
        //     const it = renderDict.value[i];
        //     if(it==item){
        //         it.value = !it.value
        //     }else{
        //         it.value = false
        //     }
        // }
        item.value = !item.value
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
                padding:0 10px;
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