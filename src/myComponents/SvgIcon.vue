<!--  -->
<template>
    <svg :style="{ width: width, height: height, color:color }" class="svg-icon" aria-hidden="true">
        <use :xlink:href="prefix + name"></use>
    </svg>
</template>

<script setup lang="ts">
    defineProps({
        //xlink:href属性值的前缀
        prefix: {
            type: String,
            default: "#icon-",
        }, //svg矢量图的名字
        name: String, //svg图标的颜色
        color: {
            type: String,
            default: "",
        }, //svg宽度
        width: {
            type: String,
            default: "16px",
        }, //svg高度
        height: {
            type: String,
            default: "16px",
        },
    });
</script>

<style lang="scss" scoped>
    .svg-icon {
        color: var(--el-color-primary);
        fill: currentColor;
    }
</style>
