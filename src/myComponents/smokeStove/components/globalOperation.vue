<template>
  <div class="globalOperation">
    <el-tabs v-model="activeName" @tab-click="tabClickHandle">
      <el-tab-pane name="first">
        <template #label>
          <span>烟炉状态</span>
        </template>
        <div class="smoke-stove-box">
          <template
              v-for="(item, index) in sortSmokeStoveList"
              :key="item.strStoveID"
          >
            <div class="smoke-stove-item-card">
              <div
                  class="smoke-stove-item"
                  :class="`${currentStove.strStoveID == item.strStoveID?'active':''} ${item.status==0?'default':''}`"
                  @click="chooseSmokeStove(item)"
              >
                <div class="stove-item-top">
                  <div :class="`stove-name ${item.burningCount>0 ? 'burning' : ''}`">
                    {{ item.strName }}
                  </div>
                  <el-checkbox v-model="item.checked"></el-checkbox>
                </div>
                <div class="stove-item-bottom">
                  <div :class="`stove-status ${item.burningCount>0 ? 'burning' : ''}`">
                    <div class="stove-status-value">
                      {{ item.burningCount }}
                    </div>
                    <div class="stove-status-label">
                      燃烧
                    </div>
                  </div>
                  <div :class="`stove-status ${item.usedCount>0 ? 'warning' : ''}`">
                    <div class="stove-status-value">
                      {{ item.usedCount }}
                    </div>
                    <div class="stove-status-label">
                      已用
                    </div>
                  </div>
                  <div :class="`stove-status ${item.availableCount>0 ? 'available' : ''}`">
                    <div class="stove-status-value">
                      {{ item.availableCount }}
                    </div>
                    <div class="stove-status-label">
                      可用
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </el-tab-pane>
      <el-tab-pane label="消息" name="second">
        <div ref="logContainer" style="height: 100%;overflow: auto;white-space: pre;">
          <template v-for="item in logInfoList">
            <div v-if="setting.人影.监控.checkedKeys_stove.some(key=>item.strMgrUnit.includes(key))" v-html="item.text" style="display:flex;"></div>
          </template>
          <el-icon class="trash" @click="clearAll" v-html="trashSvg" style="position: absolute;right:20px;bottom:0;font-size:20px;"></el-icon>
        </div>
      </el-tab-pane>
      <el-tab-pane label="作业历史" name="third"><smoke-history></smoke-history></el-tab-pane>
    </el-tabs>
    <div style="position: absolute;top:20px;right:20px;width:1400px;display: flex;justify-content: space-between;align-items: center;">
      <div><div v-show="activeName=='third'" style="display: flex;" v-html="setting.人影.监控.烟炉统计信息"></div></div>
      <el-button size="small" :icon="Filter" circle @click="handleFilterClick"></el-button>
    </div>
  </div>
  <FilterDialog v-model:show="show"></FilterDialog>
</template>

<script setup lang="ts">
import { useSettingStore } from '~/stores/setting';
const setting = useSettingStore()
import FilterDialog from './filterDialog.vue'
import { Filter } from "@element-plus/icons-vue";
import trashSvg from "~/assets/trash.svg?raw";
import {ref, reactive, inject, watch, computed, onMounted, onBeforeUnmount} from "vue";
import type {TabsPaneContext} from "element-plus";
import {烟炉数据, 查询烟条状态, 查询天气情况, 给烟炉设置时间} from "~/api/天工.js";
import moment from "moment";
import {eventbus} from '~/eventbus/index'
import smokeHistory from './smokeHistory.vue'
import { useStationStore } from "~/stores/station";
const show = ref(false)
const station = useStationStore();
// const sortSmokeStoveList = computed(() => {
//   // 先排序，选中的在前面
//   // const selected = new Array()
//   // const unSelected = new Array()
//   // for(let i=0;i<smokeStoveList.length;i++){
//   //   if(smokeStoveList[i].checked){
//   //     selected.push(smokeStoveList[i])
//   //   }else{
//   //     unSelected.push(smokeStoveList[i])
//   //   }
//   // }
//   // return selected.concat(unSelected)
//   return smokeStoveList
// })

