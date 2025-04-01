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
                        <div class="item-value">{{ stoveObj.strName }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">联系电话：</div>
                        <div class="item-value">
                            {{ stoveObj.strMacPhoneNum }}
                        </div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">状态时间：</div>
                        <div class="item-value">{{ stoveObj.strStoveID }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">燃烧烟条：</div>
                        <div class="item-value">{{ stoveObj.key1 }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">已用烟条：</div>
                        <div class="item-value">{{ stoveObj.key2 }}</div>
                    </div>
                    <div class="info-item">
                        <div class="item-label">可用烟条：</div>
                        <div class="item-value">{{ stoveObj.key3 }}</div>
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
                            :class="`status-${stoveObj.status2}`"
                        ></div>
                    </div>
                </div>
            
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch } from "vue";
let stoveID = inject("stoveID");
watch(stoveID, (newVal) => {
    // console.log("stoveIDBar",newVal);
});
// 假烟炉数据
let stoveObj = ref({
    key1: 0,
    key2: 0,
    key3: 0,
    ndid: "",
    ndtype: "",
    stoveopen: "",
    stovetype: "1",
    strMacPhoneNum: "18210932269",
    strMgrUnit: "110108183",
    strName: "新塔2烟炉(海淀）",
    strStoveID: "110108XT2",
    tagPos: "116101199E40000000N",
    status1: 0,
    status2: 1,
});

let barList = [
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
];
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
            background-color: var(--el-color-primary-light-5);
        }
        .status-1 {
            background-color: var(--el-color-success-light-5);
        }
        .status-2 {
            background-color: var(--el-color-danger-light-5);
        }
    }
}
</style>
