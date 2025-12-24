<template>
    <div class="module-box">
        <div class="box-top">
            <div class="box-title">{{ props.title }}</div>
            <div class="box-menus">
                <div class="menu-item" v-for="(item,index) in props.menuList"
                     :class="activeIndex==index?'active':''" @click="changeActiveIndex(index)">{{ item.label }}
                </div>
            </div>
        </div>
        <div class="box-bottom">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {ref, PropType} from 'vue'
    
    interface MenuItem {
        label: string;
        component: any;
    }
    
    const emits = defineEmits(["changeActiveIndex"])
    const props = defineProps({
        title: {
            type: String,
            default: "这是一个标题"
        },
        menuList: {
            type: Array as PropType<MenuItem[]>,
        },
        activeIndex: {
            type: Number,
            default: 0
        }
    })
    const activeIndex = ref<number>(-1)
    activeIndex.value = props.activeIndex
    
    const changeActiveIndex = (index: number) => {
        activeIndex.value = index
        emits('changeActiveIndex', index)
    }
</script>

<style scoped lang="scss">
    $btn-height: .32rem;
    $btn-width: 0.8rem;
    $tips-height: 0.08rem;
    .module-box {
        width: 6rem;
        padding: $grid-2 $grid-3;
        
        .box-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: $grid-4;
        }
        
        .box-title {
            font-size: .16rem;
            font-weight: 700;
            background: linear-gradient(90deg, var(--el-text-color-primary) 0%, var(--el-color-primary-dark-2) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            letter-spacing: .005rem;
            border-left: .04rem solid var(--el-color-primary);
            padding-left: $grid-1;
        }
        
        .box-menus {
            display: flex;
            gap: $grid-2;
            
            .menu-item {
                height: $btn-height;
                line-height: $btn-height;
                background: var(--el-bg-color-overlay);
                color: var(--el-text-color-primary);
                padding: 0 $grid-3;
                border-radius: $border-radius-1;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                letter-spacing: .005rem;
                
                &:hover {
                    background: var(--el-color-primary-light-8);
                    color: #fff;
                    box-shadow: 0 0 .15rem var(--el-box-shadow-color);
                    //transform: translateY(-2px);
                }
            }
            
            .menu-item.active {
                background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-5));
                color: #fff;
                box-shadow: 0 0 .2rem var(--el-color-primary-light-5);
                
                &::before,
                &::after {
                    content: "";
                    display: block;
                    width: 0;
                    height: 0;
                    border-top: calc($tips-height / 2) solid transparent;
                    border-bottom: calc($tips-height / 2) solid transparent;
                    position: absolute;
                    top: calc(($btn-height - $tips-height) / 2);
                }
                
                &::before {
                    left: calc($tips-height - 0.02rem);
                    border-left: $tips-height solid var(--el-color-warning-dark-2);
                }
                
                &::after {
                    right: calc($tips-height - 0.02rem);
                    border-right: $tips-height solid var(--el-color-warning-dark-2);
                }
            }
        }
        
    }
</style>