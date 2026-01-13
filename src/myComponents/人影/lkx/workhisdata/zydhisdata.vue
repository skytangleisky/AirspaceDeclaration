<template>
    <!-- html -->
    <div style="width: 100%;">
        <div style="display: flex;align-items:center;margin-bottom:12px">
            <div style="margin: 0 10px;">
                <el-date-picker
                    v-model="Timedata"
                    type="datetimerange"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    unlink-panels
                    @change="handleTimeChange"
                />
            </div>
            <div style="margin: 0 10px; width: 100%;">
                <el-select v-model="select_data" placeholder="请选择作业点名称" style="width: 100%;">
                    <el-option v-for="option in apiZydName" :key="option" :label="option" :value="option">
                    </el-option>
                </el-select>
            </div>

        </div>

        <div style="margin: 0 10px; /* 父容器加overflow，让滚动条包裹在容器内 */ overflow: auto;">
            <el-table
                :data="tableData"
                border
                max-height="250"
                style="width: 100%;"
                :header-cell-style="{ 
                background: '#1A8CFF', 
                color:'white',
                fontWeight: '900',
                whiteSpace: 'nowrap', 
                textAlign: 'center',
                padding: '0 4px',
                }"  
                :row-style="{ height: '40px' }"
                scrollbar-always-on
            >
                <el-table-column prop="strWorkID" label="流程序列号" min-width="260" show-overflow-tooltip/>
                <el-table-column prop="strName" label="作业点" min-width="180" show-overflow-tooltip />
                <el-table-column prop="strUpApplyUnitName" label="申请单位" min-width="120" show-overflow-tooltip/>
                <el-table-column prop="tmBeginApply" label="申请作业时间" min-width="170" show-overflow-tooltip />
                <el-table-column prop="iApplyTimeLen" label="申请时长(秒)" min-width="120" show-overflow-tooltip/>
                <el-table-column prop="strAnswerUnitName" label="批复单位" min-width="130" show-overflow-tooltip/>
                <el-table-column prop="Answertype" label="批复类型" min-width="100" show-overflow-tooltip />
                <el-table-column prop="ianswerTimeLen" label="批准作业时长(秒)" min-width="150" show-overflow-tooltip/>
                <el-table-column prop="tmBeginAnswer" label="作业开始时间" min-width="170" show-overflow-tooltip/>
                <el-table-column prop="tmAnswerRev" label="作业结束时间" min-width="170" show-overflow-tooltip/>
                <el-table-column prop="vecProcess" label="状态流程" min-width="500" show-overflow-tooltip/>
            </el-table>
        </div>

        <div style="margin-top: 12px;">
            <el-pagination 
                size="small"  
                v-model:current-page="pageOption.page" 
                :page-size="pageOption.size"  
                layout="prev,pager, next, jumper, total" 
                :total="pageOption.total" 
            />
        </div>
    </div>
</template>

<script lang="ts" setup >  //这里的name=Person是程序运行时文件名
import { ref, reactive, toRefs, toRef, computed, watch, onMounted } from 'vue';
import { getZydName  ,select_getZydHisData , 历史作业记录} from '../api';

import moment from 'moment'



const lastMonth = moment().add(-40, 'day')
const nextday = moment().add(0, 'day')
const Timedata = ref<[Date, Date]>([
    new Date(lastMonth.year(), lastMonth.month(), lastMonth.date(), 0, 0),
    new Date(nextday.year(), nextday.month(), nextday.date(), 0, 0),
])

//根据时间进行筛选
function handleTimeChange(){
    pageOption.page=1
    历史作业记录(select_data.value,Timedata.value,pageOption.page,pageOption.size)
    .then((response)=>{
            pageOption.total=response.data.total
            const arrAnswertype = getAnswertype(response.data.results)
            tableData.value = arrAnswertype
        })
    if(Timedata.value===null){
        console.log("点击的是取消",Timedata.value)
    }
    // if(Timedata.value!==null){
    //     select_getZydHisData(moment(Timedata.value[0]).format('YYYY-MM-DD HH:mm:ss'),moment(Timedata.value[1]).format('YYYY-MM-DD HH:mm:ss'),select_data.value,pageOption.page*10-10,pageOption.size)
    //     .then((response)=>{
    //         pageOption.total=response.data.total
    //         const arrAnswertype = getAnswertype(response.data.results)
    //         tableData.value = arrAnswertype
    //     })
    // }
    // else{
    //     console.log("点击的是取消",Timedata.value)
    //     select_getZydHisData('','',select_data.value,pageOption.page*10-10,pageOption.size)
    //     .then((response)=>{
    //         pageOption.total=response.data.total
    //         const arrAnswertype = getAnswertype(response.data.results)
    //         tableData.value = arrAnswertype
    //     })
    // }
}

