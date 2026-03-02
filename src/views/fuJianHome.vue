<template>
    <div class="fu-jian-home">
        <div class="nav-box">
            <template v-for="(item,index) in btnList" :key="index">
                <div class="nav-item" :class="{'active':item.label == activeNav}" @click="activeNav=item.label">
                    {{ item.label }}
                </div>
            </template>
        </div>
        <div class="page-box">
            <AirspaceApply v-show="activeNav=='指挥实施'"></AirspaceApply>
            <div v-if="activeNav=='历史作业记录'">历史作业记录</div>
            <Transport v-if="activeNav=='空域流转信息'"></Transport>
            <FinishedInfo v-if="activeNav=='完成信息查询'"></FinishedInfo>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { defineAsyncComponent, onMounted, ref } from 'vue'
    import AirspaceApply from '~/airspaceApply.vue' //空域申请
    import Transport from '~/myComponents/人影/transport.vue'
    import FinishedInfo from '~/myComponents/人影/finishedInfo.vue'
    //const Transport = defineAsyncComponent(() => import('~/myComponents/人影/transport.vue'))
    //const FinishedInfo = defineAsyncComponent(() => import('~/myComponents/人影/finishedInfo.vue'))
    const activeNav = ref<string>('指挥实施')
    const btnList = [{
        label: '指挥实施',
    }, {
        label: '历史作业记录',
    }, {
        label: '空域流转信息',
    }, {
        label: '完成信息查询',
    },]
    import { 历史作业数据,完成信息查询 } from '~/api/天工'
    onMounted(()=>{
        历史作业数据({range:['2023-08-01','2026-08-02'],page:1,size:10}).then(res=>{
            console.log('历史作业记录|空域流转信息',res.data)
        })
        完成信息查询({page:1,size:10}).then(res=>{
            console.log('完成信息查询',res.data)
        })
    })
</script>

<style scoped lang="scss">
    .fu-jian-home {
        width: 100vw;
        height: 100vh;
        background-color: var(--bg-color-1);
        display: grid;
        grid-template-rows: auto 1fr;
        
        .nav-box {
            padding: $grid-3;
            display: flex;
            gap: $grid-2;
            border-bottom: 1px solid var(--el-color-primary-light-7);
            background-color: var(--bg-color-2);
            box-shadow: 0 .02rem .08rem var(--el-color-primary-light-5);
            
            .nav-item {
                height: .36rem;
                padding: 0 $grid-3;
                line-height: .36rem;
                border-radius: .05rem;
                background-color: var(--bg-color-3);
                color: var(--text-blue-1);
                
                &:hover {
                    background-color: #fff;
                }
                
                &.active {
                    background-color: #fff;
                }
            }
        }
        
        .page-box {
            padding: $grid-3;
        }
    }
</style>