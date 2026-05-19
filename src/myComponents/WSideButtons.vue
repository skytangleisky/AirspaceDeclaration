<template>
    <div class="w-side-buttons">
        <div class="buttons-box">
            <template v-for="(item,index) in props.dataList" :key="item.slotName">
                <div class="button-item" :class="{active:index == activeIndex}" @click="switchLayer(index)">
                    <el-tooltip :content="item.label" placement="bottom" :show-after="500">
                        <svg-icon :name="item.icon" :width="iconSize" :height="iconSize"></svg-icon>
                    </el-tooltip>
                </div>
            </template>
        </div>
        <div class="module-box">
            <slot :name="slotName"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import SvgIcon from '~/myComponents/SvgIcon.vue'
    import { ref, watch,PropType } from 'vue'
    type LayerData = {
        icon: string; label: string; slotName: string;
    }
    const props = defineProps({
        dataList: {
            type: Array as PropType<LayerData[]>,
            required: true
        },
        activeIndex: {
            type: Number,
            default: -1
        }
    })
    const iconSize = '.2rem'
    let activeIndex = ref(props.activeIndex)
    let isShowLayer = ref(false)
    let slotName = ref('')
    const switchLayer = (index: number) => {
        // 如果只有一项，控制是否显示数据
        if (props.dataList?.length === 1) {
            isShowLayer.value = !isShowLayer.value
            return
        }
        if (activeIndex.value === index) {
            activeIndex.value = -1
        } else {
            activeIndex.value = index
        }
    }
    
    watch(activeIndex, (newVal) => {
        if (!props.dataList) return
        if (newVal !== -1) {
            slotName.value = props.dataList[newVal].slotName
        } else {
            slotName.value = ''
        }
    }, { immediate: true })
</script>

<style scoped lang="scss">
    .w-side-buttons {
        max-width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
        gap: $grid-3;
        
        .buttons-box {
            flex-shrink: 0; //用于控制当父容器空间不足时，子元素被压缩的比率
            display: flex;
            align-items: center;
            gap: $grid-1;
            padding: $grid-1;
            //height: .4rem;
            width: fit-content;
            background-color: var(--el-bg-color);
            border-radius: $border-radius-2;
            box-shadow: 0 4px 4px var(--el-bg-color-page-8);
            
            .button-item {
                border: 1px solid transparent;
                border-radius: $border-radius-1;
                padding: .04rem;
                
                .svg-icon {
                    color: var(--el-text-color-regular);
                }
                
                &:hover {
                    border: 1px solid var(--el-border-color);
                }
                
                &.active {
                    border: 1px solid var(--el-border-color);
                }
            }
            
        }
        
        .module-box {
            flex: 1;
            min-height: 0;
            min-width: 2.6rem;
            overflow-y: auto;
            //background-color: var(--el-bg-color-overlay-opacity-8);
            //padding: $grid-3;
        }
    }
</style>