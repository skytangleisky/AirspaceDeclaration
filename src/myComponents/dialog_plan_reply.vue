<template>
    <div class="modal" v-if="show">
        <div class="dragDialog">
            <div class="item-box">
                <div class="item-label">发报单位</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="发报单位"
                        :value="data.发报单位"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">发报时间</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="发报时间"
                        :value="data.tmUpdate"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">申请单位</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="申请单位"
                        value="北京气象局"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">空管单位</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="空管单位"
                        value="西南空管"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">作业点代码</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="代码"
                        :value="data.strCode"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">作业点名称</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="作业点名称"
                        :value="data.strName"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">经纬度位置</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="经纬度位置"
                        :value="data.strPos"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">标高</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="标高"
                        value="0米"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">最大射程</div>
                <div class="item-value">
                    <el-input disabled :model-value="(data.iMaxShotRange/1000).toFixed()+'公里'"></el-input>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">最大射高</div>
                <div class="item-value">
                    <el-input disabled :model-value="data.iMaxShotHei+'米'"></el-input>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">射向开始角</div>
                <div class="item-value">
                    <el-input disabled :model-value="data.iShotRangeBegin+'度'"></el-input>
                    <!-- <el-input-number
                        :min="0"
                        :max="360"
                        v-model="data.iShotRangeBegin"
                        size="default"
                        @mousedown.stop
                    /> -->
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">射向终止角</div>
                <div class="item-value">
                    <el-input disabled :model-value="data.iShotRangeEnd+'度'"></el-input>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">射击装备</div>
                <div class="item-value">
                    <el-select
                        disabled
                        v-model="data.iWeapon"
                        :teleported="false"
                        placeholder="射击装备"
                    >
                        <el-option
                            v-for="(item, k) in weaponOptions"
                            :key="k"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">作业目的</div>
                <div class="item-value">
                    <el-select
                        disabled
                        v-model="data.iWorkType"
                        :teleported="false"
                        placeholder="作业目的"
                    >
                        <el-option
                            v-for="(item, k) in workOptions"
                            :key="k"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">申请作业时间</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="申请作业时间"
                        :value="data.tmBeginApply"
                        @mousedown.stop
                    />
                    <!-- <el-time-picker
                        disabled
                        :teleported="false"
                        value-format="HH:mm:ss"
                        v-model="data.beginTime"
                        placeholder="请输入开始时间"
                    /> -->
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">申请作业时长</div>
                <div class="item-value">
                    <el-input disabled :model-value="data.duration*60+'秒'"></el-input>
                </div>
            </div>

            <div class="item-box" style="margin-top:20px;">
                <div class="item-label">申请方式</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="申请方式"
                        value="电话申请"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box" style="margin-top:20px;">
                <div class="item-label">批复方式</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="批复方式"
                        value="网路"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">不批准原因</div>
                <div class="item-value">
                    <el-select
                        v-model="data.denyCode"
                        :teleported="false"
                        placeholder="作业目的"
                    >
                        <el-option
                            v-for="(item, k) in rejectOptions"
                            :key="k"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">延迟申请时间</div>
                <div class="item-value">
                    <el-input-number
                        :min="0"
                        :max="360"
                        v-model="data.delayTimeLen"
                        size="default"
                        @mousedown.stop
                    >
                    <template #suffix>
                        <span>分钟</span>
                    </template>
                </el-input-number>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">开始射向</div>
                <div class="item-value">
                    <el-input-number
                        :min="0"
                        :max="360"
                        v-model="data.beginDirection"
                        size="default"
                        @mousedown.stop
                    >
                    <template #suffix>
                        <span>度</span>
                    </template>
                </el-input-number>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">结束射向</div>
                <div class="item-value">
                    <el-input-number
                        :min="0"
                        :max="360"
                        v-model="data.endDirection"
                        size="default"
                        @mousedown.stop
                    >
                    <template #suffix>
                        <span>度</span>
                    </template>
                </el-input-number>
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">开始时间</div>
                <div class="item-value">
                    <el-time-picker
                        :teleported="false"
                        value-format="HH:mm:ss"
                        format="HH:mm:ss"
                        v-model="data.workBeginTime"
                        placeholder="请输入开始时间"
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">作业时长</div>
                <div class="item-value">
                    <el-input-number
                        :min="1"
                        :max="5"
                        v-model="data.workTimeLen"
                        size="default"
                        @mousedown.stop
                    >
                    <template #suffix>
                        <span>分钟</span>
                    </template>
                </el-input-number>
                </div>
            </div>
            <div class="page-btns">
                <el-button type="primary" @mousedown.stop @click="accept(data)">批准</el-button>
                <el-button type="primary" @mousedown.stop @click="reject(data)">不批准</el-button>
                <el-button @click="cancel" type="primary" @mousedown.stop>退出</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount,computed } from "vue";
