<template>
    <div class="menu-container">
        <div class="box-top">
            <div class="box-title">{{ renderTitle }}</div>
            <div class="box-menus">
                <div class="menu-item" v-for="(item,index) in menuList"
                     :class="activeIndex==index?'active':''" @click="changeMenu(index)">{{ item.label }}
                </div>
            </div>
        </div>
        <div class="box-bottom">
            <transition name="fade" mode="out-in">
                <keep-alive>
                    <component
                        :is="currentComponent"
                    ></component>
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
    import {computed, defineAsyncComponent, ref, watch, markRaw} from 'vue'
    
    // 异步加载组件（按需加载） 组件定义是静态的，不需要响应式更新
    const defineMarkedAsyncComponent = (importer: () => Promise<any>) => {
        return markRaw(defineAsyncComponent(importer))
    }
    //人影参数相关组件
    const LocalRy = defineMarkedAsyncComponent(() => import("./ryParams/localRy.vue"))
    const RyUnit = defineMarkedAsyncComponent(() => import("./ryParams/ryUnit.vue"))
    const RyOperationPoint = defineMarkedAsyncComponent(() => import("./ryParams/ryOperationPoint.vue"))
    //辅助管理相关组件
    const VoiceSet = defineMarkedAsyncComponent(() => import ("./assistantMana/set.vue"))
    const UserMana = defineMarkedAsyncComponent(() => import ("./assistantMana/userMana.vue"))
    const RoleMana = defineMarkedAsyncComponent(() => import ("./assistantMana/roleMana.vue"))
    //历史查询统计
    const jobHistory = defineMarkedAsyncComponent(()=>import("./historyQuery/jobHistory.vue"))
    const operationPointStatistics = defineMarkedAsyncComponent(()=>import("./historyQuery/operationPointStatistics.vue"))
    const replyStatistics = defineMarkedAsyncComponent(()=>import("./historyQuery/replyStatistics.vue"))
    const violationRecord = defineMarkedAsyncComponent(()=>import("./historyQuery/violationRecord.vue"))
    
    const props = defineProps({
        activeContent: {
            type: String,
        }
    })
    
    
    interface MenuItem {
        label: string;
        component: any;
    }
    
    interface RenderItem {
        title: string;
        menuList: MenuItem[];
        defaultIndex: number;
    }
    
    
    const renderData: RenderItem[] = [{
        title: '人影参数',
        menuList: [{
            label: "本地人影",
            component: LocalRy
        }, {
            label: "人影单位",
            component: RyUnit
        }, {
            label: "人影作业点",
            component: RyOperationPoint
        }],
        defaultIndex: 1
    }, {
        title: '辅助管理',
        menuList: [{
            label: "语音设置",
            component: VoiceSet
        }, {
            label: "用户管理",
            component: UserMana
        }, {
            label: "角色管理",
            component: RoleMana
        }],
        defaultIndex: 0
    },{
        title: '历史查询统计',
        menuList: [{
            label: "作业历史",
            component: jobHistory
        }, {
            label: "作业点使用统计",
            component: operationPointStatistics
        }, {
            label: "批复率统计",
            component: replyStatistics
        }, {
            label: "违规记录",
            component: violationRecord
        }],
        defaultIndex: 0
    },]
    
    
    const menuList = ref<MenuItem[]>([])
    const renderTitle = ref<string>("")
    const activeIndex = ref<number>(0)
    
    watch(() => props.activeContent, newVal => {
        const renderIndex = renderData.findIndex(item => {
            return item.title == newVal
        })
        menuList.value = renderData[renderIndex].menuList
        renderTitle.value = renderData[renderIndex].title
        activeIndex.value = renderData[renderIndex].defaultIndex
    }, {immediate: true})
    
    //获取动态组件
    const currentComponent = computed(() => {
        if (menuList.value.length === 0) {
            return
        } else {
            return menuList.value[activeIndex.value].component
        }
    })
    
    
    /**
     * 切换菜单
     * @param index - 菜单索引
     */
    const changeMenu = (index: number) => {
        activeIndex.value = index
    }
</script>

<style scoped lang="scss">
    $btn-height: .32rem;
    $btn-width: 0.8rem;
    $tips-height: 0.08rem;
    .menu-container {
        width: 6rem;
        padding: $grid-2 $grid-3;
        
        .fade-enter-active,
        .fade-leave-active {
            transition: opacity 0.25s ease, transform 0.25s ease;
        }
        
        .fade-enter-from,
        .fade-leave-to {
            opacity: 0;
        }
        
        .fade-enter-from {
            transform: translateX(.2rem);
        }
        
        .fade-leave-to {
            transform: translateX(.2rem);
        }
        
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