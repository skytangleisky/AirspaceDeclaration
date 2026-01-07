<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer" width=".2rem" height=".2rem"></svg-icon>
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

</style>