const smokeStoveList = inject('smokeStoveList', reactive(new Array<any>()))
const sortSmokeStoveList = reactive<any[]>([])
watch(()=>setting.人影.监控.checkedKeys_stove, (newVal, oldVal) => {
  const filterResults = new Array()
  smokeStoveList.forEach(item => {
    if(newVal.some((val)=>item.strMgrUnit.includes(val))){
      filterResults.push(item)
    }
  })
  sortSmokeStoveList.splice(0, sortSmokeStoveList.length, ...filterResults)
})

const logContainer = ref()
const logInfoList = inject('logInfoList', reactive(new Array<{text:string,strMgrUnit:string}>()))
let activeName = ref("first"); //当前选择的tab名字
let currentStove = inject<any>("currentStove"); //当前选中的烟炉
//选择烟炉
function chooseSmokeStove(item) {
  currentStove.value = item
}

watch(()=>station.currentStoveID, (newVal, oldVal) => {
  if(newVal == ''){
      currentStove.value = {
        burningCount: 0,
        usedCount: 0,
        availableCount: 0,
        status: 0,
        fireStatus: 0,
        barList: [
          [
            {id: 1, status: 0},
            {id: 2, status: 0},
            {id: 3, status: 0},
            {id: 4, status: 0},
            {id: 5, status: 0},
            {id: 6, status: 0},
            {id: 7, status: 0},
          ],
          [
            {id: 8, status: 0},
            {id: 9, status: 0},
            {id: 10, status: 0},
            {id: 11, status: 0},
            {id: 12, status: 0},
            {id: 13, status: 0},
            {id: 14, status: 0},
          ],
          [
            {id: 15, status: 0},
            {id: 16, status: 0},
            {id: 17, status: 0},
            {id: 18, status: 0},
            {id: 19, status: 0},
            {id: 20, status: 0},
            {id: 21, status: 0},
          ],
          [
            {id: 22, status: 0},
            {id: 23, status: 0},
            {id: 24, status: 0},
            {id: 25, status: 0},
            {id: 26, status: 0},
            {id: 27, status: 0},
            {id: 28, status: 0},
          ],
          [
            {id: 29, status: 0},
            {id: 30, status: 0},
            {id: 31, status: 0},
            {id: 32, status: 0},
            {id: 33, status: 0},
            {id: 34, status: 0},
            {id: 35, status: 0},
          ],
          [
            {id: 36, status: 0},
            {id: 37, status: 0},
            {id: 38, status: 0},
            {id: 39, status: 0},
            {id: 40, status: 0},
            {id: 41, status: 0},
            {id: 42, status: 0},
          ],
          [
            {id: 43, status: 0},
            {id: 44, status: 0},
            {id: 45, status: 0},
            {id: 46, status: 0},
            {id: 47, status: 0},
            {id: 48, status: 0},
            {id: 49, status: 0},
          ],
          [
            {id: 50, status: 0},
            {id: 51, status: 0},
            {id: 52, status: 0},
            {id: 53, status: 0},
            {id: 54, status: 0},
            {id: 55, status: 0},
            {id: 56, status: 0},
          ],
        ],
        currentTime : '',
        heartTime : 0
      }
      smokeStoveList.forEach(item => {
        item.checked = false
      })
  }else{
    smokeStoveList.forEach(item => {
      if(item.strStoveID == newVal){
        currentStove.value = item
        currentStove.value.checked = true
      }
    })
  }
})

function clearAll() {
  logInfoList.splice(0, logInfoList.length)
}

