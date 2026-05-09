<template>
    <div class="module-box">
        <div class="module-top1">
            <div class="module-top-left">
                <div class="module-title-decoration"></div>
               
                    <div class="module-title">{{ props.title }}</div>
                
            </div>
            <div class="module-top-right">
                <slot name="topRight"></slot>
            </div>
        </div>
        <div class="module-bottom">
            <slot name="default"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    
    const props = defineProps({
        title: {
            type: String,
        }
    })
</script>

<style scoped lang="scss">
    .module-box {
        height: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        .module-top1 {
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: $grid-2;
            box-sizing: border-box;
            height: .36rem;
            background: linear-gradient(90deg, color-mix(in srgb,var(--el-color-info) ,transparent 80%) 0%,  color-mix(in srgb,var(--el-color-info) ,transparent 90%) 100%);
            border-bottom:1px solid color-mix(in srgb, var(--el-color-primary-light-8), transparent 70%);
            justify-content: space-between;
            position: relative;
            margin-left: .08rem;
            .module-top-left,
            .module-top-right {
                display: flex;
                align-items: center;
            }
            .module-title {
                margin-left: .2rem;
                font-size: 0.18rem;
                font-weight: 600;
                line-height: normal;
                letter-spacing: 0.1em;
                background: linear-gradient(0deg, var(--el-color-warning-light-3) 22%, var(--el-text-color-primary) 40%);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                filter: drop-shadow(.03rem .03rem 0 var(--moulde-text-shadow-color)) ;
            }
            .module-title-decoration {
                position: absolute;
                left: -.08rem;
                top: -.02rem;
                height: 0.46rem;
                width: 1.2rem;
                background: url("~/assets/images/styleImg/dark/module-title-decoration.png") no-repeat;
                background-size: 100% 100%;
            }
        }
        .module-bottom {
            flex-grow: 1;
            max-height: calc(100% - 0.18rem);
            padding: 0 $grid-3;
        }
    }
</style>