<template>
    <div>
        <template v-if="hasPermission('12afdacf-0255-46d9-a0ec-7d9b2fc157da')">
            <div class="tool-btns" :class="themeStore.themeStyle" v-if="setting.menus">
                <div v-if="hasPermission('d1503195-0daa-3b8b-82f3-da29c156225d')"
                     :class="`map-tool-btn ${setting.人影.监控.是否显示作业面板?'active':''}`" @click="workButtonClick">
                    <div class="tool-btn-inside">
                        <svg-icon name="work" :width="iconSize" :height="iconSize"></svg-icon>
                    </div>
                </div>
                <div :class="`map-tool-btn ${setting.人影.监控.是否显示分布面板?'active':''}`"
                     @click="distributionButtonClick">
                    <div class="tool-btn-inside">
                        <svg-icon name="map-location" :width="iconSize" :height="iconSize"></svg-icon>
                    </div>
                </div>
                <div :class="`map-tool-btn ${setting.人影.监控.是否显示产品面板?'active':''}`"
                     @click="productsButtonClick">
                    <div class="tool-btn-inside">
                        <svg-icon name="radar" :width="iconSize" :height="iconSize"></svg-icon>
                    </div>
                </div>
                <div :class="`map-tool-btn ${setting.人影.监控.是否显示工具面板?'active':''}`"
                     @click="toolkitButtonClick">
                    <div class="tool-btn-inside">
                        <svg-icon name="tool" :width="iconSize" :height="iconSize"></svg-icon>
                    </div>
                </div>
                <div class="map-tool-btn disabled">
                    <div class="tool-btn-inside">
                        <svg-icon name="favorite" :width="iconSize" :height="iconSize"></svg-icon>
                    </div>
                </div>
            </div>
            <div class="side-box" v-if="setting.menus">
                <div class="side-box-left">
                    <side-buttons></side-buttons>
                </div>
                <MenuPanel v-if="showPanel"></MenuPanel>
            </div>
        </template>
       
        <!--<el-scrollbar v-if="hasPermission('78e09c3c-bcd2-47b3-b1bc-287ba83b8d0a')"-->
        <!--              :class="{'control-scrollbar':true,'top-left':user.roles.includes('分区'),'bottom-right':user.roles.includes('人影')}">-->
        <!--    <control-pane style="position:relative;pointer-events: auto;" :list="list" theme="default"></control-pane>-->
        <!--</el-scrollbar>-->
        <!-- <div style="position: absolute;pointer-events: auto;right:0;bottom:0;margin:10px;width:fit-content;box-sizing: border-box;height:auto;max-height:calc(100% - 20px);overflow: auto;border:1px solid red;">
          <control-pane style="position:relative" :list="list" theme="default"></control-pane>
        </div> -->
    </div>
