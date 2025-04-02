<template>
    <div class="planPanel z-1">
        <div class="top">
            <div
                v-for="(item, index) in tabList"
                :key="index"
                class="top-item"
                @click="switchTab(index + 1)"
            >
                <el-badge :value="item.total" type="success">
                    <div
                        class="box map-btn"
                        :class="{ active: tabActive - 1 == index }"
                    >
                        <svg-icon :name="item.icon"></svg-icon>
                        <span class="label">{{ item.label }}</span>
                    </div>
                </el-badge>
            </div>
        </div>
        <div class="bottom" v-show="tabActive > 0">
            <div class="close-btn" @click="tabActive = 0">
                <el-icon><Close /></el-icon>
                <div class="bottom-content">
                    <el-scrollbar height="100%">
                        <!-- 当前作业进度 -->
                        <div v-show="tabActive == 1"></div>
                        <!-- 今日作业记录 -->
                        <div v-show="tabActive == 2"></div>
                        <!-- 人影飞机 -->
                        <div v-show="tabActive == 3"></div>
                    </el-scrollbar>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
import moment from "moment";
import { defineAsyncComponent, reactive, ref } from "vue";
import { Close } from "@element-plus/icons-vue";
const Transport = defineAsyncComponent(() => import("./transport.vue"));

// top按钮渲染数据
const tabList = reactive([
    {
        label: "当前作业进度",
        icon: "progress",
        type: "progress",
        total: 0,
    },
    {
        label: "今日作业记录",
        icon: "plan-fill",
        type: "PLANFILL",
        total: 0,
    },
    {
        label: "人影飞机",
        icon: "plane",
        type: "PLANE",
        total: 0,
    },
]);
const tabActive = ref(0);
// 切换top按钮
const switchTab = (index) => {
    tabActive.value = index;
};

