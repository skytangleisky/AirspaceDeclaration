<template>
    <div class="ryParams">
        <moduleBox title="人影参数" :menu-list="menuList" :active-index="activeIndex" @changeActiveIndex="changeMenu">
            <localRy v-if="activeIndex==0"></localRy>
            <ryUnit v-if="activeIndex==1"></ryUnit>
            <ryOperationPoint v-if="activeIndex==2"></ryOperationPoint>
        </moduleBox>
    </div>
</template>

<script setup lang="ts">
    import moduleBox from "../components/moduleBox.vue"
    import localRy from "./components/localRy.vue"
    import ryUnit from "./components/ryUnit.vue"
    import ryOperationPoint from "./components/ryOperationPoint.vue"
    import {ref} from "vue";
    
    const menuList: string[] = ["本地人影", "人影单位", "人影作业点"]
    const activeIndex = ref<number>(1)
    
    
    /**
     * @author yhl 2025/12/22 15:01
     * @description 修改选中菜单
     * @params
     */
    const changeMenu = (index: number) => {
        activeIndex.value = index
    }
</script>

<style scoped lang="scss">
    .ryParams {
    
    }
</style>