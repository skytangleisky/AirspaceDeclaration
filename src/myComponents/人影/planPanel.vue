<template>
    <div class="planPanel wstd-container"
         style="z-index: 1;height:fit-content;width: fit-content;">
        <div class="content-box wstd-content"
             v-show="tabActive !== ''">
            <div class="content-box-top">
                <div class="content-box-title">{{tabActive}}</div>
                <div class="close-btn" @click="tabActive = ''">
                    <el-button size="large" type="primary" link>
                        <el-icon color="#126Ae1" :size="20">
                            <Close />
                        </el-icon>
                    </el-button>
                </div>
            </div>
           
            <div class="main-content">
                <el-scrollbar height="100%">
                    <!-- 当前作业进度，今日作业记录 -->
                    <div
                        v-for="(v, k) in props"
                        :label="k"
                        v-show="tabActive == k"
                    >
                        <Work :v="v"/>
                    </div>
                    <!-- 空域流转信息 -->
                    <div v-show="tabActive == '空域流转信息'">
                        <Transport :data="props.今日作业记录"/>
                    </div>
                    <div v-show="tabActive == '完成信息查询'">
                        <FinishedInfo></FinishedInfo>
                    </div>
                    <div v-show="tabActive == '人影飞机'">
                        <PlaneInfo></PlaneInfo>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="btns-box">
            <template v-for="(item, index) in tabList" :key="index">
                <div
                    v-if="hasPermission(item.permissions)"
                    style="pointer-events: auto;"
                    @click="tabActive ==item.label ? tabActive= '' : tabActive = item.label"
                >
                    <el-badge :value="item.total" type="success" :hidden="item.hideBadge">
                        <!--<el-tooltip :content="item.label" :show-after="500">-->
                        <div
                            :class="{ active: tabActive == item.label,box:true,'map-tool-btn':true }"
                            style="user-select: none;cursor:pointer"
                        >
                            <div class="tool-btn-inside">
                                <svg-icon :name="item.icon" width=".24rem" height=".24rem"></svg-icon>
                            </div>
                        </div>
                        <!--</el-tooltip>-->
                    </el-badge>
                </div>
            </template>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { useSysStatusStore } from '~/stores/sysStatus'
    import { Close } from '@element-plus/icons-vue'
    const sys = useSysStatusStore()
    import { hasPermission } from '~/tools'
    import Work from './work.vue'
    import { defineAsyncComponent, reactive, ref, watch, computed } from 'vue'
    import closeSvg from '~/assets/close.svg?raw'
    const Transport = defineAsyncComponent(() => import('./transport.vue'))
    const FinishedInfo = defineAsyncComponent(() => import('./finishedInfo.vue'))
    const PlaneInfo = defineAsyncComponent(() => import('./planeInfo.vue'))
    import { useSettingStore } from '../../stores/setting'
    const isDark = ref(false)
    // top按钮渲染数据
    const tabList = reactive([{
        permissions: ['04bca30f-14c9-4b4c-a93e-1155b792250e'],
        label: '当前作业进度',
        icon: 'progress',
        type: 'progress',
        total: computed(() => props.当前作业进度.length),
    }, {
        permissions: ['2c50aec7-971a-4dfc-b93a-384738f0c9cf'],
        label: '今日作业记录',
        icon: 'plan-fill',
        type: 'PLANFILL',
        total: computed(() => props.今日作业记录.length),
    }, {
        permissions: ['1cb7188d-4da9-47b9-b694-504d73252609'],
        label: '空域流转信息',
        icon: 'transferInfo',
        type: 'transferInfo',
        total: computed(() => props.今日作业记录.length),
    }, {
        permissions: ['9ab19aac-6926-4667-a749-5dfd09869198'],
        label: '完成信息查询',
        icon: 'tasks',
        type: '完成信息查询',
        total: 0,
        hideBadge: true,
    }, {
        permissions: ['773bffb5-1507-4e8b-a16c-bcb584882f87'],
        label: '人影飞机',
        icon: 'plane',
        total: computed(() => sys.需要重点关注的飞机.length),
        hideBadge: false,
    },])
    const tabActive = ref('')
    const props = withDefaults(defineProps<{
        当前作业进度: any[]; 今日作业记录: any[];
    }>(), {
        当前作业进度: () => new Array<any>(),
        今日作业记录: () => new Array<any>(),
    })

</script>
<style scoped lang="scss">
    .planPanel {
        position: absolute;
        left: $page-padding;
        bottom: $page-padding;
        // top: 300px;
        .content-box {
            width:8.4rem;
            position: relative;
            margin-bottom: $grid-5;
        }
        
        .btns-box {
            margin-top: $grid-3;
            margin-bottom: 0;
        }
        
        .el-tabs {
            border-radius: $border-radius-1;
            
            ::v-deep(.el-tabs__header .el-tabs__item) {
                transition-duration: 0s;
            }
            
            ::v-deep(.el-tabs__content) {
                padding: $grid-2;
            }
            
            .el-tab-pane {
                max-height: 360px;
                overflow-y: auto;
            }
        }
    }
</style>
