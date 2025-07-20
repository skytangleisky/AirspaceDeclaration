<template>
    <div class="toolKitBgClass">
        <div v-if="setting.人影.监控.是否显示分布面板">
            <tool-mode :key="2" :render-dict="airspaceCommandDict" title="空域指挥" v-model="airspaceCommand" model="check">
                <template v-slot:select>
                    <el-select v-model="value" size="small" placeholder="请选择" style="width: 120px">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </template>
            </tool-mode>
        </div>
        <div v-if="setting.人影.监控.是否显示产品面板">
            <tool-mode :key="1" :render-dict="cmaBjDict" title="CMA-BJ模式" @change="changeVal" v-model="form.cmaBj"></tool-mode>
        </div>
        <div v-if="setting.人影.监控.是否显示工具面板">
            <tool-mode :key="1" v-model:render-dict="地图列表" title="" v-model="setting.人影.监控.tile"></tool-mode>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import {useSettingStore} from '~/stores/setting';
    import toolMode from './toolMode.vue';

    const setting = useSettingStore();
    import {reactive,ref} from "vue";
    const cmaBjDict = [{
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
    }]
    const 地图列表 = reactive([{
        label: '白板地图',
        value: 0
    }, {
        label: '矢量地图',
        value: 3
    }, {
        label: '影像地图',
        value: 2
    }, {
        label: '地形地图',
        value: 1
    }])
    const airspaceCommandDict = [{
        label: "机场",
        value: "key1",
        icon: 'layer'
    }, {
        label: '空域分布',
        value: "key2"

    }]
    const form = reactive({
        airspaceCommand: ["key1"],
        cmaBj: "key1"
    })
    let airspaceCommand = ref([])
    /**
     * @author yhl 2025/7/17 14:05
     * @description 当值发生改变时
     * @params value 新值
     */
    const changeVal = (value: string | number) => {
        //console.log("changeVal", value,);
    }
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