<template>
    <div class="toolMode">
        <div class="tool-mode-title">
            <div class="title-left">
                <svg-icon name="layer" width=".2rem" height=".2rem"></svg-icon>
                <span style="user-select: none;cursor:default;">地图工具</span>
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
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, onMounted, reactive} from "vue";
    import SvgIcon from "~/myComponents/SvgIcon.vue";

    const emits = defineEmits(['change'])
    const modelValue = defineModel('modelValue',{
        type: Number,
        default: 0
    })
    type Dict = {
        value: number, label: string, isActive: boolean, icon?: string
    }
    const renderDict = defineModel('renderDict',{
        type: Array<Dict>,
        default: reactive([
            {label:'全国',value:0},
            {label:'测距',value:1},
            {label:'测面',value:2},
            {label:'锁定',value:3},
        ])
    })
    let newRenderDict = ref<Dict[]>([])
    onMounted(() => {
        newRenderDict.value = setAttrByRenderDict() as Dict[]
    })
    /**
     * @author yhl 2025/7/17 14:03
     * @description 给遍历对象添加默认属性值isActive
     * @params
     */
    const setAttrByRenderDict = () => {
        let newArr = renderDict.value
        //单选设置默认选中样式
        newArr?.forEach((item: any) => {
            item.isActive = modelValue.value == item.value;
        })
        return newArr
    }
    /**
     * @author yhl 2025/7/17 14:16
     * @description 修改表单值时的修改
     * @params
     */
    const changeVal = (item: Dict) => {
        //单选模式设置表单属性值
        newRenderDict.value.forEach((it: Dict) => {
            if(item!==it){
                it.isActive = false
            }
        })
        item.isActive = !item.isActive
    }

</script>

<style scoped lang="scss">

</style>