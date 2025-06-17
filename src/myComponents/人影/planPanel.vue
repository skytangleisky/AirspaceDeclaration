<template>
    <div class="planPanel z-1 wstd-container">
        <div class="top">
            <div
                v-for="(item, index) in tabList"
                :key="index"
                class="top-item"
                @click="switchTab(item.label)"
            >
                <el-badge :value="item.total" type="success" :hidden="item.hideBadge">
                    <div
                        :class="{ active: tabActive == item.label,box:true,'map-btn':true }"
                    >
                        <svg-icon :name="item.icon"></svg-icon>
                        <span class="label">{{ item.label }}</span>
                    </div>
                </el-badge>
            </div>
        </div>
        <div class="bottom wstd-content" v-show="tabActive !== ''">
            <div class="close-btn" @click="tabActive = ''">
                <el-icon><Close /></el-icon>
            </div>
            <div class="bottom-content">
                <el-scrollbar height="100%">
                    <!-- 当前作业进度，今日作业记录 -->
                    <div
                        v-for="(v, k) in props"
                        :label="k"
                        v-show="tabActive == k"
                    >
                        <div
                            class="item-box"
                            @click="click(item)"
                            v-for="(item, key) in v"
                            :key="key"
                            @mousedown.stop
                        >
                            <div class="item-left">
                                <span>{{
                                    moment(item.tmBeginApply).format("HH:mm:ss")
                                }}</span>

                                <span>{{ item.strZydID }}</span>
                                <span class="font-size-14px font-extrabold">{{
                                    item.strName
                                }}</span>
                            </div>
                            <div class="item-right">
                                <div class="item-right-top">
                                    <div class="item-right-top-item">
                                        <div>作业状态</div>
                                        <div
                                            :style="`color:${
                                                工作状态格式化(
                                                    item.ubyStatus
                                                ) == '作业开始'
                                                    ? '#f00'
                                                    : '#e5eaf3'
                                            }`"
                                            class="top-item-value"
                                        >
                                            {{ 工作状态格式化(item.ubyStatus) }}
                                        </div>
                                    </div>
                                    <div class="item-right-top-item">
                                        <div>发送状态</div>
                                        <div class="top-item-value">
                                            {{
                                                发送状态格式化(
                                                    item.ubySendStatus
                                                )
                                            }}
                                        </div>
                                    </div>
                                    <div class="item-right-top-item">
                                        <div>作业点代码</div>
                                        <div class="top-item-value">
                                            {{ item.strCode }}
                                        </div>
                                    </div>
                                    <div class="item-right-top-item">
                                        <template v-if="!item.bAnswerAccept">
                                            <div>申请时间</div>
                                            <div class="top-item-value">
                                                {{
                                                    item.tmBeginApply.substring(
                                                        10,
                                                        16
                                                    )
                                                }}
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div>批准时间</div>
                                            <div class="top-item-value">
                                                {{
                                                    item.tmAnswerRev
                                                        ? item.tmAnswerRev.substring(
                                                              10,
                                                              16
                                                          )
                                                        : ""
                                                }}
                                            </div>
                                        </template>
                                    </div>
                                    <div class="item-right-top-item">
                                        <template v-if="!item.bAnswerAccept">
                                            <div>申请时长</div>
                                            <div class="top-item-value">
                                                {{ item.iApplyTimeLen }}秒
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div>批准时长</div>
                                            <div class="top-item-value">
                                                {{ item.iAnswerTimeLen }}秒
                                            </div>
                                        </template>
                                    </div>
                                    <div class="item-right-top-item">
                                        <div>空域状态</div>
                                        <div
                                            :class="`${
                                                获取空域状态(item) == '未使用'
                                                    ? 'notuse-warning'
                                                    : ''
                                            } top-item-value`"
                                        >
                                            {{ 获取空域状态(item) }}
                                        </div>
                                    </div>
                                    <div class="item-right-top-item">
                                        <div>上报单位</div>
                                        <div class="top-item-value">
                                            {{ item.strUpApplyUnitName }}
                                        </div>
                                    </div>
                                </div>
                                <div class="item-right-bottom">
                                    <div
                                        :class="`flex justify-center items-center ${申请(
                                            item
                                        )} item-right-bottom-item`"
                                    >
                                        申请({{
                                            moment(item.tmBeginApply).format(
                                                "HH:mm"
                                            )
                                        }})
                                    </div>
                                    <div
                                        :class="`flex-1 flex justify-center items-center ${批复(
                                            item
                                        )} item-right-bottom-item`"
                                    >
                                        <template v-if="!item.bAnswerAccept">
                                            批复
                                        </template>
                                        <template v-else>
                                            北空批复{{
                                                "(" +
                                                moment(
                                                    item.tmAnswerRev,
                                                    "YYYY-MM-DD HH:mm:ss"
                                                ).format("HH:mm") +
                                                ")"
                                            }}
                                        </template>
                                    </div>
                                    <div
                                        :class="`flex-1 flex justify-center items-center ${开始(
                                            item
                                        )} item-right-bottom-item`"
                                    >
                                        {{ beginText(item) }}
                                    </div>
                                    <div
                                        :class="`flex-1 flex justify-center items-center ${结束(
                                            item
                                        )} item-right-bottom-item`"
                                    >
                                        <template
                                            v-if="
                                                工作状态格式化(
                                                    item.ubyStatus
                                                ) == '作业开始'
                                            "
                                        >
                                            (
                                            <div
                                                :class="`${
                                                    endSeconds(item) < 10
                                                        ? 'color-#f00'
                                                        : 'color-inherit'
                                                } item-right-bottom-item`"
                                            >
                                                {{
                                                    Math.floor(
                                                        endSeconds(item) / 60
                                                    ) +
                                                    ":" +
                                                    (endSeconds(item) % 60)
                                                }}
                                            </div>
                                            )结束
                                        </template>
                                        <template v-else>
                                            {{
                                                "结束" +
                                                (item.tmBeginAnswer
                                                    ? "(" +
                                                        moment(item.tmBeginAnswer)
                                                            .add(
                                                                item.iAnswerTimeLen,
                                                                "s"
                                                            )
                                                            .format("HH:mm:ss") +
                                                        ")"
                                                    : "")
                                            }}
                                        </template>
                                    </div>
                                    <div
                                        :class="`flex-1 flex justify-center items-center ${完成(
                                            item
                                        )} item-right-bottom-item`"
                                    >
                                        完成
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 空域流转信息 -->
                    <div v-show="tabActive == '空域流转信息'">
                        <Transport :data="props.今日作业记录" />
                    </div>
                    <div v-show="tabActive == '完成信息查询'">
                        <FinishedInfo></FinishedInfo>
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
import moment from "moment";
import { defineAsyncComponent, reactive, ref, watch, computed } from "vue";
import { Close } from "@element-plus/icons-vue";
const Transport = defineAsyncComponent(() => import("./transport.vue"));
const FinishedInfo = defineAsyncComponent(() => import("./finishedInfo.vue"));

// top按钮渲染数据
const tabList = reactive([
    {
        label: "当前作业进度",
        icon: "progress",
        type: "progress",
        total: computed(() => props.当前作业进度.length),
    },
    {
        label: "今日作业记录",
        icon: "plan-fill",
        type: "PLANFILL",
        total: computed(() => props.今日作业记录.length),
    },
    {
        label: "空域流转信息",
        icon: "transferInfo",
        type: "transferInfo",
        total: computed(() => props.今日作业记录.length),
    },
    {
        label: "完成信息查询",
        icon: "tasks",
        type: "完成信息查询",
        total: 0,
        hideBadge:true,
    },
]);
const tabActive = ref("");
// 切换top按钮
const switchTab = (label) => {
    tabActive.value = label;
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
watch(props.今日作业记录, (newValue) => {
    console.log(newValue);
});
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
            return "bg-#3ac8a5";
        case "作业不批准":
            return "bg-#3D5E86";
        case "作业批准":
            return "bg-#3ac8a5";
        case "作业开始":
            return "bg-#3ac8a5";
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
            return "bg-#3ac8a5";
        case "作业开始":
            return "bg-#3ac8a5";
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
            return "bg-#3ac8a5";
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
    .wstd-content {
        width: 7.2rem;
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
