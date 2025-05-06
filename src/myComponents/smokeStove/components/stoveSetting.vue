<template>
    <div class="stoveSetting module-box">
        <div class="module-top">
            <div class="module-title">设置</div>
            <div class="module-title-decoration"></div>
        </div>
        <div class="module-bottom">
            <el-scrollbar height="100%">
                <div class="form-item">
                    <div class="item-title">预约点火</div>
                    <div class="item-content">
                        <el-form :model="appointForm" label-width="auto" inline>
                            <el-form-item label="间隔">
                                <el-input-number
                                    :disabled="appointed"
                                    :min="0"
                                    v-model="appointForm.interval"
                                >
                                    <template #suffix>
                                        <span>分钟</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="每次点燃">
                                <el-input-number
                                    :disabled="appointed"
                                    :min="0"
                                    v-model="appointForm.flare"
                                    ><template #suffix>
                                        <span>支</span>
                                    </template></el-input-number
                                >
                            </el-form-item>
                            <el-form-item label="点火次数">
                                <el-input-number
                                    :disabled="appointed"
                                    :min="0"
                                    v-model="appointForm.times"
                                ></el-input-number>
                            </el-form-item>

                            <el-form-item label="起始时间">
                                <el-date-picker
                                    :disabled="appointed"
                                    v-model="appointForm.beginTime"
                                    value-format="YYYY-MM-DD HH:mm:ss"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    type="datetime"
                                    placeholder="请选择起始时间"
                                    :clearable="false"
                                />
                            </el-form-item>
                            <el-form-item>
                                <el-button v-if="appointed" type="warning" @click="取消预约">取消预约</el-button>
                                <el-button v-else type="primary" @click="预约">开始预约</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item-title">即时点火</div>
                    <div class="item-content">
                        <el-form :model="immedForm" label-width="auto" inline>
                            <el-form-item label="烟条个数">
                                <el-input-number :min="1" :max="1" v-model="immedForm.num">
                                    <template #suffix>
                                        <span>支</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="fire()">开始点火</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item-title">烟炉装载及卸载</div>
                    <div class="item-content">
                        <el-form
                            :model="stoveLoadForm"
                            label-width="auto"
                            inline
                        >
                            <el-form-item>
                                <el-select
                                    disabled
                                    v-model="stoveLoadForm.loadNum"
                                    placeholder="请选择装载烟炉"
                                >
                                    <el-option
                                        v-for="item in stoveOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                                <el-button type="primary" class="l-btn" @click="load">装载烟炉</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-select
                                    disabled
                                    v-model="stoveLoadForm.unloadNum"
                                    placeholder="请选择卸载烟炉"
                                >
                                    <el-option
                                        v-for="item in stoveOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                                <el-button type="primary" class="l-btn" @click="unloadStove">卸载烟炉</el-button
                                >
                            </el-form-item>
                            <el-form-item>
                                <el-input-number
                                    :min="1"
                                    v-model="stoveLoadForm.smokeBarIndex"
                                >
                                </el-input-number>
                                <el-button type="primary" class="l-btn" @click="unload">卸载烟条</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item-title">系统时间设置及查询</div>
                    <div class="item-content">
                        <el-form :model="systenInfo" label-width="auto" inline>
                            <el-form-item>
                                <el-button type="primary" @click="queryTime">查询时间</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-date-picker
                                    v-model="systenInfo.time"
                                    type="datetime"
                                    placeholder="请选择时间"
                                    :clearable="false"
                                />
                                <el-button type="primary" class="l-btn" @click="setTime">设置时间</el-button
                                >
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item-title">信息获取</div>
                    <div class="item-content">
                        <el-form :model="systenInfo" label-width="auto" inline>
                            <el-form-item>
                                <el-button type="primary" @click="click">查询站点信息</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="queryWeatherInfo">查询站点气象信息</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { ElMessageBox, ElMessage } from "element-plus";
