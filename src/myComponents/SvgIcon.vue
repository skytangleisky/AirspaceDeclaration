<!--  -->
<template>
    <svg :style="{  color:color,width:width,height:height }" class="svg-icon" aria-hidden="true">
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
            default: ".16rem",
        }, //svg高度
        height: {
            type: String,
            default: ".16rem",
        },
    });
</script>

<style lang="scss" scoped>
    .svg-icon {
        color: var(--el-color-primary);
        fill: currentColor;
        
        //// 关键：使用 em 单位，图标大小会随父级字号变化
        //width: 1em;
        //height: 1em;
        //// 关键：允许通过 font-size 控制大小
        //font-size: inherit;
    }
</style>
