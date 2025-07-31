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
        </div>
        <div v-if="setting.人影.监控.是否显示产品面板">
            <SatelliteProduct></SatelliteProduct>
            <ZydProduct style="margin-top:10px;"></ZydProduct>
            <!-- <tool-mode :key="2" style="margin-top:10px" :render-dict="zdzDic" title="自动站雨量" @change="changeVal" v-model="form.自动站雨量"></tool-mode> -->
        </div>
        <div v-if="setting.人影.监控.是否显示工具面板">
            <BaseLayer v-model="setting.人影.监控.tile"></BaseLayer>
            <MapTool v-model="地图工具值" style="margin-top:10px;"></MapTool>
            <DrawTool style="margin-top:10px;" v-model="标绘工具值"></DrawTool>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import BaseLayer from './工具/基础底图.vue'
    import MapTool from './工具/地图工具.vue'
    import DrawTool from './工具/标绘工具.vue'
    import SatelliteProduct from './产品/卫星产品.vue'
    import ZydProduct from './产品/自动站产品.vue'
    import GroundCommand from './分布/地面指挥.vue'
    import {useSettingStore} from '~/stores/setting';
    import toolMode from './toolMode.vue';

    const setting = useSettingStore();
    import {reactive,ref} from "vue";
    const 地图工具值 = ref(-1)
    const 标绘工具列表 = reactive([
        {label:'标点',value:'0'},
        {label:'标线',value:'1'},
        {label:'标面',value:'2'},
        {label:'清除',value:'3'},
    ])
    const 标绘工具值 = ref(-1)
    const form = reactive({
        airspaceCommand: ["key1"],
        cmaBj: "key1",
    })
    /**
     * @author yhl 2025/7/17 14:05
     * @description 当值发生改变时
     * @params value 新值
     */
    const changeVal = (value: string | number) => {
        //console.log("changeVal", value,);
    }
    const value = ref('key1')
    const options=reactive([{
        label: '云宏观场',
        value: "key1"
    }, {
        label: '云微观场',
        value: "key2"
    }, {
        label: '形势场',
        value: "key3"
    }, {
        label: '降水场',
        value: "key4"
    }, {
        label: '潜力预报',
        value: "key5"
    }])
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