<template>
    <teleport to="#app">
        <div class="modal" v-if="show">
            <div class="dragDialog">
                <el-row :gutter="rowGutter">
                    <el-col :span="24">
                        <span class="label">飞机地址/代码:</span>
                        <el-input :value="Number(data.address).toString(8).padStart(4,'0')" disabled></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="24">
                        <span class="label">飞机标识:</span>
                        <el-input v-model="data.sign"></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="24">
                        <span class="label">协议类型:</span>
                        <el-select v-model="data.protocol" placeholder="请选择" style="width: 100%" clearable filterable allow-create>
                            <el-option v-for="item in protocolOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="24">
                        <span class="label">机型:</span>
                        <el-select v-model="data.plane_type" placeholder="请选择" style="width: 100%" clearable filterable allow-create>
                            <el-option v-for="item in plane_typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                </el-row>
                <div class="page-btns">
                    <el-button type="primary" @mousedown.stop @click="save(data)">保存</el-button>
                    <el-button @click="cancel" type="default" @mousedown.stop>取消</el-button>
                </div>
            </div>
        </div>
    </teleport>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import {修改飞机} from "~/api/天工.ts";
import moment from "moment";
import { reactive, onMounted, onBeforeUnmount,watch,ref,inject } from "vue";
const rowGutter =20
//空中国王，国王，未知，无人机，Y12
const plane_typeOptions = reactive([
    { value: '空中国王', label: "空中国王" },
    { value: '国王', label: "国王" },
    { value: '无人机', label: "无人机" },
    { value: 'Y12', label: "Y12" },
    { value: '未知', label: "未知" },
]);
const protocolOptions = reactive([
    { value: '北斗', label: "北斗" },
    { value: '雷达', label: "雷达" },
    { value: '电台', label: "电台" },
]);

const save = async(data) => {
    data.reg_time = moment().format('YYYY-MM-DD HH:mm:ss')
    修改飞机(data).then((res)=>{
        ElMessage({
            message: '保存成功',
            type: 'success',
        })
        触发新增飞机信息查询.value = Date.now()
        show.value = false;
    }).catch(err=>{
        ElMessage({
            message: '保存失败',
            type:'error',
        })
    })
};
const show = defineModel('show',{
    default:true
})
const data = defineModel('data',{
    default:reactive({
        "address": "1705",
        "plane_type": "国王",
        "protocol": "雷达",
        "reg_time": "2025-07-05 09:00:00",
        "sign": "B102P"
    })
})
const cancel = () => {
    show.value = false;
};
const 触发新增飞机信息查询 = inject('触发新增飞机信息查询',ref(Date.now()))
// let timer:number;
onMounted(() => {
    // timer = setInterval(()=>{
    //   props.data.beginTime = moment().format('HH:mm:ss')
    // },1000)
});
onBeforeUnmount(() => {
    // clearInterval(timer)
});
</script>
<style scoped lang="scss">
.modal {
    z-index: 8;
    background: #00000088;
    position: absolute;
    inset:0;
    .dragDialog {
        position: absolute;
        width: 400px;
        //background-color: var(--el-bg-color);
        //padding: $grid-2;
        //border-radius: $border-radius-3;
        //box-shadow: var(--el-box-shadow);

        background-color: var(--el-bg-color-opacity-8);
        padding: $grid-2;
        border-radius: $border-radius-2;
        border:1px solid var(--el-border-color);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        box-sizing: border-box;
        max-width: 100%;
        max-height: 100%;
        overflow: auto;

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
        &::v-deep(.el-row){
            margin-bottom:$grid-2;
            .el-col{
                display:flex;
                white-space: nowrap;
                align-items: center;
                .label{
                    text-align: right;
                    margin:0 10px;
                    min-width:100px;
                }
            }
        }
    }
}
</style>