const stroveList = inject('smokeStoveList',new Array<any>())
function click(){
    ElMessageBox.alert('是否确定发送状态查询命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(() => {
        查询烟条状态(currentStove.value.strStoveID).then(res=>{
            ElMessage({
                type:'success',
                message: `状态查询命令发送成功`,
            })
        }).catch(()=>{
            ElMessage({
                type:'error',
                message: `状态查询命令发送失败`,
            })
        });
        stroveList.forEach((item)=>{
            if(item.strStoveID === currentStove.value.strStoveID){
                item.currentTime = '数据获取中···';
            }
        })
    })
}
import { 查询烟条状态,即时点火,烟条装载,烟条卸载,烟炉的时间查询,给烟炉设置时间,查询天气情况,通过烟炉ID获取预约点火信息,预约点火,取消预约点火 } from "~/api/天工";
import { reactive, inject, watch, ref } from "vue";
const appointed = ref(false)
const currentStove = inject<any>("currentStove");
const currentTime = ref(Date.now());
watch([currentStove,currentTime],()=>{
    通过烟炉ID获取预约点火信息(currentStove.value.strStoveID).then(res=>{
        //得到预约点火信息后，判断是否可以点火一次，二次，三次等等。如果时间未到，不能点火。如果时间过了，也不能点火。
        // 如果有记录但是未开始，可以取消预约
        // 如果没有记录，可以预约
        console.log(res)
        if(res.data.results.length > 0){
            appointed.value = true
            let item = res.data.results[0]
            appointForm.beginTime = item.beginTime
            appointForm.flare = item.flare
            appointForm.interval = item.interval
            appointForm.times = item.times
        }else{
            appointed.value = false
        }
    })
})
function fire(){
    ElMessageBox.alert('是否确定发送立即点火命令', '提示', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确定',
    type: 'info'
    }).then(() => {
        即时点火(currentStove.value.strStoveID,immedForm.num).then(res=>{
            ElMessage({
                type: 'success',
                message: `立即点火命令发送成功`,
            })
        }).catch(err=>{
            console.log(err);
            ElMessage({
                type:'error',
                message: `立即点火命令发送失败`,
            })
        })
    })
}
function unloadStove(){
    ElMessageBox.alert('是否确定发送烟炉装载命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(() => {
        //996表示第一个烟炉
        烟条卸载(currentStove.value.strStoveID,996).then(res=>{
            ElMessage({
                type: 'success',
                message: `烟炉卸载命令发送成功`,
            })
        }).catch(err=>{
            console.log(err);
            ElMessage({
                type:'error',
                message: `烟炉卸载命令发送失败`,
            })
        })
    })
}
function load(){
    ElMessageBox.alert('是否确定发送烟炉装载命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(() => {
        烟条装载(currentStove.value.strStoveID,'996').then(res=>{
            ElMessage({
                type: 'success',
                message: `烟炉装载命令发送成功`,
            })
        }).catch(err=>{
            console.log(err);
            ElMessage({
                type:'error',
                message: `烟炉装载命令发送失败`,
            })
        })
    })
}
function unload(){
    ElMessageBox.alert('是否确定发送烟条卸载命令', '提示', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确定',
    type: 'info'
    }).then(() => {
        烟条卸载(currentStove.value.strStoveID,stoveLoadForm.smokeBarIndex).then(res=>{
            ElMessage({
                type: 'success',
                message: `烟条卸载命令发送成功`,
            })
        }).catch(err=>{
            console.log(err);
            ElMessage({
                type:'error',
                message: `烟条卸载命令发送失败`,
            })
        })
    })
}
function queryTime(){
    ElMessageBox.alert('是否确定发送查询时间命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(() => {
        烟炉的时间查询(currentStove.value.strStoveID).then(res=>{
            ElMessage({
                type: 'success',
                message: `查询时间命令发送成功`,
            })
        }).catch(err=>{
            console.log(err);
            ElMessage({
                type:'error',
                message: `查询时间命令发送失败`,
            })
        })
    })
}
function setTime(){
    ElMessageBox.alert('是否确定发送设置时间命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(() => {
        给烟炉设置时间(currentStove.value.strStoveID,systenInfo.time).then(res=>{
            ElMessage({
                type: 'success',
                message: `设置时间命令发送成功`,
            })
        }).catch(err=>{
            console.log(err);
            ElMessage({
                type:'error',
                message: `设置时间命令发送失败`,
            })
        })
    })
}
function queryWeatherInfo(){
    ElMessageBox.alert('是否确定发送查询气象信息命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(()=>{
        查询天气情况(currentStove.value.strStoveID).then(res=>{
            ElMessage({
                type:'success',
                message: `查询气象信息命令发送成功`,
            })
        }).catch(err=>{
            ElMessage({
                type:'error',
                message: `查询气象信息命令发送失败`,
            })
        })
    })
}
// 预约点火
let appointForm = reactive({
    beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    interval: 10,
    flare: 1,
    times: 2,
});
// 即时点火
let immedForm = reactive({
    num: 1,
});
// 烟炉装载及卸载
let stoveLoadForm = reactive({
    loadNum: "第一个烟炉",
    unloadNum: "第一个烟炉",
    smokeBarIndex: 1,
});
// 系统时间设置及查询
let systenInfo = reactive({
    time: moment().format("YYYY-MM-DD HH:mm:ss"),
});
// 烟炉配置项
let stoveOptions = reactive([
    {
        label: "第一个烟炉",
        value: "1",
    },
    {
        label: "第二个烟炉",
        value: "2",
    },
    {
        label: "第三个烟炉",
        value: "3",
    },
    {
        label: "所有烟炉",
        value: "4",
    },
]);
const 预约 = () => {
    ElMessageBox.alert('是否确定发送预约点火命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(() => {
        预约点火({beginTime:appointForm.beginTime,interval:appointForm.interval,flare:appointForm.flare,times:appointForm.times,stoveID:currentStove.value.strStoveID}).then(res=>{
            currentTime.value = Date.now()
            ElMessage({
                type:'success',
                message: `预约点火命令发送成功`,
            })
        }).catch(err=>{
            ElMessage({
                type:'error',
                message: `预约点火命令发送失败`,
            })
        })
    })
}
const 取消预约 = () => {
    ElMessageBox.alert('是否确定发送取消预约点火命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(()=>{
        取消预约点火(currentStove.value.strStoveID).then(res=>{
            currentTime.value = Date.now()
            appointForm.beginTime = moment().format('YYYY-MM-DD HH:mm:ss')
            appointForm.interval = 10
            appointForm.flare = 1
            appointForm.times = 2
            ElMessage({
                type:'success',
                message: `取消预约点火命令发送成功`,
            })
        }).catch(err=>{
            ElMessage({
                type:'error',
                message: `取消预约点火命令发送失败`,
            })
        })
    })
}
</script>

<style lang="scss" scoped>
.stoveSetting {
    height: 100%;
    // overflow-y: auto;
    .module-bottom {
        height: calc(100% - 0.2rem);
    }
    .form-item {
        .el-select {
            width: 1.6rem;
        }
        :deep(.el-date-editor--datetime) {
            width: 2.04rem;
        }

        &:not(:last-child) {
            margin-bottom: $grid-1;
        }
        .item-title {
            margin-bottom: $grid-1;
            color: var(--el-text-color-primary);
        }
        .l-btn {
            margin-left: $grid-1;
        }
    }
}
</style>