var apiZydName:string[]=['全部']
//获取作业点名称
onMounted(()=>{
    getZydName()
    .then((response)=>{
        apiZydName = apiZydName.concat(response.data.results.map((item: ZydItem) => item.strName))
    })
})


//根据作业点名称进行筛选
const select_data=ref('全部')
watch(select_data,(newname)=>{
    pageOption.page=1
    历史作业记录(newname,Timedata.value,pageOption.page,pageOption.size)
    .then((response)=>{
            pageOption.total=response.data.total
            const arrAnswertype = getAnswertype(response.data.results)
            tableData.value = arrAnswertype
        })
    
    // if(Timedata.value!==null){
    //     select_getZydHisData(moment(Timedata.value[0]).format('YYYY-MM-DD HH:mm:ss'),moment(Timedata.value[1]).format('YYYY-MM-DD HH:mm:ss'),newname,(pageOption.page-1)*pageOption.size,pageOption.size)
    //     .then((response)=>{
    //         pageOption.total=response.data.total
    //         const arrAnswertype = getAnswertype(response.data.results)
    //         tableData.value = arrAnswertype
    //     })
    // }
    // else{
    //     select_getZydHisData('','',newname,pageOption.page*10-10,pageOption.size)
    //     .then((response)=>{
    //         pageOption.total=response.data.total
    //         const arrAnswertype = getAnswertype(response.data.results)
    //         tableData.value = arrAnswertype
    //     })
    // }
})

interface ZydItem {
  strName: string; // 明确strName是字符串类型
}



const pageOption = reactive({
  page:1,//当前页
  size:10,//每页页条数
  total:0,//总数
})

//初始化表格数据 按照默认筛选条件执行
var tableData = ref<any>([])
onMounted(()=>{
    历史作业记录(select_data.value,Timedata.value,pageOption.page,pageOption.size)
    .then((response)=>{
        pageOption.total=response.data.total
        const arrAnswertype = getAnswertype(response.data.results)
        tableData.value = arrAnswertype
    })
})

function getAnswertype(respose:any){
    return respose.map((item:any)=>{
        let answerType='';
        if(item.banswervalid === 0){
            answerType='';
        }
        else if(item.banswervalid===1){
            answerType = item.bansweraccept === 1 ? '批准' : '不批准';
        }
        return{
            ...item,
            Answertype:answerType
        }
    })
}

//根据页面变化进行分页查询
watch(()=>pageOption.page,(newPage)=>{

    历史作业记录(select_data.value,Timedata.value,newPage,pageOption.size)
    .then((response)=>{
        pageOption.total=response.data.total
        const arrAnswertype = getAnswertype(response.data.results)
        tableData.value = arrAnswertype
    })

    // if(Timedata.value!==null){
    //     select_getZydHisData(moment(Timedata.value[0]).format('YYYY-MM-DD HH:mm:ss'),moment(Timedata.value[1]).format('YYYY-MM-DD HH:mm:ss'),select_data.value,newPage*10-10,pageOption.size)
    //     .then((response)=>{
    //         pageOption.total=response.data.total
    //         const arrAnswertype = getAnswertype(response.data.results)
    //         tableData.value = arrAnswertype
    //     })
    // }
    // else{
    //     select_getZydHisData('','',select_data.value,pageOption.page*10-10,pageOption.size)
    //     .then((response)=>{
    //         pageOption.total=response.data.total
    //         const arrAnswertype = getAnswertype(response.data.results)
    //         tableData.value = arrAnswertype
    //     })
    // }
})


</script>


<style scoped lang="scss">

</style>