<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer" width=".2rem" height=".2rem"></svg-icon>
                <span style="user-select: none;cursor:default;">卫星观测</span>
            </div>
            <div class="title-right">
                <slot name="select"></slot>
            </div>
        </div>
        <div class="tool-mode-content">
            <slot name="content"></slot>
            <div class="tool-mode-item radio-item" style="white-space: nowrap;" v-for="(item,index) in renderDict"
                 :key="index"
                 :class="{active:item.value}" @click="changeVal(item)">
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted, reactive, computed} from "vue";
    import SvgIcon from "~/myComponents/SvgIcon.vue";
    import {useSettingStore} from "~/stores/setting";
    
    const setting = useSettingStore()
    import {modelRef} from '~/tools'
    
    const emits = defineEmits(['change'])
    const modelValue = defineModel('modelValue', {
        type: Number,
        default: 0
    })
    type Dict = { [key: string]: any }
    const renderDict = ref([{
        label: '红外云图',
        value: modelRef(setting, '人影.监控.红外云图')
    }, {
        label: 'CMPAS降水融合3km',
        value: modelRef(setting, '人影.监控.CMPAS降水融合3km')
    }, {
        label: '组合反射率',
        value: modelRef(setting, '人影.监控.组合反射率')
    }, {
        label: '睿图雷达数据',
        value: modelRef(setting, '人影.监控.睿图雷达')
    }, {
        label: '真彩图',
        value: modelRef(setting, '人影.监控.真彩图')
    },])
    /**
     * @author yhl 2025/7/17 14:16
     * @description 修改表单值时的修改
     * @params
     */
    const changeVal = (item: Dict) => {
        for (let i = 0; i < renderDict.value.length; i++) {
            const it = renderDict.value[i];
            if (it == item) {
                it.value = !it.value
            } else {
                it.value = false
            }
        }
        // item.value = !item.value
    }

</script>

<style scoped lang="scss">

</style>