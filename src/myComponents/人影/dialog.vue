<template>
    <div class="dragDialog absolute wstd-container" style="width:fit-content;height: fit-content;pointer-events: none;">
        <div class="top" style="display: flex;align-items: center;">
            <div
                class="box map-btn"
                style="user-select: none;cursor: pointer;pointer-events: auto;"
                :class="{ active: tabActive == 1 }"
                @click="tabActive == 1 ? tabActive = 0 : tabActive = 1"
            >
                <svg-icon name="table"></svg-icon>
                <span class="label">作业点列表</span>
            </div>
            <div style="font-size: 20px;font-family: Digital-Classic,Menlo,Consolas,Monaco;text-shadow:  2px 2px 8px rgba(0, 0, 0, 1);color:white;margin-left:10px;pointer-events: auto;display: flex;align-items: center;"><Colormap></Colormap><div style="margin-left:10px;">{{ 数据时间 }}</div></div>
        </div>
        <div class="bottom wstd-content" style="position: relative;pointer-events: auto;" v-if="tabActive">
            <div class="close-btn" @click="tabActive = 0">
                <el-icon v-html="closeSvg"></el-icon>
            </div>
            <div class="bottom-content">
                <div style="display: flex;flex-direction: row;align-items: center;">
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
                <div class="contain" @mousedown.stop>
                    <div
                        @scroll="scrolling"
                        style="
                            height: 100%;
                            overflow: auto;
                            box-sizing: border-box;
                            position: relative;
                            margin-top: 12px;
                            scroll-padding-top: 14px;
                        "
                    >
                        <table style="height: 100%;">
                            <thead>
                                <tr class="z-1">
                                    <th>序号</th>
                                    <th>ID</th>
                                    <th>简码</th>
                                    <th>名称</th>
                                    <th>设备类型</th>
                                    <!-- <th>经纬度</th> -->
                                    <!-- <th>海拔</th> -->
                                </tr>
                            </thead>
                            <tbody style="position: relative">
                                <td v-if="options.list.length==0" colspan="5">
                                    <div style="position: relative;width: 100%;height: 100%;display: flex;justify-content: center;align-items: center;">{{ t('el.table.emptyText') }}</div>
                                </td>
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
                                    <!-- <td>{{ v.strPos }}</td> -->
                                    <!-- <td>{{ v.iAltitude }}</td> -->
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
                </div>
            </div>
        </div>
        <Frame title="作业点过滤" v-model:render="show" width="500px" height="300px">
            <ZydFilter></ZydFilter>
        </Frame>
    </div>
</template>
<script lang="ts" setup>
import ZydFilter from './zydFilter.vue'
import Frame from '~/frames/frame.vue'
import Colormap from './色标.vue'
import closeSvg from '~/assets/close.svg?raw'
import { reactive, onMounted, watch, computed ,ref} from "vue";
const show = ref(false)
import { useStationStore } from "~/stores/station";
import { eventbus } from "~/eventbus";
import { useSettingStore } from '~/stores/setting'
const setting = useSettingStore()
const 数据时间 = computed(()=>{
    if(setting.人影.监控.红外云图){
        return setting.人影.监控.红外云图时间
    }else if(setting.人影.监控.CMPAS降水融合3km){
        return setting.人影.监控.CMPAS降水融合3km时间
    }else if(setting.人影.监控.组合反射率){
        return setting.人影.监控.组合反射率时间
    }else if(setting.人影.监控.睿图雷达){
        return setting.人影.监控.睿图雷达时间
    }else if(setting.人影.监控.真彩图){
        return setting.人影.监控.真彩图时间
    }
    return ''
})
import {getMask} from '~/api/天工.ts'
const mask = getMask()
const 计算权限 = computed(()=>{
    if(['%%','12%','13%','14%','15%'].includes(mask as string)){
        return true
    }
    return false
})

import moment from 'moment'
let tabActive = ref(0);

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
import { useLocale } from 'element-plus'
const { t } = useLocale()
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
.dragDialog {
    min-width:500px;
    width: fit-content;
}
.contain {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 208px;
    .menuUl {
        outline: none;
        position: absolute;
        display: none;
        flex-direction: column;
        margin: 0;
        height: auto;
        font-size: 14px;
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
}

// .dark .operation_filter {
//   &::-webkit-input-placeholder {
//     color: #999;
//   }
// background-color: #2b2b2b;
// border: 0 solid #c1ccd3;
// &:focus {
//   color: #fff;
//   background-color: #4b4b4b;
//   border-color: #4d90fe;
// }
// }
.dragDialog {
    display: flex;
    flex-direction: column;
    // background: linear-gradient(172.98deg,hsla(0,0%,100%,0.08) 1.49%,hsla(0,0%,100%,0.0208) 99.64%);
    // box-shadow: 0 23px 20px -20px rgb(9 10 18 / 10%), 0 0 15px rgb(9 10 18 / 6%);
}
// .dark .dragDialog {
//   background: var(--el-bg-color-overlay);
//   table {
//     tbody{
//       tr {
//         &:hover {
//           background: #ffffff22;
//         }
//         cursor: pointer;
//       }
//       tr.selected {
//         background: #ffffff66;
//       }
//     }
//     th,td {
//       border: 1px solid #2b2b2b;
//     }
//     td {
//       border-top: 0;
//     }
//   }
// }
</style>