// 获取所有烟炉数据
function getSmokeStoveList() {
  烟炉数据()
      .then((res) => {
        let data = res.data.results;
        data.forEach((item) => {
          // 给燃烧、已用、可用添加默认值
          item.burningCount = 0;
          item.usedCount = 0;
          item.availableCount = 0;
          item.status = 0;
          item.fireStatus = 0;
          item.barList = [
            [
              {id: 1, status: 0},
              {id: 2, status: 0},
              {id: 3, status: 0},
              {id: 4, status: 0},
              {id: 5, status: 0},
              {id: 6, status: 0},
              {id: 7, status: 0},
            ],
            [
              {id: 8, status: 0},
              {id: 9, status: 0},
              {id: 10, status: 0},
              {id: 11, status: 0},
              {id: 12, status: 0},
              {id: 13, status: 0},
              {id: 14, status: 0},
            ],
            [
              {id: 15, status: 0},
              {id: 16, status: 0},
              {id: 17, status: 0},
              {id: 18, status: 0},
              {id: 19, status: 0},
              {id: 20, status: 0},
              {id: 21, status: 0},
            ],
            [
              {id: 22, status: 0},
              {id: 23, status: 0},
              {id: 24, status: 0},
              {id: 25, status: 0},
              {id: 26, status: 0},
              {id: 27, status: 0},
              {id: 28, status: 0},
            ],
            [
              {id: 29, status: 0},
              {id: 30, status: 0},
              {id: 31, status: 0},
              {id: 32, status: 0},
              {id: 33, status: 0},
              {id: 34, status: 0},
              {id: 35, status: 0},
            ],
            [
              {id: 36, status: 0},
              {id: 37, status: 0},
              {id: 38, status: 0},
              {id: 39, status: 0},
              {id: 40, status: 0},
              {id: 41, status: 0},
              {id: 42, status: 0},
            ],
            [
              {id: 43, status: 0},
              {id: 44, status: 0},
              {id: 45, status: 0},
              {id: 46, status: 0},
              {id: 47, status: 0},
              {id: 48, status: 0},
              {id: 49, status: 0},
            ],
            [
              {id: 50, status: 0},
              {id: 51, status: 0},
              {id: 52, status: 0},
              {id: 53, status: 0},
              {id: 54, status: 0},
              {id: 55, status: 0},
              {id: 56, status: 0},
            ],
          ];
          item.currentTime = ''
          item.heartTime = 0
          查询烟条状态(item.strStoveID)
        });
        smokeStoveList.splice(0, smokeStoveList.length, ...data);
        if (!currentStove.strStoveID) {
          currentStove.value = smokeStoveList[0]
        }



        const filterResults = new Array()
        smokeStoveList.forEach(item => {
          if(setting.人影.监控.checkedKeys_stove.some((val)=>item.strMgrUnit.includes(val))){
            filterResults.push(item)
          }
        })
        sortSmokeStoveList.splice(0, sortSmokeStoveList.length, ...filterResults)

      })
      .catch((err) => {
        console.log(err);
      });
}
import {exec} from '~/api/index.js'
// 切换tab
const tabClickHandle = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.paneName;
  // console.log(tab.paneName, tab.active, tab.index);
};
const process = (obj) => {
  if (!Array.isArray(obj)) {
    if (obj.type == 'stoveOnline') {
      smokeStoveList.forEach(item => {
        if (item.strStoveID == obj.data.stove_id) {
          logInfoList.push({text:moment().format('YYYY-MM-DD HH:mm:ss ') + `[<div style="color:#88f">${item.strName}</div>]` + `收到烟炉状态上报`,strMgrUnit:item.strMgrUnit})
          if (logInfoList.length > 100) {
            logInfoList.splice(0, logInfoList.length - 100)
          }
        }
      })
      for (let i = 0; i < smokeStoveList.length; i++) {
        if (smokeStoveList[i].strStoveID == obj.data.stove_id) {
          smokeStoveList[i].status = obj.data.b_online ? 1 : 3;
          smokeStoveList[i].heartTime = Date.now()
        }
      }
    } else if (obj.type == 'stoveCmdResponse') {
      smokeStoveList.forEach(item => {
        if (item.strStoveID == obj.data.stove_id) {
          logInfoList.push({text:moment().format('YYYY-MM-DD HH:mm:ss ') + `[<div style="color:#88f">${item.strName}</div>]` + obj.data.res_content,strMgrUnit:item.strMgrUnit})
          if (logInfoList.length > 100) {
            logInfoList.splice(0, logInfoList.length - 100)
          }
        }
      })
      for (let i = 0; i < smokeStoveList.length; i++) {
        if (smokeStoveList[i].strStoveID == obj.data.stove_id) {
          smokeStoveList[i].availableCount = obj.data.res_content.split('').filter((item:any) => item == '1').length;
          smokeStoveList[i].usedCount = obj.data.res_content.split('').filter((item:any) => item == '0' || item == '2').length;
          smokeStoveList[i].burningCount = obj.data.res_content.split('').filter((item:any) => item == '3').length;
          smokeStoveList[i].currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
          smokeStoveList[i].barList.forEach((item:any, j:number) => {
            item.forEach((it:any, i:number) => {
              it.status = Number(obj.data.res_content.substring(j * 7 + i, j * 7 + i + 1))
            })
          })
          //自动确认烟条点火记录
          exec({sqls:[`
DELETE FROM BEPK_RYB_GSYTHPT.stovefirehis
WHERE id NOT IN (
    SELECT MAX(id)
    FROM BEPK_RYB_GSYTHPT.stovefirehis
    WHERE stoveID = '${smokeStoveList[i].strStoveID}'
      AND fireStoveBarNo BETWEEN 1 AND ${smokeStoveList[i].usedCount}
      AND (bEdit = 0 OR bEdit IS NULL)
    GROUP BY stoveID, fireStoveBarNo
)
AND stoveID = '${smokeStoveList[i].strStoveID}'
AND fireStoveBarNo BETWEEN 1 AND ${smokeStoveList[i].usedCount}
AND (bEdit = 0 OR bEdit IS NULL)
`,`
UPDATE BEPK_RYB_GSYTHPT.stovefirehis
SET bEdit = 1
WHERE stoveID = '${smokeStoveList[i].strStoveID}'
  AND fireStoveBarNo BETWEEN 1 AND ${smokeStoveList[i].usedCount}
  AND (bEdit = 0 OR bEdit IS NULL)
`]}).then(res=>{
    // console.log(res)
  })
          break;
        }
      }
    }
  }
}
const getData = () => {
  getSmokeStoveList()
}
let timer
onMounted(() => {
  timer = setInterval(() => {
    smokeStoveList.forEach(item => {
      if (Date.now() - item.heartTime > 40e3) {//心跳间隔30s,超过40s认为离线
        item.status = 0
      }
    })
  }, 1000)
  eventbus.on('烟炉数据', process)
  eventbus.on('烟炉websocket已连接', getData)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  eventbus.off('烟炉数据', process)
  eventbus.off('烟炉websocket已连接', getData)
})
const handleFilterClick = () => {
  show.value = true
}
</script>

