<template>
    <div class="smokeBar module-box">
        <div class="module-top">
            <div class="module-title">烟条状态</div>
            <div class="module-title-decoration"></div>
        </div>
        <div class="module-bottom">
            <!-- 烟条状态数据 -->
            <el-scrollbar height="100%">
                <div class="left">
                    <template v-for="(item, index) in barList" :key="index">
                        <div class="bars-box">
                            <div class="bars1">
                                <template
                                    v-for="(bar, bari) in item"
                                    :key="bar.id"
                                >
                                    <div
                                        v-if="bari < 3"
                                        class="bar-item"
                                        :class="`status-${bar.status}`"
                                    >
                                        {{ bar.id }}
                                    </div>
                                </template>
                            </div>
                            <div class="bars2">
                                <template
                                    v-for="(bar, bari) in item"
                                    :key="bar.id"
                                >
                                    <div
                                        v-if="bari >= 3"
                                        class="bar-item"
                                        :class="`status-${bar.status}`"
                                    >
                                        {{ bar.id }}
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </el-scrollbar>
                <!-- 烟炉详细信息 -->
                <div class="right">
                    <div class="info-item">
                        <div class="item-label">站点名称：</div>
                        <div class="item-value">{{ currentStove.strName }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">联系电话：</div>
                        <div class="item-value">
                            {{ currentStove.strMacPhoneNum }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">状态时间：</div>
                        <div class="item-value">{{ currentStove.currentTime }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">燃烧烟条：</div>
                        <div class="item-value">{{ currentStove.burningCount }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">已用烟条：</div>
                        <div class="item-value">{{ currentStove.usedCount }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">可用烟条：</div>
                        <div class="item-value">{{ currentStove.availableCount }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">点火状态：</div>
                        <div
                            class="item-value item-status"
                            :class="`status-${stoveObj.status1}`"
                        ></div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">在线状态：</div>
                        <div
                            class="item-value item-status"
                            :class="`status-${stoveObj.isOnline}`"
                        ></div>
                    </div>
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch,onMounted,onBeforeUnmount } from "vue";
const currentStove = inject("currentStove", { stoveID: "",availableCount:0,usedCount:0,burningCount:0 });
watch(currentStove,()=>{
    console.log(currentStove)
})
import {eventbus} from '~/eventbus/index'
const process = (obj)=>{
    if(!Array.isArray(obj)){
        console.log('--->',obj)
        if(obj.res_type == 'STATUS'&&obj.hasOwnProperty('res_content')){
            barList.forEach((item,j)=>{
                item.forEach((it,i)=>{
                    it.status = Number(obj.res_content.substring(j*7+i,j*7+i+1))
                })
            })
            currentStove.availableCount = obj.res_content.split('').filter(item=>item == '1').length
            currentStove.usedCount = obj.res_content.split('').filter(item=>item == '0').length
            currentStove.burningCount = obj.res_content.split('').filter(item=>item == '3').length
            console.log('count',currentStove.availableCount)
        }else if(obj.hasOwnProperty('b_online')){
            stoveObj.isOnline = obj.b_online?1:3;
        }
    }
}
onMounted(()=>{
    eventbus.on('烟炉数据',process)
})
onBeforeUnmount(()=>{
    eventbus.off('烟炉数据',process)
})

// 假烟炉数据
const stoveObj = reactive({
    key1: 0,
    key2: 0,
    key3: 0,
    ndid: "",
    ndtype: "",
    stoveopen: "",
    stovetype: "1",
    strMacPhoneNum: currentStove.strMacPhoneNum,
    strMgrUnit: "110108183",
    strName: "新塔2烟炉(海淀）",
    strStoveID: "110108XT2",
    tagPos: "116101199E40000000N",
    status1: 0,
    isOnline: 0,
});

let barList = reactive([
    [
        { id: 1, status: 0 },
        { id: 2, status: 0 },
        { id: 3, status: 0 },
        { id: 4, status: 0 },
        { id: 5, status: 0 },
        { id: 6, status: 0 },
        { id: 7, status: 0 },
    ],
    [
        { id: 8, status: 0 },
        { id: 9, status: 0 },
        { id: 10, status: 0 },
        { id: 11, status: 0 },
        { id: 12, status: 0 },
        { id: 13, status: 0 },
        { id: 14, status: 0 },
    ],
    [
        { id: 15, status: 0 },
        { id: 16, status: 0 },
        { id: 17, status: 0 },
        { id: 18, status: 0 },
        { id: 19, status: 0 },
        { id: 20, status: 0 },
        { id: 21, status: 0 },
    ],
    [
        { id: 22, status: 0 },
        { id: 23, status: 0 },
        { id: 24, status: 0 },
        { id: 25, status: 0 },
        { id: 26, status: 0 },
        { id: 27, status: 0 },
        { id: 28, status: 0 },
    ],
    [
        { id: 29, status: 0 },
        { id: 30, status: 0 },
        { id: 31, status: 0 },
        { id: 32, status: 0 },
        { id: 33, status: 0 },
        { id: 34, status: 0 },
        { id: 35, status: 0 },
    ],
    [
        { id: 36, status: 0 },
        { id: 37, status: 0 },
        { id: 38, status: 0 },
        { id: 39, status: 0 },
        { id: 40, status: 0 },
        { id: 41, status: 0 },
        { id: 42, status: 0 },
    ],
    [
        { id: 43, status: 0 },
        { id: 44, status: 0 },
        { id: 45, status: 0 },
        { id: 46, status: 0 },
        { id: 47, status: 0 },
        { id: 48, status: 0 },
        { id: 49, status: 0 },
    ],
    [
        { id: 50, status: 0 },
        { id: 51, status: 0 },
        { id: 52, status: 0 },
        { id: 53, status: 0 },
        { id: 54, status: 0 },
        { id: 55, status: 0 },
        { id: 56, status: 0 },
    ],
]);
</script>

<style lang="scss" scoped>
$item-label-width: 0.7rem;
.smokeBar {
    height: 100%;
    .module-bottom {
        height: calc(100% - 0.2rem);
        overflow-y: auto;
        display: flex;
        .left {
            flex: 2;
            margin-right: $grid-2;
            display: flex;
            flex-wrap: wrap;
            .bars-box {
                display: flex;
                flex-direction: column;
                align-items: center;
                // margin-bottom: 0.04rem;
                // &:nth-last-child(-n+2){
                //     margin-bottom: 0;
                // }
                &:nth-child(2n) {
                    margin-left: $grid-1;
                }
                .bars1,
                .bars2 {
                    display: flex;
                }
                .bar-item {
                    width: 0.2rem;
                    height: 0.2rem;
                    border-radius: 0.2rem;
                    line-height: 0.2rem;
                    text-align: center;
                    // border: 1px solid var(--el-border-color);
                    margin: 0.02rem;
                    font-size: 0.12rem;
                    color: var(--el-text-color-primary);
                }
            }
        }
        .right {
            .info-item {
                flex: 1;
                margin-bottom: 0.08rem;
                display: flex;
                .item-label {
                    width: $item-label-width;
                }
                .item-value {
                    width: calc(100% - $item-label-width);
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
                .item-status {
                    width: 0.2rem;
                    height: 0.2rem;
                    border-radius: 0.2rem;
                    // border: 1px solid var(--el-border-color);
                }
            }
        }
        // 状态风格
        .status-0 {
            background-color: gray;
        }
        .status-1 {
            background-color: var(--el-color-success-light-5);
        }
        .status-2 {
            background-color: var(--el-color-primary-light-5);
        }
        .status-3 {
            background-color: var(--el-color-danger-light-5);
        }
    }
}
</style>