</template>
<script lang="ts" setup>
import {useUserStore} from '~/stores/user'
import { useThemeStore} from '~/stores/theme.ts'
const themeStore = useThemeStore()
const user = useUserStore()
import {hasPermission} from '~/tools/index'
import sideButtons from './sideButtons.vue'
import MenuPanel from './menuPanel.vue'
import {reactive,computed,defineAsyncComponent,watch} from 'vue'
import {useSettingStore} from '~/stores/setting'
import {useMapStatusStore} from '~/stores/mapStatus'
import {useSysStatusStore} from '~/stores/sysStatus'
import {getMask} from '~/api/天工'
import {resetTheme} from '~/theme'
const ControlPane = defineAsyncComponent(() => import("~/myComponents/controlPane/index.vue"));
const setting = useSettingStore()
const mapStatus = useMapStatusStore()
const sys = useSysStatusStore()
const iconSize = '24px'
const workButtonClick = (e: any) => {
    setting.人影.监控.是否显示作业面板 = !setting.人影.监控.是否显示作业面板
    setting.人影.监控.是否显示分布面板 = false
    setting.人影.监控.是否显示产品面板 = false
    setting.人影.监控.是否显示工具面板 = false
}
const distributionButtonClick = (e: any) => {
  setting.人影.监控.是否显示作业面板 = false
  setting.人影.监控.是否显示分布面板 = !setting.人影.监控.是否显示分布面板
  setting.人影.监控.是否显示产品面板 = false
  setting.人影.监控.是否显示工具面板 = false
  setting.devtoolsOpen = false
}
const productsButtonClick = (e: any) => {
  setting.人影.监控.是否显示作业面板 = false
  setting.人影.监控.是否显示分布面板 = false
  setting.人影.监控.是否显示产品面板 = !setting.人影.监控.是否显示产品面板
  setting.人影.监控.是否显示工具面板 = false
  setting.devtoolsOpen = false
}
const toolkitButtonClick = (e: any) => {
  setting.人影.监控.是否显示作业面板 = false
  setting.人影.监控.是否显示分布面板 = false
  setting.人影.监控.是否显示产品面板 = false
  setting.人影.监控.是否显示工具面板 = !setting.人影.监控.是否显示工具面板
  setting.devtoolsOpen = false
}
const showPanel = computed(()=>{
  return setting.人影.监控.是否显示分布面板 || setting.人影.监控.是否显示产品面板 || setting.人影.监控.是否显示工具面板 || setting.人影.监控.是否显示作业面板
})
import {useTheme} from '~/theme';
import {modelRef} from '~/tools'
watch(()=>setting.devtoolsOpen,(val)=>{
  if(val){
    setting.人影.监控.是否显示分布面板 = false
    setting.人影.监控.是否显示产品面板 = false
    setting.人影.监控.是否显示工具面板 = false
  }
})
const theme = useTheme()
const list = reactive([{label: '工具箱', type: 'folder', opened: modelRef(setting, 'devtoolsOpen'), children: [
  {
    label: '主题',
    value: theme,
    type: 'select',
    options: [{value: 'light', label: '亮色'}, {value: 'dark', label: '暗色'}, {value: 'auto', label: '自动'}]
  },
  {
    label: '道路',
    value: modelRef(setting,'人影.监控.roadMap'),
    type: 'checkbox',
  },
  {
    label: '地图',
    value: modelRef(setting,'人影.监控.tile'),
    type: 'select',
    options: setting.地图列表
  },
  {
    label: '地图透明度',
    value: modelRef(setting, '人影.监控.tileOpacity'),
    type: 'range',
    min: 0,
    max: 1,
    arr: Array.from({length: 101}, (_, i: number) => i / 100)
  },
  {label: '准心', value: modelRef(setting, '人影.监控.准心'), type: 'checkbox'},
  {label: '菜单', value: modelRef(setting, 'menus'), type: 'checkbox'},
  // {label:'色相',value:toRefs(setting).hueRotate,type:'range',min:0,max:360,step:1,arr:Array.from({length:361},(_,i:number)=>i)},
  {label: '地面颜色', value: modelRef(setting, '人影.监控.landColor'), type: 'color'},
  {
    label: '全国行政区划', type: 'folder', opened: modelRef(setting, '人影.监控.districtOptionsOpened'), children: [
      {
        label: '填充',
        type: 'folder',
        opened: modelRef(setting, '人影.监控.districtOptions.districtOpened'),
        children: [
          {label: '显示', value: modelRef(setting, '人影.监控.districtOptions.district'), type: 'checkbox'},
          {label: '颜色', value: modelRef(setting, '人影.监控.districtOptions.districtFillColor'), type: 'color'},
          {
            label: '透明度',
            value: modelRef(setting, '人影.监控.districtOptions.districtFillOpacity'),
            type: 'range',
            min: 0,
            max: 1,
            arr: Array.from({length: 101}, (_, i: number) => i / 100)
          },
        ]
      },
      {
        label: '底线',
        type: 'folder',
        opened: modelRef(setting, '人影.监控.districtOptions.districtBaseOpened'),
        children: [
          {label: '显示', value: modelRef(setting, '人影.监控.districtOptions.districtBase'), type: 'checkbox'},
          {label: '颜色', value: modelRef(setting, '人影.监控.districtOptions.districtBaseColor'), type: 'color'},
          {
            label: '透明度',
            value: modelRef(setting, '人影.监控.districtOptions.districtBaseOpacity'),
            type: 'range',
            min: 0,
            max: 1,
            arr: Array.from({length: 101}, (_, i: number) => i / 100)
          },
          {
            label: '宽度',
            value: modelRef(setting, '人影.监控.districtOptions.districtBaseWidth'),
            type: 'range',
            min: 0,
            max: 5,
            arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
          },
        ]
      },
      {
        label: '界线',
        type: 'folder',
        opened: modelRef(setting, '人影.监控.districtOptions.districtLineOpened'),
        children: [
          {label: '显示', value: modelRef(setting, '人影.监控.districtOptions.districtLine'), type: 'checkbox'},
          {label: '颜色', value: modelRef(setting, '人影.监控.districtOptions.districtLineColor'), type: 'color'},
          {
            label: '透明度',
            value: modelRef(setting, '人影.监控.districtOptions.districtLineOpacity'),
            type: 'range',
            min: 0,
            max: 1,
            arr: Array.from({length: 101}, (_, i: number) => i / 100)
          },
          {
            label: '宽度',
            value: modelRef(setting, '人影.监控.districtOptions.districtLineWidth'),
            type: 'range',
            min: 0,
            max: 5,
            arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
          },
        ]
      },
    ]
  },
  // {
  //   label: '北京行政区划', type: 'folder', opened: modelRef(setting, '人影.监控.beijingOptionsOpened'), children: [
  //     {
  //       label: '填充',
  //       type: 'folder',
  //       opened: modelRef(setting, '人影.监控.beijingOptions.districtOpened'),
  //       children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.beijingOptions.district'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.beijingOptions.districtFillColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.beijingOptions.districtFillOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //       ]
  //     },
  //     {
  //       label: '底线',
  //       type: 'folder',
  //       opened: modelRef(setting, '人影.监控.beijingOptions.districtBaseOpened'),
  //       children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.beijingOptions.districtBase'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.beijingOptions.districtBaseColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.beijingOptions.districtBaseOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //         {
  //           label: '宽度',
  //           value: modelRef(setting, '人影.监控.beijingOptions.districtBaseWidth'),
  //           type: 'range',
  //           min: 0,
  //           max: 5,
  //           arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
  //         },
  //       ]
  //     },
  //     {
  //       label: '界线',
  //       type: 'folder',
  //       opened: modelRef(setting, '人影.监控.beijingOptions.districtLineOpened'),
  //       children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.beijingOptions.districtLine'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.beijingOptions.districtLineColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.beijingOptions.districtLineOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //         {
  //           label: '宽度',
  //           value: modelRef(setting, '人影.监控.beijingOptions.districtLineWidth'),
  //           type: 'range',
  //           min: 0,
  //           max: 5,
  //           arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
  //         },
  //       ]
  //     },
  //   ]
  // },
  // {
  //   label: '江西行政区划', type: 'folder', opened: modelRef(setting, '人影.监控.sichuanOptionsOpened'), children: [
  //     {
  //       label: '填充',
  //       type: 'folder',
  //       opened: modelRef(setting, '人影.监控.sichuanOptions.districtOpened'),
  //       children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.sichuanOptions.district'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.sichuanOptions.districtFillColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.sichuanOptions.districtFillOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //       ]
  //     },
  //     {
  //       label: '底线',
  //       type: 'folder',
  //       opened: modelRef(setting, '人影.监控.sichuanOptions.districtBaseOpened'),
  //       children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.sichuanOptions.districtBase'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.sichuanOptions.districtBaseColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.sichuanOptions.districtBaseOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //         {
  //           label: '宽度',
  //           value: modelRef(setting, '人影.监控.sichuanOptions.districtBaseWidth'),
  //           type: 'range',
  //           min: 0,
  //           max: 5,
  //           arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
  //         },
  //       ]
  //     },
  //     {
  //       label: '界线',
  //       type: 'folder',
  //       opened: modelRef(setting, '人影.监控.sichuanOptions.districtLineOpened'),
  //       children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.sichuanOptions.districtLine'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.sichuanOptions.districtLineColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.sichuanOptions.districtLineOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //         {
  //           label: '宽度',
  //           value: modelRef(setting, '人影.监控.sichuanOptions.districtLineWidth'),
  //           type: 'range',
  //           min: 0,
  //           max: 5,
  //           arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
  //         },
  //       ]
  //     },
  //   ]
  // },
  // {
  //   label: '华北飞行区域', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspacesOpened'), children: [
  //     {
  //       label: '填充', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.fillOpened'), children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.fill'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.fillColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.ryAirspaces.fillOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //       ]
  //     },
  //     {
  //       label: '底线', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.baseOpened'), children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.base'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.baseColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.ryAirspaces.baseOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //         {
  //           label: '宽度',
  //           value: modelRef(setting, '人影.监控.ryAirspaces.baseWidth'),
  //           type: 'range',
  //           min: 0,
  //           max: 5,
  //           arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
  //         },
  //       ]
  //     },
  //     {
  //       label: '界线', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.lineOpened'), children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.line'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.lineColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.ryAirspaces.lineOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //         {
  //           label: '宽度',
  //           value: modelRef(setting, '人影.监控.ryAirspaces.lineWidth'),
  //           type: 'range',
  //           min: 0,
  //           max: 5,
  //           arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
  //         },
  //       ]
  //     },
  //     {
  //       label: '标签', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.labelOpened'), children: [
  //         {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.label'), type: 'checkbox'},
  //         {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.labelColor'), type: 'color'},
  //         {
  //           label: '透明度',
  //           value: modelRef(setting, '人影.监控.ryAirspaces.labelOpacity'),
  //           type: 'range',
  //           min: 0,
  //           max: 1,
  //           arr: Array.from({length: 101}, (_, i: number) => i / 100)
  //         },
  //       ]
  //     }
  //   ]
  // },
  {
    label: '气象图层', type: 'folder', children: [
      {label: '红外云图', value: modelRef(setting, '人影.监控.红外云图'), type: 'checkbox'},
      {label: 'CMPAS降水融合3km', value: modelRef(setting, '人影.监控.CMPAS降水融合3km'), type: 'checkbox'},
      {label: '组合反射率', value: modelRef(setting, '人影.监控.组合反射率'), type: 'checkbox'},
      {label: '睿图雷达产品', value: modelRef(setting, '人影.监控.睿图雷达'), type: 'checkbox'},
      {label: '真彩图', value: modelRef(setting, '人影.监控.真彩图'), type: 'checkbox'},
    ]
  },
  {
    label: '基础图层', type: 'folder', children: [
      {label: '航路航线', value: modelRef(setting, '人影.监控.routeLine'), type: 'checkbox'},
      {label: '航路航线颜色', value: modelRef(setting, '人影.监控.routeLineColor'), type: 'color'},
      {label: '规划航线', value: modelRef(setting, '人影.监控.规划航线'), type: 'checkbox'},
      {label: '机场', value: modelRef(setting, '人影.监控.airport'), type: 'checkbox'},
      {label: '作业点', value: modelRef(setting, '人影.监控.zyd'), type: 'checkbox'},
      {
        label: '预警圈范围(km)',
        value: modelRef(setting, '人影.监控.warningCircle'),
        type: 'range',
        min: 20,
        max: 100,
        arr: Array.from({length: 9}, (_, i: number) => 20 + 10 * i)
      },
      // {label: '协同作业点', value: modelRef(setting, '人影.监控.synergyZyd'), type: 'checkbox'},
      {label: '导航台', value: modelRef(setting, '人影.监控.navigationStation'), type: 'checkbox'},
      {label: '糖果图', value: modelRef(setting, '人影.监控.糖果图'), type: 'checkbox'},
    ]
  },
  {
    label: '飞机图层', type: 'folder', children: [
      {label: computed(()=>'二次雷达信号'+sys.planeCount), value: modelRef(setting, '人影.监控.plane'), type: 'checkbox'},
      ...((user.strUnitID.startsWith('99')||user.strUnitID.endsWith('0000000'))?[{label: '仅显示人影飞机', value: modelRef(setting, '人影.监控.ryPlane'), type: 'checkbox'}]:[]),
      {label: '显示航迹圈', value: modelRef(setting, '人影.监控.显示航迹圈'), type: 'checkbox'},
      {label: '速度矢量线', value: modelRef(setting, '人影.监控.速度矢量线'), type: 'checkbox'},
      {label: 'ADS-B信号', value: modelRef(setting, '人影.监控.adsb'), type: 'checkbox'},
      {label: '飞机标牌', value: modelRef(setting, '人影.监控.planeLabel'), type: 'checkbox'},
      {label: '航迹', value: modelRef(setting, '人影.监控.track'), type: 'checkbox'},
      {
        label: '航迹数量',
        value: modelRef(setting, '人影.监控.trackCount'),
        type: 'range',
        min: 0,
        max: 3000,
        arr: Array.from({length: 3001}, (_, i: number) => i)
      },
    ]
  },
  {
    label: '固定图层',
    type: 'folder',
    opened: modelRef(setting, '人影.监控.fixedLayerOpened'),
    children: [{
        label: '铁路',
        value: modelRef(setting, '铁路'),
        type: 'checkbox'
    }, {
        label: '九段线',
        value: modelRef(setting, '九段线'),
        type: 'checkbox'
    }, {
        label: '国境线',
        value: modelRef(setting, '国境线'),
        type: 'checkbox'
    }, {
        label: '岛屿',
        value: modelRef(setting, '岛屿'),
        type: 'checkbox'
    }, {
        label: '河流',
        value: modelRef(setting, '河流'),
        type: 'checkbox'
    }, {
        label: '海岸线',
        value: modelRef(setting, '海岸线'),
        type: 'checkbox'
    }, {
        label: '省界',
        value: modelRef(setting, '省界'),
        type: 'checkbox'
    }, {
        label: '县界',
        value: modelRef(setting, '县界'),
        type: 'checkbox'
    }, {
        label: '地标点',
        value: modelRef(setting, '地标点'),
        type: 'checkbox'
    }, {
        label: '导航台',
        value: modelRef(setting, '人影.监控.navigationStation'),
        type: 'checkbox'
    }, {
        label: '机场',
        value: modelRef(setting, '人影.监控.airport'),
        type: 'checkbox'
    }, {
        label: '机场管制区',
        value: modelRef(setting, '机场管制区'),
        type: 'checkbox'
    }, {
        label: '省名',
        value: modelRef(setting, '省名'),
        type: 'checkbox'
    }, {
        label: '人影飞行区域',
        value: computed({
            get() {
                return setting.人影.监控.ryAirspaces.base
            },
            set(val) {
                setting.人影.监控.ryAirspaces.fill = val
                setting.人影.监控.ryAirspaces.base = val
                setting.人影.监控.ryAirspaces.line = val
                setting.人影.监控.ryAirspaces.label = val
            }
        }),
        type: 'checkbox'
    }, {
        label: '危险区',
        value: modelRef(setting, '危险区'),
        type: 'checkbox'
    }, {
        label: '禁区',
        value: modelRef(setting, '禁区'),
        type: 'checkbox'
    }, {
        label: '限制区',
        value: modelRef(setting, '限制区'),
        type: 'checkbox'
    }, {
        label: '飞行管制分区',
        value: modelRef(setting, '飞行管制分区'),
        type: 'checkbox'
    }, {
        label: '飞行管制区',
        value: modelRef(setting, '飞行管制区'),
        type: 'checkbox'
    }, {
        label: '航线',
        value: modelRef(setting, '人影.监控.routeLine'),
        type: 'checkbox'
    }, {
        label: '障碍物',
        value: modelRef(setting, '障碍物'),
        type: 'checkbox'
    },]
  },
  {
    label: '临时图层',
    type: 'folder',
    opened: modelRef(setting, '人影.监控.tempLayerOpened'),
    children: [
      {
        label: '添加图层', type: 'button', click() {
          alert('开发中')
        }
      },
    ]
  },
  {
    label: '系统信息', type: 'folder', opened: modelRef(setting, '人影.监控.systemInfoOpened'), children: [
      {label: '在线人数', value: modelRef(sys, '在线人数'), type: 'text'},
      {label: '网络状态', value: modelRef(sys, '网络状态'), type: 'text'},
      {label: '内存占用', value: modelRef(sys, '内存占用'), type: 'text'},
      {
        label: '当前经度',
        value:computed(()=>mapStatus.currentPos[0].toFixed(6).padStart(11,' ')),
        type:'text'
      },
      {
        label: '当前纬度',
        value:computed(()=>mapStatus.currentPos[1].toFixed(6).padStart(11,' ')),
        type:'text'
      },
      {
        label: '位置',
        value: computed(() => {
          if(mapStatus.经纬度){
            return mapStatus.经纬度.substring(0, 10) + '\r\n0' + mapStatus.经纬度.substring(10, 20)
          }else{
            return '000000000E\r\n000000000N'
          }
        }),
        type: 'text'
      },
      {label: '中心经度', value: computed(()=>mapStatus.center[0].toFixed(6).padStart(11,' ')), type: 'text'},
      {label: '中心纬度', value: computed(()=>mapStatus.center[1].toFixed(6).padStart(11,' ')), type: 'text'},
      {label: '缩放等级', value: computed(()=>mapStatus.zoom.toFixed(6).padStart(11,' ')), type: 'text'},
      {label: '帧率', value: computed(()=>sys.fps), type: 'text'},
      {label: '帧率曲线',value:{
        fps: {
          value: computed(()=>sys.fps),
          min: 0,
          max: 200,
          strokeStyle: "white",
        },
      },type:'curve'},
    ]
  },
  // {label:'自动站',value:toRefs(setting.人影.监控).zdz,type:'checkbox'},
  // {label:'网格点',value:toRefs(setting.人影.监控).gridPoint,type:'checkbox'},
  // {label:'网格值',value:toRefs(setting.人影.监控).gridValue,type:'checkbox'},
  // {label:'等值线',value:toRefs(setting.人影.监控).isolines,type:'checkbox'},
  // {label:'等值带',value:toRefs(setting.人影.监控).isobands,type:'checkbox'},
  {
    label: '重置系统', type: 'button', click() {
      setting.$reset()
      mapStatus.$reset()
      resetTheme()
      window.location.reload()
    }
  },
  {
    label: '全国行政区划', type: 'button', click() {
      setting.显示全国行政区划配置 = true
    }
  },
  // {
  //   label: '烟炉控制', type: 'button', click() {
  //     setting.显示烟炉 = true
  //   }
  // },
  // {
  //   label: '火箭架配置', type: 'button', click() {
  //     setting.火箭架配置 = true
  //   }
  // },
  {
    label: '批复率统计', type: 'button', click() {
      setting.批复率统计 = true
    }
  },
  {
    label: '网络信息', type: 'button', click() {
      setting.网络信息 = true
    }
  },
  // {
  //   label: '飞行活动', type: 'button', click() {
  //     setting.飞行活动 = true
  //   }
  // },
  // {
  //   label: '电子围栏', type: 'button', click() {
  //     setting.电子围栏 = true
  //   }
  // },
  // {
  //   label: '无人机空域', type: 'button', click() {
  //     setting.无人机空域 = true
  //   }
  // },
  // {
  //   label: '弹药概况', type: 'button', click() {
  //     setting.弹药概况 = true
  //   }
  // },
  {
    label: '放大', type: 'button', click() {
      setting.zoomIn()
    }
  },
  {
    label: '缩小', type: 'button', click() {
      setting.zoomOut()
    }
  }
]}])
</script>
<style lang="scss" scoped>
    $btn-icon-size: .28rem;
    $arrow-size: .12rem;
    
    .tool-btns {
        position: absolute;
        right: $page-padding;
        top: $page-padding;
        display: flex;
        gap: $grid-2;
        .map-tool-btn {
            position: relative;
            
            &.active {
                //伪元素画小三角
                &::before {
                    content: "";
                    display: block;
                    width: 0;
                    height: 0;
                    border-left: calc($arrow-size / 2) solid transparent;
                    border-right: calc($arrow-size / 2) solid transparent;
                    border-bottom: $arrow-size solid var(--el-border-color);
                    position: absolute;
                    left: .12rem;
                    bottom: - $grid-3 - .02rem;
                    z-index: 101;
                }
                
                &::after {
                    content: "";
                    display: block;
                    width: 0;
                    height: 0;
                    border-left: calc((#{$arrow-size} - .02rem) / 2) solid transparent;
                    border-right: calc((#{$arrow-size} - .02rem) / 2) solid transparent;
                    border-bottom: calc(#{$arrow-size} - .02rem) solid var(--el-bg-color-opacity-8);
                    position: absolute;
                    left: .13rem;
                    bottom: - $grid-3 - .02rem;
                    z-index: 102;
                }
            }
        }
        
    }
    .side-box {
        pointer-events: none;
        position: absolute;
        //bottom: 16px;
        --top: calc(#{$page-padding} + .4rem + #{$grid-3});
        top:var(--top);
        max-height: calc(100% - var(--top) - 58px);
        box-sizing: border-box;
        right: $page-padding;
        display: flex;
    }
    
    .control-scrollbar{
        position: absolute;
        height:auto;
        pointer-events: none;
        z-index: 102;
        &.bottom-right{
          top:10px;
          right:10px;
          bottom:10px;
          &::v-deep(.el-scrollbar__wrap){
            display: flex;
            flex-direction: column;
            // border:1px solid red;
            box-sizing: border-box;
            .el-scrollbar__view{
                // border:1px solid #0f0;
                flex:1;
                display: flex;
                flex-flow: column-reverse;
            }
          }
        }
        &.top-left{
          left:10px;
          top:10px;
          bottom:10px;
          &::v-deep(.el-scrollbar__wrap){
            display: flex;
            flex-direction: column;
            // border:1px solid red;
            box-sizing: border-box;
            .el-scrollbar__view{
                // border:1px solid #0f0;
                flex:1;
                display: flex;
                flex-flow: column;
            }
          }
        }
    }
</style>