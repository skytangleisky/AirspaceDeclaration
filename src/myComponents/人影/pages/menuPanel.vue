<template>
    <div class="toolKitBgClass">
        <div v-if="setting.人影.监控.是否显示分布面板">
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
            <SecondaryRadar v-if="showSecondaryRadar" style="margin-top:10px;"></SecondaryRadar>
            <AirspaceCommand style="margin-top:10px;"></AirspaceCommand>
        </div>
        <div v-if="setting.人影.监控.是否显示产品面板">
            <SatelliteProduct></SatelliteProduct>
            <ZydProduct style="margin-top:10px;"></ZydProduct>
            <!-- <tool-mode :key="2" style="margin-top:10px" :render-dict="zdzDic" title="自动站雨量" @change="changeVal" v-model="form.自动站雨量"></tool-mode> -->
        </div>
        <div v-if="setting.人影.监控.是否显示工具面板">
            <BaseLayer v-model="setting.人影.监控.tile"></BaseLayer>
            <MapTool style="margin-top:10px;"></MapTool>
            <!-- <DrawTool style="margin-top:10px;"></DrawTool> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
    import {computed} from 'vue'
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
    import { getMask } from '~/api/天工'
    const mask = getMask()
    const showSecondaryRadar = computed(()=>{
        return mask=='%%'
    })
</script>
<style lang="scss" scoped>
    .toolKitBgClass {
        box-sizing: border-box;
        border-radius: 5px;
        top: 0;
        left: 0;
        width: 391px;
        min-height: 559px;
        max-height: 100%;
        border: 1px solid #bdd4ff;
        background-color: #f4f8ff;
        padding: $grid-1;
    }
    .dark .toolKitBgClass {
        border: 1px solid #c1d3fb;
        background-color: #273347;
    }
</style>