<template>
    <div class="globalOperation">
        <el-tabs v-model="activeName" @tab-click="tabClickHandle">
            <el-scrollbar height="100%">
                <el-tab-pane label="烟炉状态" name="first">
                    <div class="smoke-stove-box">
                        <template
                            v-for="(item, index) in smokeStoveList"
                            :key="index"
                        >
                            <div
                                class="smoke-stove-item"
                                :class="{ active: currentStove.stoveID == item.strStoveID }"
                                @click="chooseSmokeStove(item)"
                            >
                                <div class="stove-item-top">
                                    {{ item.strName }}
                                </div>
                                <div class="stove-item-bottom">
                                    <div class="stove-status">
                                        <div class="stove-status-label">
                                            燃烧
                                        </div>
                                        <div class="stove-status-value">
                                            {{ item.burningCount }}
                                        </div>
                                    </div>
                                    <div class="stove-status">
                                        <div class="stove-status-label">
                                            已用
                                        </div>
                                        <div class="stove-status-value">
                                            {{ item.usedCount }}
                                        </div>
                                    </div>
                                    <div class="stove-status">
                                        <div class="stove-status-label">
                                            可用
                                        </div>
                                        <div class="stove-status-value">
                                            {{ item.availableCount }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </el-tab-pane>
            </el-scrollbar>
            <el-tab-pane label="消息" name="second">消息</el-tab-pane>
            <el-tab-pane label="作业历史" name="third">作业历史</el-tab-pane>
            <el-tab-pane label="功能扩展" name="fourth">功能扩展</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch, computed, onMounted, onBeforeUnmount } from "vue";
import type { TabsPaneContext } from "element-plus";
import { 烟炉数据,查询烟条状态 } from "~/api/天工.js";
import moment from "moment";
import {eventbus} from '~/eventbus/index'
let activeName = ref("first"); //当前选择的tab名字
const smokeStoveList = inject('smokeStoveList',reactive([]))
let currentStove = inject<{stoveID:string,availableCount:number}>("currentStove",reactive({stoveID:'',availableCount:0,burningCount:0})); //当前选中的烟炉
//选择烟炉
function chooseSmokeStove(item) {
    Object.assign(currentStove,item)
}
// 获取所有烟炉数据
function getSmokeStoveList() {
    烟炉数据()
        .then((res) => {
            let data = res.data.results;
            // 给燃烧、已用、可用添加默认值
            data.forEach((item) => {
                item.burningCount = 0;
                item.usedCount = 0;
                item.availableCount = 0;
                查询烟条状态(item.strStoveID)
            });
            smokeStoveList.splice(0,smokeStoveList.length,...data);
            if (!currentStove.stoveID) {
                Object.assign(currentStove,data[0])
            }
            currentStove.currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
        })
        .catch((err) => {
            console.log(err);
        });
}

// 切换tab
const tabClickHandle = (tab: TabsPaneContext, event: Event) => {
    activeName.value = tab.paneName;
    // console.log(tab.paneName, tab.active, tab.index);
};
const process = (obj)=>{
    if(!Array.isArray(obj)){
        console.log('--->',obj)
        if(obj.res_type == 'STATUS'&&obj.hasOwnProperty('res_content')){
            for(let i=0;i<smokeStoveList.length;i++){
                if(smokeStoveList[i].strStoveID == obj.stove_id){
                    smokeStoveList[i].availableCount = obj.res_content.split('').filter(item=>item == '1').length;
                    smokeStoveList[i].usedCount = obj.res_content.split('').filter(item=>item == '0').length;
                    smokeStoveList[i].burningCount = obj.res_content.split('').filter(item=>item == '3').length;
                    break;
                }
            }
        }
        // else if(obj.hasOwnProperty('b_online')){
        //     stoveObj.isOnline = obj.b_online?1:3;
        // }
    }
}
const getData = ()=>{
    getSmokeStoveList()
}
onMounted(()=>{
    eventbus.on('烟炉数据',process)
    eventbus.on('烟炉websocket已连接',getData)
})
onBeforeUnmount(()=>{
    eventbus.off('烟炉数据',process)
    eventbus.off('烟炉websocket已连接',getData)
})
</script>

<style lang="scss" scoped>
.globalOperation {
    width: 100%;
    height: 100%;
    .smoke-stove-box {
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        .smoke-stove-item {
            width: calc((100% - 7 * $grid-3) / 8);
            padding: $grid-2;
            background-color: var(--color-bule-light-8);
            border-radius: $border-radius-2;
            margin-top: $grid-3;
            box-sizing: border-box;
            color:var(--el-color-white);
            &:not(:nth-child(8n)) {
                margin-right: $grid-3;
            }
            &:nth-child(-n + 8) {
                margin-top: 0;
            }
            .stove-item-top {
                margin-bottom: $grid-1;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .stove-item-bottom {
                display: flex;
                justify-content: space-between;
                .stove-status {
                    text-align: center;
                    color: var(--el-color-warning);
                    &:first-child {
                        color: var(--el-color-danger);
                    }
                    &:last-child {
                        color: var(--el-color-success);
                    }
                    .stove-status-label {
                        // color: var(--el-text-color-regular);
                    }
                    .stove-status-value {
                        font-size: 0.16rem;

                        margin-top: 0.04rem;
                        font-weight: 600;
                    }
                }
            }
            &:hover {
                // transform: translateY(0.04rem);;
                background-color: #3967d2;
                box-shadow: var(--el-box-shadow-light);
            }
        }
        .smoke-stove-item.active {
            // transform: translateY(0.04rem);;
            background-color: #2256cd;

            box-shadow: var(--el-box-shadow-light);
        }
    }
}
.el-tabs {
    height: 100%;
}
.el-tabs:deep(.el-tabs__content) {
    overflow-y: auto;
    padding-top: $grid-3;
}
.el-tabs:deep(.el-tabs__header) {
    margin: 0;
}
.el-tabs:deep(.el-tabs__item) {
    height: 0.32rem;
    color: var(--el-text-color-regular);
}
.el-tabs:deep(.el-tabs__item.is-active) {
    height: 0.32rem;
    color: var(--el-color-primary);
}
</style>
