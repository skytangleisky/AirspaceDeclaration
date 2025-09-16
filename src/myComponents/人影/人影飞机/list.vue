<template>
    <teleport to="#wstd-container">
        <div class="modal" v-if="setting.人影.监控.注册飞机列表显示">
            <div class="dragDialog">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column label="操作" width="150">
                    <template #default="{row}">
                        <div style="display: flex;">

                        <el-popconfirm
                        class="box-item"
                        title="注意无法撤销"
                        placement="right"
                        confirm-button-text="确认"
                        cancel-button-text="返回"
                        @confirm="删除(row)"
                        >
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                        </el-popconfirm>
                        <!-- <el-button type="danger" size="small" @click="删除(row)">删除</el-button> -->
                        <el-button type="warning" size="small" @click="弹出修改窗口(row)">修改</el-button>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column prop="strCallCode" label="飞机标识" width="100" />
                    <el-table-column prop="iAddress" label="地址/代码" width="120" :formatter="(row, column, cellValue) => Number(cellValue).toString(8).padStart(4,'0')" />
                    <el-table-column prop="strProtocol" label="类型" width="60" />
                    <el-table-column prop="strPlane" label="机型" width="100" />
                    <el-table-column prop="dtRegTime" label="注册日期" width="200" />
                </el-table>
                <el-pagination size="small" v-model:current-page="pageOption.page" :page-size="pageOption.size"  layout="prev,pager, next, jumper, total" :total="pageOption.total" style="margin-top:10px"/>
                <div class="page-btns" style="display: flex;justify-content: flex-end;">
                    <el-button type="primary" @mousedown.stop @click="弹出新增窗口">新增</el-button>
                    <el-button @click="cancel" type="default" @mousedown.stop>取消</el-button>
                </div>
            </div>
        </div>
        <Add v-model:show="addShow"></Add>
        <Edit v-model:show="editShow" :data="editData"></Edit>
    </teleport>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
import {注册飞机查询,删除飞机} from "~/api/天工.ts";
import Add from './add.vue'
import Edit from './edit.vue'
import { reactive, onMounted, onBeforeUnmount,watch,ref,provide } from "vue";
const addShow = ref(false)
const editShow = ref(false)
const editData = reactive<any>({})
const 弹出新增窗口 = () => {
    addShow.value = true
}
function 弹出修改窗口(row){
    Object.assign(editData,JSON.parse(JSON.stringify(row)))
    editShow.value = true
}
const 触发新增飞机信息查询 = ref(Date.now())
provide('触发新增飞机信息查询',触发新增飞机信息查询)
const tableData = reactive<Array<any>>([])
const pageOption = reactive({
    page:1,
    size:10,
    total:0,
})
watch([()=>pageOption.page,()=>pageOption.size,触发新增飞机信息查询],([page,size])=>{
    注册飞机查询({page,size}).then(({data})=>{
        pageOption.total = data.total
        tableData.splice(0,tableData.length,...data.results)
    })
},
{
    immediate:true
})
function 删除(row:any){
    删除飞机(row.iAddress).then(res=>{
        ElMessage({
            message: '删除成功',
            type:'success',
        })
        触发新增飞机信息查询.value = Date.now()
    }).catch((e)=>{
        ElMessage({
            message: '删除失败',
            type:'error',
        })
    })
}
const strPos = ref("")
const cancel = () => {
    setting.人影.监控.注册飞机列表显示 = false
};
let timer:any;
onMounted(() => {
    timer = setInterval(()=>{
        触发新增飞机信息查询.value = Date.now()
    },10*1000)
});
onBeforeUnmount(() => {
    clearInterval(timer)
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
        width: fit-content;
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

    }
}
.el-table::v-deep(th) {
    background-color: var(--el-color-primary);
    color:white;
}
</style>