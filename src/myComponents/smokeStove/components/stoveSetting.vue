<template>
    <div class="stoveSetting module-box">
        <div class="module-top">
            <div class="module-title">设置</div>
            <div class="module-title-decoration"></div>
        </div>
        <div class="module-bottom">
            <div class="form-item">
                <div class="item-title">预约点火（请勿关闭空域申请界面以及起始时间必须大于当前时间，否则会导致预约功能失效）</div>
                <div class="item-content">
                    <el-form :model="appointForm" inline>
                        <el-form-item label="间隔">
                            <el-input-number
                                size="small"
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
                                size="small"
                                :disabled="appointed"
                                :min="1"
                                :max="1"
                                v-model="appointForm.flare"
                                ><template #suffix>
                                    <span>支</span>
                                </template></el-input-number
                            >
                        </el-form-item>
                        <el-form-item label="点火次数">
                            <el-input-number
                                size="small"
                                :disabled="appointed"
                                :min="0"
                                v-model="appointForm.times"
                            ></el-input-number>
                        </el-form-item>

                        <el-form-item label="起始时间">
                            <el-date-picker
                                size="small"
                                :disabled="appointed"
                                v-model="appointForm.beginTime"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                format="YYYY-MM-DD HH:mm:ss"
                                type="datetime"
                                placeholder="请选择起始时间"
                                :clearable="false"
                                style="width:150px"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="appointed" type="warning" @click="取消预约">取消预约</el-button>
                            <el-button v-else type="primary" @click="预约">开始预约</el-button>
                            <el-button type="primary" @click="批量预约">批量预约{{ selectedStove.length }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="form-item">
                <div class="item-title">即时点火</div>
                <div class="item-content">
                    <el-form :model="immedForm" inline>
                        <el-form-item label="烟条个数">
                            <el-input-number size="small" :min="1" :max="1" v-model="immedForm.num">
                                <template #suffix>
                                    <span>支</span>
                                </template>
                            </el-input-number>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="fire()">开始点火</el-button>
                            <el-button type="primary" @click="allfire()">批量点火{{ selectedStove.length }}</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="form-item">
                <div class="item-title">烟炉装载及卸载</div>
                <div class="item-content">
                    <el-form
                        :model="stoveLoadForm"
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
                    <el-form :model="systenInfo" inline>
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
                    <el-button type="primary" @click="click">查询站点信息</el-button>
                    <el-button type="primary" @click="queryWeatherInfo">查询站点气象信息</el-button>
                    <el-button class="elButton" @click="queryAllStoves" type="primary">一键获取烟炉状态</el-button>
                    <el-button class="elButton" @click="queryWeather" type="primary">一键获取气象信息</el-button>
                    <el-button class="elButton" @click="setAllTime" type="primary">一键设置烟炉时间</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment'
import { ElMessageBox, ElMessage } from "element-plus";
import { computed } from 'vue'
let timer:any;
const stoveList = inject('smokeStoveList',new Array())
const selectedStove = computed(()=>{
    let arr = new Array()
    stoveList.forEach((item) => {
        if(item.checked){
            arr.push(item)
        }
    })
    return arr
})
function queryAllStoves() {
  let promiseList: any[] = []
  stoveList.forEach((item) => {
    promiseList.push(查询烟条状态(item.strStoveID))
  })
  Promise.all(promiseList).then((res) => {
    ElMessage({
      type: "success",
      message: "一键查询烟条状态成功",
    });
  })
}

function queryWeather() {
  let promiseList: any[] = []
  stoveList.forEach((item) => {
    promiseList.push(查询天气情况(item.strStoveID))
  })
  Promise.all(promiseList).then((res) => {
    ElMessage({
      type: "success",
      message: "一键查询天情况成功",
    });
  })
}

function setAllTime() {
  let promiseList: any[] = []
  stoveList.forEach((item) => {
    promiseList.push(给烟炉设置时间(item.strStoveID, moment().format('YYYY-MM-DD HH:mm:ss')))
  })
  Promise.all(promiseList).then((res) => {
    ElMessage({
      type: "success",
      message: "一键设置时间成功",
    });
  })
}
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
        stoveList.forEach((item)=>{
            if(item.strStoveID === currentStove.value.strStoveID){
                item.currentTime = '数据获取中···';
            }
        })
    })
}
import { 查询烟条状态,即时点火,烟条装载,烟条卸载,烟炉的时间查询,给烟炉设置时间,查询天气情况,获取所有烟炉的预约点火信息,预约点火,取消预约点火,判断是否可以点火 } from "~/api/天工";
import { reactive, inject, watch, ref,onMounted,onBeforeUnmount } from "vue";
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
onMounted(()=>{
    if(setting.enableTimer){
        timer = setInterval(()=>{
            currentTime.value = Date.now();
            if(moment(systenInfo.time,'YYYY-MM-DD HH:mm:ss').isBefore(moment())){
                systenInfo.time = moment().format('YYYY-MM-DD HH:mm:ss')
            }
            if(moment(appointForm.beginTime,'YYYY-MM-DD HH:mm:ss').isBefore(moment())&&!appointed.value){
                appointForm.beginTime = moment().format('YYYY-MM-DD HH:mm:ss')
            }
        },1000)
    }
})
onBeforeUnmount(()=>{
    clearInterval(timer)
})
const appointed = ref(false)
const currentStove = inject<any>("currentStove");
const currentTime = ref(Date.now());
判断是否可以点火('110114ZS').then(res=>{
    console.log(res.data)
})
watch([currentStove,currentTime],()=>{
    if(currentStove.value.strStoveID){
        获取所有烟炉的预约点火信息().then(res=>{
            // 得到预约点火信息后，判断是否可以点火一次，二次，三次等等。如果时间未到，不能点火。如果时间过了，也不能点火。
            // 如果有记录但是未开始，可以取消预约
            // 如果没有记录，可以预约
            appointed.value = false
            res.data.results.forEach((item:any)=>{
                if(item.stoveID === currentStove.value.strStoveID){
                    appointForm.beginTime = item.beginTime
                    appointForm.flare = item.flare
                    appointForm.interval = item.interval
                    appointForm.times = item.times
                    appointed.value = true
                }
                stoveList.forEach(stove => {
                    if(stove.strStoveID === item.stoveID){
                        if(moment().isBefore(moment(item.beginTime,'YYYY-MM-DD HH:mm:ss'))){
                            stove.canFire = true//确保系统持续运行前，系统时间是小于预约时间的情况下，才能点火。
                        }else{
                            if(stove.canFire){//多个浏览器或者多个账号同时打开该组件，会出现重复点火的可能，需要通过数据库防止重复点火。（该组件未渲染会导致无法点火）
                                stove.canFire = false
                                console.log('开始点火')
                                判断是否可以点火(stove.strStoveID).then(res=>{
                                    console.log('>>>>>>>>>>>',res.data)
                                    debugger
                                    for(let i=0;i<item.times;i++){
                                        setTimeout(()=>{
                                            if(i === 0){
                                                ElMessage({
                                                    type:'success',
                                                    message: `预约点火开始`,
                                                })
                                            }
                                            即时点火(stove.strStoveID,item.flare).then(res=>{
                                                console.log(`第${i+1}次预约点火成功`)
                                                ElMessage({
                                                    type:'success',
                                                    message: `第${i+1}次预约点火成功`,
                                                })
                                            }).catch(err=>{
                                                ElMessage({
                                                    type:'error',
                                                    message: `第${i+1}次预约点火失败`,
                                                })
                                            })
                                            if(i === item.times - 1){
                                                取消预约点火(item.stoveID).then(res=>{
                                                    currentTime.value = Date.now()
                                                    appointForm.beginTime = moment().format('YYYY-MM-DD HH:mm:ss')
                                                    appointForm.interval = 10
                                                    appointForm.flare = 1
                                                    appointForm.times = 2
                                                    ElMessage({
                                                        type:'success',
                                                        message: `预约点火结束`,
                                                    })
                                                })
                                            }
                                        },i*item.interval*60*1e3)
                                    }
                                })
                            }
                        }
                    }
                });
            })
        })
    }
},{
    immediate:true
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
function allfire(){
    ElMessageBox.alert('是否确定发送批量烟炉立即点火命令', '提示', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: '确定',
    type: 'info'
    }).then(() => {
        let funcs = new Array()
        selectedStove.value.forEach(stove=>{
            funcs.push(Promise.resolve(即时点火(stove.strStoveID,immedForm.num)))
        })
        Promise.all(funcs).then(res=>{
            ElMessage({
                type: 'success',
                message: `批量立即点火命令发送成功`,
            })
        }).catch(err=>{
            console.log(err);
            ElMessage({
                type:'error',
                message: `批量立即点火命令发送失败`,
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
const 批量预约 = () => {
    ElMessageBox.alert('是否确定发送批量预约点火命令', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: '确定',
        type: 'info'
    }).then(() => {
        const funcs = new Array()
        selectedStove.value.forEach((stove:any)=>{
            funcs.push(Promise.resolve(预约点火({beginTime:appointForm.beginTime,interval:appointForm.interval,flare:appointForm.flare,times:appointForm.times,stoveID:stove.strStoveID})))
        })
        Promise.all(funcs).then(res=>{
            currentTime.value = Date.now()
            ElMessage({
                type:'success',
                message: `批量预约点火命令发送成功`,
            })
        }).catch(err=>{
            ElMessage({
                type:'error',
                message: `批量预约点火命令发送失败`,
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
        height: fit-content;
    }
    .form-item {
        white-space: nowrap;
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
