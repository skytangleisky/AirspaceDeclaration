<template>
    <div class="toolKitBgClass">
        <Dialog
            v-if="setting.人影.监控.是否显示作业面板"
            v-model:menus="setting.人影.监控.tmpZydData"
        ></Dialog>
        <template v-if="setting.人影.监控.是否显示分布面板">
            <GroundCommand>
                <!-- <template v-slot:select>
                    <el-select v-model="value" size="small" placeholder="请选择" style="width: 120px">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template> -->
            </GroundCommand>
            <SecondaryRadar v-if="showSecondaryRadar"></SecondaryRadar>
            <AirspaceCommand></AirspaceCommand>
        </template>
        <template v-if="setting.人影.监控.是否显示产品面板">
            <SatelliteProduct></SatelliteProduct>
            <ZydProduct></ZydProduct>
            <!-- <tool-mode :key="2" :render-dict="zdzDic" title="自动站雨量" @change="changeVal" v-model="form.自动站雨量"></tool-mode> -->
        </template>
        <template v-if="setting.人影.监控.是否显示工具面板">
            <BaseLayer v-model="setting.人影.监控.tile"></BaseLayer>
            <MapTool></MapTool>
            <!-- <DrawTool ></DrawTool> -->
        </template>
    </div>
</template>
<script lang="ts" setup>
    import {computed} from 'vue'
    import Dialog from '../dialog.vue'
    import BaseLayer from './工具/基础底图.vue'
    import MapTool from './工具/地图工具.vue'
    // import DrawTool from './工具/标绘工具.vue'
    import SatelliteProduct from './产品/卫星产品.vue'
    import ZydProduct from './产品/自动站产品.vue'
    import GroundCommand from './分布/地面指挥.vue'
    import SecondaryRadar from './分布/二次雷达.vue'
    import AirspaceCommand from './分布/空域指挥.vue'
    import {useSettingStore} from '~/stores/setting';
    import toolMode from './toolMode.vue';
    
    const setting = useSettingStore();
    import {getMask} from '~/api/天工'
    
    const mask = getMask()
    const showSecondaryRadar = computed(() => {
        return mask == '%%'
    })
</script>
<style lang="scss" scoped>
    .toolKitBgClass {
        position: relative;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        border-radius: $border-radius-2;
        top: 0;
        left: 0;
        width: 6rem;
        //height: 5.6rem;
        border: 1px solid var(--el-border-color);
        background-color: var(--el-bg-color-opacity-8);
        padding: $grid-3;
        pointer-events: auto;
        gap: $grid-2;
        
        :deep(.toolMode) {
            background-color: var(--el-bg-color);
            border-radius: $border-radius-1;
            padding: $grid-2;
            
            .tool-mode-top {
                display: flex;
                justify-content: space-between;
                margin-bottom: $grid-2;
                
                .top-left {
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                }
                .svg-icon {
                font-size: .2rem;
                    //margin-right: $grid-1;
                }
                
            }
            
            
            .tool-mode-content {
                width: 100%;
                gap: $grid-1;
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                
                .tool-mode-item {
                    box-sizing: border-box;
                    height: .32rem;
                    line-height: .32rem;
                    border: 1px solid var(--el-border-color);
                }
                .radio-item {
                    cursor: pointer;
                    user-select: none;;
                    text-align: center;
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
        
        // 图例图标
        $icon-size: .16rem;
        
        :deep(.legend-icon) {
            width: $icon-size;
            height: $icon-size;
            margin-right: $grid-1;
        }
        
        :deep(.svg-icon) {
            margin-right: $grid-1;
        }
    }

</style>