import moment from "moment";
const weaponOptions = reactive([
    { value: 0, label: "火箭" },
    { value: 1, label: "高炮" },
    { value: 2, label: "火箭+高炮" },
    { value: 3, label: "烟炉" },
    { value: 4, label: "火箭+烟炉" },
    { value: 5, label: "高炮+烟炉" },
    { value: 6, label: "火箭+高炮+烟炉" },
]);
const workOptions = reactive([
    { value: 0, label: "未定义" },
    { value: 1, label: "增雨" },
    { value: 2, label: "防雹" },
    { value: 3, label: "大气污染治理" },
    { value: 4, label: "其他" },
]);
const rejectOptions = reactive([
    { value: 0, label: "空域忙" },
    { value: 1, label: "民航有飞行" },
    { value: 2, label: "军航有飞行" },
]);
const accept = (data: prevRequestDataType) => {
    emit("accept", data);
};
const reject = (data: prevRequestDataType) => {
    emit("reject", data);
};
type zyddataType = {
    strID: string;
    strCode: string;
    strName: string;
    strPos: string;
    iMaxShotRange: number;
    iMaxShotHei: number;
    iWeapon: number;
    iWorkType: number;
    iShotRangeBegin: number;
    iShotRangeEnd: number;
    beginTime: string;
    duration: number;
};
export type prevRequestDataType = {
    unitName: string;
} & zyddataType;
const show = defineModel('show',{
    default:true
})
const data = defineModel<any>('data',{
    default: {
        strID: "",
        strCode: "",
        strName: "",
        strPos: "",
        iMaxShotRange: 10,
        iMaxShotHei: 8000,
        iWeapon: 0,
        iWorkType: 1,
        iShotRangeBegin: 0,
        iShotRangeEnd: 1000,
        beginTime: "",
        duration: 1,
        unitName: "",
        workBeginTime: moment().format('HH:mm:ss')
    }
})
const emit = defineEmits(["update:show", "accept", "reject"]);
const cancel = () => {
    emit("update:show", false);
};
let timer;
onMounted(() => {
    timer = setInterval(()=>{
        if(moment(moment().format('YYYY-MM-DD ') + data.value.workBeginTime,'YYYY-MM-DD HH:mm:ss').isBefore(moment())){
            data.value.workBeginTime = moment().format('HH:mm:ss')
        }
    },1000)
});
onBeforeUnmount(() => {
    clearInterval(timer)
});
</script>
<style scoped lang="scss">
.modal {
    z-index: 4;
    background: #00000088;
    box-sizing: border-box;
    position: relative;
    width:100%;
    height: 100%;left:0;top:0;
    .dragDialog {
        position: absolute;
        width: 600px;
        background-color: var(--el-bg-color);
        padding: $grid-5;
        border-radius: $border-radius-3;
        box-shadow: var(--el-box-shadow);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-wrap: wrap;
        .item-box {
            display: flex;
            width: calc((100% - $grid-3) / 2);
            margin-bottom: $grid-2;
            &:nth-child(2n) {
                margin-left: $grid-3;
            }
            .item-label {
                width: 100px;
                // text-align: right;
            }
            .item-value {
                width: calc(100% - 100px);
                margin-left: $grid-2;
                .el-input-number {
                    width: 100%;
                }
                ::v-deep(.el-date-editor.el-input) {
                    width: 100%;
                }
            }
        }
        .page-btns {
            width: 100%;
            display: flex;
            justify-content: space-around;
        }
        .ep-row {
            padding: 5px;
        }
    }
}
</style>
