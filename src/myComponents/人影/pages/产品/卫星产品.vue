<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer"></svg-icon>
                <span style="user-select: none;cursor:default;">卫星观测</span>
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
        {label: '红外云图',value:modelRef(setting,'人影.监控.红外云图')},
        {label: '多源融合实况分析产品',value: modelRef(setting,'人影.监控.多源融合实况分析产品')},
        {label: '组合反射率',value: modelRef(setting,'人影.监控.组合反射率')},
        {label: '睿图雷达',value: modelRef(setting,'人影.监控.睿图雷达')},
    ])
    /**
     * @author yhl 2025/7/17 14:16
     * @description 修改表单值时的修改
     * @params
     */
    const changeVal = (item: Dict) => {
        for(let i=0;i<renderDict.value.length;i++){
            const it = renderDict.value[i];
            if(it==item){
                it.value = !it.value
            }else{
                it.value = false
            }
        }
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