const station = useStationStore();
const click = (item: planDataType) => {
    station.人影界面被选中的设备 = item.strZydID;
    eventbus.emit("人影-将站点移动到屏幕中心", { strPos: item.strCurPos });
};
function beginText(item: planDataType) {
    if (工作状态格式化(item.ubyStatus) == "作业批准") {
        let seconds = moment(item.tmBeginAnswer).diff(moment(), "seconds");
        return "(" + Math.floor(seconds / 60) + ":" + (seconds % 60) + ")开始";
    }
    return (
        "开始" +
        (item.tmBeginAnswer
            ? "(" +
              moment(item.tmBeginAnswer, "YYYY-MM-DD HH:mm:ss").format(
                  "HH:mm:ss"
              ) +
              ")"
            : "")
    );
}
function endSeconds(item: planDataType) {
    return moment(item.tmBeginAnswer)
        .add(item.iAnswerTimeLen, "s")
        .diff(moment(), "seconds");
}
export type zyddataType = {
    strWorkID: string;
    strZydID: string;
    ubyStatus: number;
    ubySendStatus: number;
    ubyProcStatus: number;
    strCode: string;
    strName: string;
    strWeapon: string;
    strCurPos: string;
    iRange: number;
    iMaxShotHei: number;
    strApplyUnit: string;
    tmBeginApply: string;
    iApplyTimeLen: number;
    tmApplyRev: null;
    tmApplySend: null;
    tmApplyCreate: string;
    strApplyMark: "";
    tmBeginAnswer: string;
    iAnswerTimeLen: number;
    strAnswerUnit: string;
    tmAnswerRev: string;
    tmAnswerSend: string;
    tmAnswerCreate: string;
    strAnswerMark: "";
    tmUpdate: string;
    strATCUnitID: string;
    vecProcess: ";11:47:06,本地作业申请(电话);11:47:15,电话下发批准;11:47:16,作业自动开始";
    strUpApplyUnit: string;
    tmBeginActing: string;
    iActingTimeLen: number;
    strEndUnit: string;
    tmEndRev: null;
    tmEndSend: null;
    tmEndCreate: null;
    strEndMark: "";
    iEndType: 0;
    bApplyValid: 0;
    bAnswerValid: 1;
    bEndValid: 0;
    iAngleBegin: number;
    iAngleEnd: number;
    bAnswerAccept: 1;
    tmEnd: null;
    bRevOver: null;
    ubyWorkCat: 0;
};
export type planDataType = {
    unitName: string;
} & zyddataType;
const props = withDefaults(
    defineProps<{
        当前作业进度: planDataType[];
        今日作业记录: planDataType[];
    }>(),
    {
        当前作业进度: () => new Array<planDataType>(),
        今日作业记录: () => new Array<planDataType>(),
    }
);
function 获取空域状态(item: planDataType) {
    if (item.ubyStatus == 91) {
        return "地面作业使用中";
    } else if (item.ubyStatus == 75) {
        return "未使用";
    }
    {
        return "";
    }
}
const 工作状态格式化 = (key: number) => {
    let status = [
        { key: 0, value: "空闲" },
        { key: 9, value: "作业完成" },
        { key: 70, vlaue: "作业保存" },
        { key: 72, value: "作业申请待批复" },
        { key: 73, value: "撤销申请待回执" },
        { key: 74, value: "已撤销" },
        { key: 75, value: "作业批准" },
        { key: 76, value: "作业不批准" },
        { key: 90, value: "作业开始带回执" },
        { key: 91, value: "作业开始" },
        { key: 92, value: "作业暂停待回执" },
        { key: 93, value: "作业强制终止" },
        { key: 99, value: "人工移除" },
        { key: 100, value: "作业结束" },
    ];
    return (
        status.filter((item) => item.key == key)[0]?.value || `未知状态${key}`
    );
};
const 发送状态格式化 = (key: number) => {
    let status = [
        { key: 0, value: "空闲" },
        { key: 1, value: "等待发送" },
        { key: 2, value: "发送中" },
        { key: 3, value: "发送成功" },
        { key: 4, value: "发送失败" },
    ];
    return (
        status.filter((item) => item.key == key)[0]?.value || `未知状态${key}`
    );
};
const 申请 = (item: planDataType) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "bg-#3D5E86";
        case "作业申请待批复":
            return "bg-#67c23a";
        case "作业不批准":
            return "bg-#3D5E86";
        case "作业批准":
            return "bg-#67c23a";
        case "作业开始":
            return "bg-#67c23a";
        default:
            return "bg-#1E3148";
    }
};
const 批复 = (item: planDataType) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "bg-#3D5E86";
        case "作业不批准":
            return "bg-#3D5E86";
        case "作业批准":
            return "bg-#67c23a";
        case "作业开始":
            return "bg-#67c23a";
        default:
            return "bg-#1E3148";
    }
};
const 开始 = (item: planDataType) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "bg-#3D5E86";
        case "作业不批准":
            return "bg-#f56c6c";
        case "作业开始":
            return "bg-#67c23a";
        default:
            return "bg-#1E3148";
    }
};
const 结束 = (item: planDataType) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "bg-#3D5E86";
        case "作业不批准":
            return "bg-#f56c6c";
        default:
            return "bg-#1E3148";
    }
};
const 完成 = (item: planDataType) => {
    switch (工作状态格式化(item.ubyStatus)) {
        case "作业结束":
            return "bg-#3D5E86";
        case "作业不批准":
            return "bg-#f56c6c";
        default:
            return "bg-#1E3148";
    }
};
</script>
<style scoped lang="scss">
.planPanel {
    position: absolute;
    left: $page-padding;
    bottom: $page-padding;
    // top: 300px;

    .map-btn {
        border-radius: $border-radius-1;
        background-color: var(--el-bg-color-opacity-8);
        border: 0.01rem solid var(--el-border-color);
        &:hover {
            border-color: var(--el-color-primary);
        }
    }
    .map-btn.active {
        background-color: var(--el-color-primary-opacity-3);
        border-color: var(--el-color-primary);
        color: var(--el-text-color-primary);
    }
    .top {
        display: flex;
        margin-bottom: $grid-1;
        .top-item {
            margin-right: $grid-3;
        }
        .box {
            display: flex;
            padding: 0.08rem 0.16rem;
            background-color: var(--el-bg-color-opacity-8);
            border-radius: $border-radius-1;
            .svg-icon {
                margin-right: 0.04rem;
            }
        }
    }
    .bottom {
        max-width: 7.2rem;
        overflow: auto;
        padding: 0 0.1rem 0.1rem;
        border-radius: $border-radius-1;
        background: var(--el-bg-color-opacity-8);
        box-sizing: border-box;
        // border: .01rem solid $color-bg-light-2;
        // box-shadow: inset 0rem 0rem .1rem 0rem $color-bg-light-2;
        .close-btn {
            display: flex;
            justify-content: flex-end;
            padding: 0.1rem 0;
            font-size: 0.16rem;
            &:hover {
                .el-icon {
                    color: var(--el-color-error);
                }
            }
        }
        .bottom-content{
            // height: calc(100% - 0.16rem);
            max-height: 360px;
        }
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
    .item-box {
        min-width: calc(100% - $scrollbar-width);
        height: 80px;
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color);

        display: flex;
        border-radius: $border-radius-1;
        &:hover {
            border: 1px solid var(--el-border-color-light);
        }
        &:not(:last-child) {
            margin-bottom: $grid-1;
        }
        .notuse-warning {
            color: var(--el-color-danger);
            animation: blink 1s infinite;
        }
        @keyframes blink {
            0% {
                opacity: 1;
            }
            50% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        $item-left-width: 70px;
        .item-left {
            padding: $grid-1;
            border-right: 1px solid var(--el-border-color);
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: $item-left-width;
        }
        $item-right-bottom-height: 40px;
        .item-right {
            width: calc(100% - $item-left-width);
            height: 100%;
            .item-right-top {
                display: flex;
                height: calc(100% - $item-right-bottom-height);
                border-bottom: 1px solid var(--el-border-color);
                .item-right-top-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 0 $grid-1;
                    color: var(--el-text-color-secondary);
                    font-size: 12px;
                    &:not(:last-child) {
                        border-right: 1px solid var(--el-border-color);
                    }
                    .top-item-value {
                        color: var(--el-text-color-primary);
                        // font-weight: 600;
                        font-size: 14px;
                    }
                }
            }
            .item-right-bottom {
                display: flex;
                height: $item-right-bottom-height;
                align-items: center;
                justify-content: center;
                padding: $grid-1;
                box-sizing: border-box;
                .item-right-bottom-item {
                    padding: 0 $grid-1;
                    color: #fff;
                    &:first-child {
                        border-radius: 40px 0 0 40px;
                    }
                    &:last-child {
                        border-radius: 0 40px 40px 0;
                    }
                    &:not(:last-child) {
                        border-right: 1px solid var(--el-border-color);
                    }
                }
            }
        }
    }
}
</style>
