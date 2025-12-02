<template>
    <div style="flex:1;width:100%;height: 100%;background-color: var(--el-bg-color-opacity-8);display: flex;flex-direction: column;">
        <el-tabs type="border-card" class="demo-tabs" style="height: 100%;">
            <el-tab-pane style="position: relative;">
                <template #label>
                    <span class="custom-tabs-label">
                    <span>作业点</span>
                    </span>
                </template>
                <div style="position: relative;display: flex;flex-direction: row;align-items: center;padding:0 0 10px 0;">
                    <el-input
                        @mousedown.stop
                        name="过滤条件"
                        class="operation_filter flex-1"
                        placeholder="请输入过滤条件"
                        v-model="options.value"
                        clearable
                    />
                    <el-button v-if="计算权限" :icon="Filter" circle style="margin:0 10px; font-size:20px;" @click="()=>show=true"/>
                </div>
                <div
                    @scroll="scrolling"
                    style="overflow: auto;box-sizing: border-box;position: relative"
                >
                    <table>
                        <thead>
                            <tr class="z-1">
                                <th style="width:40px;">序号</th>
                                <th>ID</th>
                                <th>简码</th>
                                <th>名称</th>
                                <th>设备类型</th>
                            </tr>
                        </thead>
                        <tbody style="position: relative">
                            <tr
                                :id="'人影-' + v.strID"
                                :class="`${
                                    station.人影界面被选中的设备 == v.strID
                                        ? 'selected'
                                        : ''
                                }`"
                                v-for="(v, k) in options.list"
                                :key="v.strID"
                                @contextmenu.prevent="
                                    contextmenu($event, v)
                                "
                                @click="flyTo($event, v)"
                            >
                                <td>{{ k + 1 }}</td>
                                <td>{{ v.strID }}</td>
                                <td>{{ v.strCode }}</td>
                                <td>{{ v.strName }}</td>
                                <td>{{ formatWeapon(v.strWeapon) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <ul class="menuUl" tabindex="-1">
                    <li @click="click">
                        <img
                            src="/src/assets/新增.svg"
                            @click.native.stop
                        />作业申请
                    </li>
                    <li @click="click">
                        <img
                            src="/src/assets/修改.svg"
                            @click.native.stop
                        />作业预报
                    </li>
                    <li @click="click">
                        <img
                            src="/src/assets/删除.svg"
                            @click.native.stop
                        />完成报请求
                    </li>
                    <li @click="click">
                        <img
                            src="/src/assets/详情.svg"
                            @click.native.stop
                        />查看详细数据
                    </li>
                </ul>
                <Frame v-model:render="show">
                    <ZydFilter></ZydFilter>
                </Frame>
            </el-tab-pane>
            <el-tab-pane label="当前作业进度" style="width: 100%;height: 100%;">
                <Work :v="setting.planProps.当前作业进度"></Work>
            </el-tab-pane>
            <el-tab-pane label="今日作业记录" style="width: 100%;height: 100%;">
                <Work :v="setting.planProps.今日作业记录"></Work>
            </el-tab-pane>
            <el-tab-pane label="飞行计划"></el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts" setup>
import Work from './work.vue'
import ZydFilter from './zydFilter.vue'
import Frame from '~/frames/frame.vue'
import closeSvg from '~/assets/close.svg?raw'
import { reactive, onMounted, watch, computed ,ref} from "vue";
const show = ref(false)
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
import {getMask} from '~/api/天工.ts'
const mask = getMask()
const 计算权限 = computed(()=>{
    if(['%%','12%','13%','14%','15%'].includes(mask as string)){
        return true
    }
    return false
})

import moment from 'moment'
const formatWeapon = (weapon: number) =>
    [
        "火箭",
        "高炮",
        "火箭+高炮",
        "烟炉",
        "火箭+烟炉",
        "高炮+烟炉",
        "火箭+高炮+烟炉",
    ][weapon];
const props = withDefaults(defineProps<{ menus?: Array<any> }>(), {
    menus: () => [
        {
            id: 1,
            name: "便携11",
            deviceType: "便携式激光测风雷达",
            lng: 102.023,
            lat: 36.5353,
            altitude: 2157,
        },
    ],
});
const station = useStationStore();
import { useBus } from "~/myComponents/bus";
import { Filter } from '@element-plus/icons-vue'
const bus = useBus();
// const menus = reactive([
//   { code: 291, name: "白河堡作业点", status: "离线", equipment: "火箭", id: "110229041" },
//   { code: 295, name: "千家店作业点", status: "在线", equipment: "火箭", id: "110229042" },
//   { code: 297, name: "红旗甸作业点", status: "离线", equipment: "火箭", id: "110229043" },
//   { code: 275, name: "275", status: "离线", equipment: "火箭", id: "110229044" },
//   { code: 276, name: "276", status: "离线", equipment: "火箭", id: "110229045" },
//   { code: 277, name: "277", status: "离线", equipment: "火箭", id: "110229046" },
// ]);
onMounted(() => {
    $(".menuUl").on("focusout", () => {
        $(".menuUl").css({ display: "none" });
    });
});
const scrolling = () => {
    $(".menuUl").trigger("blur");
};
const options = reactive({
    list: new Array<any>(),
    value: "",
});
watch(
    [() => props.menus, () => options.value],
    ([result, value]) => {
        options.list = result.filter(
            (item) => item.strName.indexOf(value) > -1||item.strID.indexOf(value) > -1||item.strCode.indexOf(value) > -1
        );
    },
    {
        immediate: true,
    }
);
let currentStation: any;
const contextmenu = (event: MouseEvent, v: any) => {
    currentStation = v;
    // let offset = $(".menuUl").prev().offset() || { left: 0, top: 0 };
    // $(".menuUl")
    //   .css({
    //     display: "flex",
    //     left: event.clientX - offset.left + "px",
    //     top: event.clientY - offset.top + "px",
    //   })
    //   .trigger("focus");
};
const click = (event: MouseEvent) => {
    eventbus.emit(
        "站点列表菜单点击",
        currentStation,
        (event.target as HTMLElement).innerText
    );
    $(".menuUl").trigger("blur");
};
const flyTo = (event: any, v: any) => {
    station.人影界面被选中的设备 = v.strID;
    eventbus.emit("人影-将站点移动到屏幕中心", v);
};
</script>
<style scoped lang="scss">
table {
    border-collapse: collapse;
    overflow: auto;
    min-width: 100%;
    tr {
        height: 24px;
        font-weight: 400;
        border-bottom: 1px solid var(--el-border-color);
        font-size: 12px;
        // line-height: 28px;
    }
    thead {
        tr {
            // height: 24px;
            th {
                border-top: none;
                background-color: var(--el-color-primary);
                color: #fff;
            }
            th:first-child {
                border-left: none;
            }
            th:last-child {
                border-right: none;
            }
        }
    }
    tbody {
        background-color: var(--el-bg-color);
        tr {
            &:hover {
                background: var(--el-bg-color-overlay);
            }
            cursor: pointer;
        }
        tr.selected {
            background: var(--el-color-primary-light-8);
        }
        td:first-child {
            border-left: none;
        }
        td:last-child {
            border-right: none;
        }
        tr:last-child td {
            border-bottom: none;
        }
    }
    th,
    td {
        text-align: left;
        padding: 0 4px;
        // border: 1px solid var(--el-border-color);
    }
}
.menuUl {
    outline: none;
    position: absolute;
    display: none;
    flex-direction: column;
    margin: 0;
    height: auto;
    font-size: 10px;
    text-align: left;
    border-radius: 8px;
    border: none;
    background-color: #252948;
    border: 1px solid grey;
    color: #fff;
    list-style: none;
    padding: 2px;
    li {
        img {
            vertical-align: middle;
            width: 20px;
            height: 20px;
            pointer-events: none;
            filter: drop-shadow(var(--el-text-color-primary) 0 60px);
            transform: translateY(-60px);
        }
        vertical-align: middle;
        width: 140px;
        cursor: pointer;
        overflow: hidden;
        padding: 2px;
        margin: 2px;
        color: grey;
        &:hover {
            background-color: rgb(26, 117, 158);
            color: white;
        }
    }
    li:first-child {
        border-bottom: 1px solid grey;
    }
    li:last-child {
        border-top: 1px solid grey;
    }
}
::v-deep(.el-tabs__content){
    font-size: 12px;
    padding:10px;
    overflow: auto;
}
</style>
