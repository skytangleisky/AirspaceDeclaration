<template>
    <div class="globalOperation">
        <el-tabs v-model="activeName" @tab-click="tabClickHandle">
            <el-tab-pane label="烟炉状态" name="first">
                <div class="smoke-stove-box">
                    <template
                        v-for="(item, index) in smokeStoveList"
                        :key="index"
                    >
                        <div
                            class="smoke-stove-item"
                            :class="{ active: stoveID == item.strStoveID }"
                            @click="chooseSmokeStove(item)"
                        >
                            <div class="stove-item-top">{{ item.strName }}</div>
                            <div class="stove-item-bottom">
                                <div class="stove-status">
                                    <div class="stove-status-label">燃烧</div>
                                    <div class="stove-status-value">
                                        {{ item.key1 }}
                                    </div>
                                </div>
                                <div class="stove-status">
                                    <div class="stove-status-label">已用</div>
                                    <div class="stove-status-value">
                                        {{ item.key2 }}
                                    </div>
                                </div>
                                <div class="stove-status">
                                    <div class="stove-status-label">可用</div>
                                    <div class="stove-status-value">
                                        {{ item.key3 }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </el-tab-pane>
            <el-tab-pane label="消息" name="second">消息</el-tab-pane>
            <el-tab-pane label="作业历史" name="third">作业历史</el-tab-pane>
            <el-tab-pane label="功能扩展" name="fourth">功能扩展</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, inject,watch } from "vue";
import type { TabsPaneContext } from "element-plus";
import { 烟炉数据 } from '~/api/天工.js'
let activeName = ref("first"); //当前选择的tab名字
let smokeStoveList = ref([]); //烟炉数据
let stoveID = inject("stoveID"); //当前选中的烟炉ID
watch(
    activeName,
    (newVal, oldVal) => {
        switch (newVal) {
            case "first":
                getSmokeStoveList();
                break;
            default:
                break;
        }
    },
    {
        immediate: true,
    }
);

//选择烟炉
function chooseSmokeStove(item) {
    stoveID.value = item.strStoveID;
}
// 获取所有烟炉数据
function getSmokeStoveList() {
    烟炉数据()
        .then((res) => {
            let data = res.data.results;
            // 给燃烧、已用、可用添加默认值
            data.forEach((item) => {
                item.key1 = 0;
                item.key2 = 0;
                item.key3 = 0;
            });
            smokeStoveList.value = data;
            if (!stoveID.value) {
                stoveID.value = data[0].strStoveID;
            }
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
            background-color: var(--el-color-primary-opacity-3);
            border-radius: $border-radius-2;
            margin-top: $grid-3;
            box-sizing: border-box;
            color: var(--el-text-color-primary);
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
                transform: translate(0.04rem, -0.04rem);
                background-color: var(--el-color-primary-light-3);
            }
        }
        .smoke-stove-item.active {
            transform: translate(0.04rem, -0.04rem);
            background-color: var(--el-color-primary);

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
    height: .32rem;
    color: var(--el-text-color-regular);
}
.el-tabs:deep(.el-tabs__item.is-active) {
    height: .32rem;
    color: var(--el-color-primary);
}
</style>
