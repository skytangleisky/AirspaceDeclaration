<template>
    <teleport to="#wstd-container">
        <div class="modal" v-if="show">
            <div class="dragDialog">
                <el-row :gutter="rowGutter">
                    <el-col :span="12">
                        <span class="label">作业点编号</span>
                        <el-select
                            clearable
                            v-model="data.strID"
                            filterable
                            placeholder="作业点编号"
                            style="width: 200px"
                            :value-on-clear="null"
                            >
                            <el-option
                                v-for="item in zydOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                                <span style="float: left;color: var(--el-text-color-secondary)">{{ item.value }}</span>
                                <span style="float: right;font-size: 16px;">{{ item.name }}</span>
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        <span class="label">作业点名称</span>
                        <el-input v-model="strName" disabled></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="12">
                        <span class="label">作业日期</span>
                        <el-date-picker v-model="beginDate" value-format="YYYY-MM-DD" format="YYYY-MM-DD"/>
                    </el-col>
                    <el-col :span="12">
                        <span class="label">作业时间</span>
                        <el-time-picker v-model="beginTime" value-format="HH:mm:ss" format="HH:mm:ss"/>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="12" style="display: flex;white-space: nowrap;">
                        <span class="label">作业时长</span>
                        <el-input-number v-model="data.duration" :min="1" :max="600" style="width:100%">
                            <template #suffix>
                                <span>秒</span>
                            </template>
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="12">
                        <span class="label">作业类型</span>
                        <el-select v-model="data.iWorkType" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in workOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        <span class="label">作业工具</span>
                        <el-select v-model="data.iWeapon" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in weaponOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="12" >
                        <span class="label">炮弹用量</span>
                        <el-input-number v-model="data.numPD" :min="0" :max="999" style="width:100%">
                            <template #suffix><span>发</span></template>
                        </el-input-number>
                    </el-col>
                    <el-col :span="12" >
                        <span class="label">火箭用量</span>
                        <el-input-number v-model="data.numHJ" :min="0" :max="999" style="width:100%">
                            <template #suffix><span>发</span></template>
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="12">
                        <span class="label">烟条用量</span>
                        <el-input-number v-model="data.numYT" :min="0" :max="99" style="width:100%">
                            <template #suffix><span>条</span></template>
                        </el-input-number>
                    </el-col>
                    <el-col :span="12" >
                        <span class="label">其他用量</span>
                        <el-input-number v-model="data.numOther" :min="0" :max="99" style="width:100%">
                            <template #suffix><span>个</span></template>
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="20">
                        <span class="label">射向</span>
                        <el-input-number v-model="shootDirectBegin" :min="0" :max="360" style="width:100%">
                            <template #suffix><span>度</span></template>
                        </el-input-number>
                        <span style="margin:0 10px;font-size: 22px;">~</span>
                        <el-input-number v-model="shootDirectEnd" :min="0" :max="360" style="width:100%">
                            <template #suffix><span>度</span></template>
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="20">
                        <span class="label">俯仰角</span>
                        <el-input-number v-model="shootAngleBegin" :min="0" :max="90" style="width:100%">
                            <template #suffix><span>度</span></template>
                        </el-input-number>
                        <span style="margin:0 10px;font-size: 22px;">~</span>
                        <el-input-number v-model="shootAngleEnd" :min="0" :max="90" style="width:100%">
                            <template #suffix><span>度</span></template>
                        </el-input-number>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="12">
                        <span class="label">作业面积</span>
                        <el-input-number v-model="data.area" :min="1" :max="99" style="width:100%">
                            <template #suffix><span>km²</span></template>
                        </el-input-number>
                    </el-col>
                    <el-col :span="12">
                        <span class="label">作业效果</span>
                        <el-select v-model="data.effect" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in effectOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="rowGutter">
                    <el-col :span="12">
                        <span class="label">作业前天气</span>
                        <el-select v-model="data.weatherBefore" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in weatherOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                    <el-col :span="12">
                        <span class="label">作业后天气</span>
                        <el-select v-model="data.weatherAfter" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in weatherOptions" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-col>
                </el-row>
                <div class="page-btns">
                    <el-button @click="cancel" type="default" @mousedown.stop>取消</el-button>
                    <el-button type="primary" @mousedown.stop @click="save(data)">保存</el-button
                    >
                </div>
            </div>
        </div>
    </teleport>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import {作业点,增加完成信息,判断是否有完成信息,判断是否有完成信息确认,getMask} from "~/api/天工.ts";
