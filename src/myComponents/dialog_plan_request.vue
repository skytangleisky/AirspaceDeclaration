<template>
    <div class="modal" v-if="show">
        <div class="dragDialog">
            <div class="item-box">
                <div class="item-label">代码</div>
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
                <div class="item-label">名称</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="名称"
                        :value="data.strName"
                        @mousedown.stop
                    />
                </div>
            </div>

            <div class="item-box">
                <div class="item-label">位置</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="位置"
                        :value="data.strPos"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">审批单位</div>
                <div class="item-value">
                    <el-input
                        disabled
                        name="审批单位"
                        :value="data.strMgrUnitName"
                        @mousedown.stop
                    />
                </div>
            </div>

            <div class="item-box">
                <div class="item-label">最大射程(米)</div>
                <div class="item-value">
                    <el-input-number
                        :min="0"
                        :max="10000"
                        v-model="data.iMaxShotRange"
                        size="default"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">最大射高(米)</div>
                <div class="item-value">
                    <el-input-number
                        :min="0"
                        :max="10000"
                        v-model="data.iMaxShotHei"
                        size="default"
                        @mousedown.stop
                    />
                </div>
            </div>

            <div class="item-box">
                <div class="item-label">射击装备</div>
                <div class="item-value">
                    <el-select
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
                <div class="item-label">射向开始角(度)</div>
                <div class="item-value">
                    <el-input-number
                        :min="0"
                        :max="360"
                        v-model="data.iShotRangeBegin"
                        size="default"
                        @mousedown.stop
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">射向终止角(度)</div>
                <div class="item-value">
                    <el-input-number
                        :min="0"
                        :max="360"
                        v-model="data.iShotRangeEnd"
                        size="default"
                        @mousedown.stop
                    />
                </div>
            </div>

            <div class="item-box">
                <div class="item-label">开始时间</div>
                <div class="item-value">
                    <el-time-picker
                        :teleported="false"
                        value-format="HH:mm:ss"
                        v-model="data.beginTime"
                        placeholder="请输入开始时间"
                        @clear="beginTimeClear"
                    />
                </div>
            </div>
            <div class="item-box">
                <div class="item-label">作业时长(分钟)</div>
                <div class="item-value">
                    <el-input-number
                        :min="1"
                        :max="5"
                        v-model="data.duration"
                        size="default"
                        @mousedown.stop
                    />
                </div>
            </div>

            <div class="page-btns">
                <el-button @click="cancel" type="default" @mousedown.stop
                    >取消</el-button
                >
                <el-button type="primary" style="display: none" @mousedown.stop
                    >电话上报</el-button
                >
                <el-button type="primary" @mousedown.stop @click="click(data)"
                    >网络上报</el-button
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount } from "vue";
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
const click = (data: prevRequestDataType) => {
    emit("click", data);
};
const beginTimeClear = ()=>{
    props.data.beginTime = moment().format('HH:mm:ss')
}
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
const props = withDefaults(
    defineProps<{
        show?: boolean;
        data?: prevRequestDataType;
    }>(),
    {
        show: true,
        data: () => ({
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
            beginTime: moment().format('HH:mm:ss'),
            duration: 1,
            unitName: "",
        }),
    }
);
const emit = defineEmits(["update:show", "click"]);
const cancel = () => {
    emit("update:show", false);
};
let timer:any;
onMounted(() => {
    timer = setInterval(()=>{
        if(moment(moment().format('YYYY-MM-DD ') + props.data.beginTime,'YYYY-MM-DD HH:mm:ss').isBefore(moment())){
            props.data.beginTime = moment().format('HH:mm:ss')
        }
    },1000)
});
onBeforeUnmount(() => {
    clearInterval(timer)
});
</script>
<style scoped lang="scss">
.modal {
    position: absolute;
    width:100%;
    height:100%;
    left:0;
    top:0;
    z-index: 4;
    background: #00000088;
    position: relative;
    .dragDialog {
        position: absolute;
        width: 600px;
        background-color: var(--el-bg-color);
        padding: $grid-3;
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
            justify-content: flex-end;
        }
        .ep-row {
            padding: 5px;
        }
    }
}
</style>