<style lang="scss" scoped>
.globalOperation {
  width: 100%;
  height: 100%;

  .elButton {
    margin-top: 10px;
  }

  .el-tabs:deep(.el-tabs__content) {
    .el-tab-pane {
      height: 100%;
    }
  }

  .trash {
    cursor: pointer;
  }

  .trash:active {
    opacity: 0.5;
  }

  .smoke-stove-box {
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(2, auto);
    grid-gap: $grid-2;
    place-content: top;

    .smoke-stove-item-card {
      .smoke-stove-item {
        padding: 4px;
        background:  var(--el-color-primary-light-8);
        border-radius: $border-radius-1;
        border: 4px solid transparent;
        // margin-top: $grid-3;
        box-sizing: border-box;
        color: var(--el-text-color-regular);

        .stove-item-top {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          .stove-name.burning{
            color:red;
            animation: burning 1s ease-in-out infinite;
            opacity: 0.25;
            will-change: opacity;
          }
          @keyframes burning {
            0%, 100% { opacity: 1 }
            50%      { opacity: 0.25 }
          }
          .el-checkbox{
            height: fit-content;
          }
        }

        .stove-item-bottom {
          display: flex;
          justify-content: space-between;

          .stove-status {
            display: flex;
            align-items: center;
            color:gray;
            &.warning{
              color:var(--el-color-warning);
            }
            &.burning{
              color:var(--el-color-danger);
            }
            &.available{
              color:var(--el-color-success);
            }
            .stove-status-label {
              // color: var(--el-text-color-regular);
            }
            .stove-status-value {
              font-size: 0.16rem;
              font-weight: 600;
            }
          }
        }

        &:hover {
          // transform: translateY(0.04rem);;
          background-color: var(--el-color-primary-light-5);
          box-shadow: var(--el-box-shadow-light);
        }
        &.default {
          background: var(--el-fill-color-darker);
        }
      }

      .smoke-stove-item.active {
        // transform: translate(0.04rem,0.04rem);
        border-color: var(--el-color-success);
        border-width: 4px;
        // background-color: var(--el-color-primary-light-7);
        box-shadow: var(--el-box-shadow-light);
      }
    }
  }
}

.el-tabs {
  height: 100%;
}

.el-tabs:deep(.el-tabs__header) {
  margin: 0;
}

.el-tabs:deep(.el-tabs__item) {
  height: 0.32rem;
  color: var(--el-text-color-regular);
}

.el-tabs:deep(.el-tabs__item.is-active) {
  height: 0.32rem;
  color: var(--el-color-primary);
}
</style>