import moment from "moment";
import { reactive, onMounted, onBeforeUnmount,watch,ref,inject,computed } from "vue";
const beginDate = computed({
    get(){
        return moment(data.value.beginTm,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD')
    },
    set(val){
        data.value.beginTm = val + moment(data.value.beginTm,'YYYY-MM-DD HH:mm:ss').format(' HH:mm:ss')
    }
})
const beginTime = computed({
    get(){
        return moment(data.value.beginTm,'YYYY-MM-DD HH:mm:ss').format('HH:mm:ss')
    },
    set(val){
        data.value.beginTm = moment(data.value.beginTm,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD') + ' ' + val
    }
})


const shootDirectBegin = computed({
    get(){
        return Number(data.value.shootDirect.substring(0,3))
    },
    set(val){
        if(val!=null){
            data.value.shootDirect = val.toString().padStart(3,'0') + shootDirectEnd.value.toString().padStart(3,'0')
        }
    }
})
const shootDirectEnd = computed({
    get(){
        return Number(data.value.shootDirect.substring(3,6))
    },
    set(val){
        if(val!=null){
            data.value.shootDirect = shootDirectBegin.value.toString().padStart(3,'0') + val.toString().padStart(3,'0')
        }
    }
})

const shootAngleBegin = computed({
    get(){
        return Number(data.value.shootAngle.substring(0,2))
    },
    set(val){
        if(val!=null){
            data.value.shootAngle = val.toString().padStart(2,'0') + shootAngleEnd.value.toString().padStart(2,'0')
        }
    }
})
const shootAngleEnd = computed({
    get(){
        return Number(data.value.shootAngle.substring(2,4))
    },
    set(val){
        if(val!=null){
            data.value.shootAngle = shootAngleBegin.value.toString().padStart(2,'0') + val.toString().padStart(2,'0')
        }
    }
})
const rowGutter =20
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
const effectOptions = reactive([
    { value: 0, label: "好" },
    { value: 1, label: "一般" },
    { value: 2, label: "不好" },
])
const weatherOptions = reactive([
    { value: 0, label: "阴" },
    { value: 1, label: "阴有零星小雨" },
    { value: 2, label: "阴有零星小雪" },
    { value: 3, label: "阵雨" },
    { value: 4, label: "雷阵雨" },
    { value: 5, label: "雷阵雨伴有大风" },
    { value: 6, label: "冰雹" },
    { value: 7, label: "小雨" },
    { value: 8, label: "中雨" },
    { value: 9, label: "大雨" },
    { value: 10, label: "雾" },
    { value: 11, label: "小雪" },
    { value: 12, label: "中雪" },
    { value: 13, label: "大雪" },
    { value: 14, label: "雨夹雪" },
    { value: 15, label: "大风" },
    { value: 16, label: "雷电" },
    { value: 17, label: "多云" },
])
const save = async(data) => {
    if(data.strID==null){
        ElMessage({
            message: '请选择作业点编号',
            type: 'error',
        })
        return
    }
    const workID = `RW${data.strID}${moment(data.beginTm,'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD-HH-mm-ss')}`
    // const result1 = await 判断是否有完成信息(workID)
    // if(result1.data.results.length>0){
    //     ElMessage({
    //         message: '\'完成信息\'已经存在',
    //         type: 'error',
    //     })
    //     return
    // }
    // const result2 = await 判断是否有完成信息确认(workID)
    // if(result2.data.results.length>0){
    //     ElMessage({
    //         message: '\'完成信息确认\'已经存在',
    //         type: 'error',
    //     })
    //     return
    // }
    const mask = getMask()
    增加完成信息({
        workID,
        strZydID: data.strID,
        tagPos:strPos.value,
        beginTm:data.beginTm,
        timeLen:data.duration,
        workType:data.iWorkType,
        workTool:data.iWeapon,
        numPD:data.numPD,
        numHJ:data.numHJ,
        numYT:data.numYT,
        numOther:data.numOther,
        shootDirect:data.shootDirect,
        shootAngle:data.shootAngle,
        workArea:data.area,
        beforeWeather:data.weatherBefore,
        afterWeather:data.weatherAfter,
        workEffect:data.effect,
        isconfirmed:0,
        isquxianconfirmed:mask=='%%'?1:0,//如果是北京人影指挥中心，默认确认，是区县人影办，为待确认
        recordTm:moment().format('YYYY-MM-DD HH:mm:ss'),
    }).then((res)=>{
        ElMessage({
            message: '保存成功',
            type: 'success',
        })
        触发完成信息查询.value = Date.now()
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
watch(show,()=>{
    if(show.value){
        data.value.beginTm = moment().format('YYYY-MM-DD HH:mm:ss')
    }
})
const data = defineModel('data',{
    default:reactive({
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
        beginTm:moment().format('YYYY-MM-DD HH:mm:ss'),
        duration: 60,
        unitName: "",
        numPD:0,
        numHJ:0,
        numYT:0,
        numOther:0,
        shootDirect:'000000',
        shootAngle:'0000',
        area:0,
        effect:0,
        weatherBefore:0,
        weatherAfter:7
    })
})
const zydOptions = reactive<any[]>([])
const strName = ref("")
const strPos = ref("")
watch(()=>data.value.strID,()=>{
    const item = zydOptions.find((item:any)=>item.value==data.value.strID) as any
    strName.value = item?.name || ""
    strPos.value = item?.strPos || ""
})
const cancel = () => {
    show.value = false;
};
const 触发完成信息查询 = inject('触发完成信息查询',ref(Date.now()))
// let timer:number;
onMounted(() => {
    data.value.beginTm = moment().format('YYYY-MM-DD HH:mm:ss')
    作业点().then((res) => {
        const results = res.data.results;
        zydOptions.splice(0, zydOptions.length);
        results.forEach((item) => {
            zydOptions.push({label:item.strID,value:item.strID,name:item.strName,strPos:item.strPos});
        });
        results[0]&&(data.value.strID = results[0].strID);
        const item = zydOptions.find((item:any)=>item.value==data.value.strID) as any
        strName.value = item?.name || ""
        strPos.value = item?.strPos || ""
    });
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
        width: 600px;
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
                    //margin:0 10px;
                    min-width:80px;
                }
            }
        }
    }
}
</style>
