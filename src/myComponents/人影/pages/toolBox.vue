<template>
  <div class="tool-btns">
    <div class="btn-box" @click="toolkitButtonClick">
      <el-icon v-html="toolkitSvg" style="font-size:26px;"></el-icon>
    </div>
  </div>
  <el-scrollbar v-if="setting.人影.监控.是否显示工具箱"
                style="position:absolute;top:calc( 38px + 40px + 16px);bottom:16px;right:18px;height:auto;width:fit-content;pointer-events: none;">
    <control-pane style="position: relative;pointer-events: auto;" :list="list" theme="default"></control-pane>
  </el-scrollbar>
</template>
<script lang="ts" setup>
import {reactive,computed,defineAsyncComponent} from 'vue'
import {useSettingStore} from '~/stores/setting'
import toolkitSvg from '~/assets/toolkit.svg?raw'
const ControlPane = defineAsyncComponent(() => import("~/myComponents/controlPane/index.vue"));
const setting = useSettingStore()
const toolkitButtonClick = (e: any) => {
  setting.人影.监控.是否显示工具箱 = !setting.人影.监控.是否显示工具箱
  if (setting.人影.监控.是否显示工具箱) {
    e.currentTarget.classList.add('active')
  } else {
    e.currentTarget.classList.remove('active')
  }
  console.log(e.currentTarget)
}
import {useTheme} from '~/theme';
import {modelRef} from '~/tools'

const theme = useTheme()
const list = reactive([
  {
    label: '工具箱', type: 'folder', opened: modelRef(setting, 'devtoolsOpen'), children: [
      {
        label: '主题',
        value: theme,
        type: 'select',
        options: [{value: 'light', label: '亮色'}, {value: 'dark', label: '暗色'}, {value: 'auto', label: '自动'}]
      },
      {label: '菜单', value: modelRef(setting, 'menus'), type: 'checkbox'},
      // {label:'色相',value:toRefs(setting).hueRotate,type:'range',min:0,max:360,step:1,arr:Array.from({length:361},(_,i:number)=>i)},
      {label: '瓦片地图', value: modelRef(setting, '人影.监控.loadmap'), type: 'checkbox'},
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
      {
        label: '北京行政区划', type: 'folder', opened: modelRef(setting, '人影.监控.beijingOptionsOpened'), children: [
          {
            label: '填充',
            type: 'folder',
            opened: modelRef(setting, '人影.监控.beijingOptions.districtOpened'),
            children: [
              {label: '显示', value: modelRef(setting, '人影.监控.beijingOptions.district'), type: 'checkbox'},
              {label: '颜色', value: modelRef(setting, '人影.监控.beijingOptions.districtFillColor'), type: 'color'},
              {
                label: '透明度',
                value: modelRef(setting, '人影.监控.beijingOptions.districtFillOpacity'),
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
            opened: modelRef(setting, '人影.监控.beijingOptions.districtBaseOpened'),
            children: [
              {label: '显示', value: modelRef(setting, '人影.监控.beijingOptions.districtBase'), type: 'checkbox'},
              {label: '颜色', value: modelRef(setting, '人影.监控.beijingOptions.districtBaseColor'), type: 'color'},
              {
                label: '透明度',
                value: modelRef(setting, '人影.监控.beijingOptions.districtBaseOpacity'),
                type: 'range',
                min: 0,
                max: 1,
                arr: Array.from({length: 101}, (_, i: number) => i / 100)
              },
              {
                label: '宽度',
                value: modelRef(setting, '人影.监控.beijingOptions.districtBaseWidth'),
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
            opened: modelRef(setting, '人影.监控.beijingOptions.districtLineOpened'),
            children: [
              {label: '显示', value: modelRef(setting, '人影.监控.beijingOptions.districtLine'), type: 'checkbox'},
              {label: '颜色', value: modelRef(setting, '人影.监控.beijingOptions.districtLineColor'), type: 'color'},
              {
                label: '透明度',
                value: modelRef(setting, '人影.监控.beijingOptions.districtLineOpacity'),
                type: 'range',
                min: 0,
                max: 1,
                arr: Array.from({length: 101}, (_, i: number) => i / 100)
              },
              {
                label: '宽度',
                value: modelRef(setting, '人影.监控.beijingOptions.districtLineWidth'),
                type: 'range',
                min: 0,
                max: 5,
                arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
              },
            ]
          },
        ]
      },
      {
        label: '华北飞行区域', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspacesOpened'), children: [
          {
            label: '填充', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.fillOpened'), children: [
              {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.fill'), type: 'checkbox'},
              {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.fillColor'), type: 'color'},
              {
                label: '透明度',
                value: modelRef(setting, '人影.监控.ryAirspaces.fillOpacity'),
                type: 'range',
                min: 0,
                max: 1,
                arr: Array.from({length: 101}, (_, i: number) => i / 100)
              },
            ]
          },
          {
            label: '底线', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.baseOpened'), children: [
              {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.base'), type: 'checkbox'},
              {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.baseColor'), type: 'color'},
              {
                label: '透明度',
                value: modelRef(setting, '人影.监控.ryAirspaces.baseOpacity'),
                type: 'range',
                min: 0,
                max: 1,
                arr: Array.from({length: 101}, (_, i: number) => i / 100)
              },
              {
                label: '宽度',
                value: modelRef(setting, '人影.监控.ryAirspaces.baseWidth'),
                type: 'range',
                min: 0,
                max: 5,
                arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
              },
            ]
          },
          {
            label: '界线', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.lineOpened'), children: [
              {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.line'), type: 'checkbox'},
              {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.lineColor'), type: 'color'},
              {
                label: '透明度',
                value: modelRef(setting, '人影.监控.ryAirspaces.lineOpacity'),
                type: 'range',
                min: 0,
                max: 1,
                arr: Array.from({length: 101}, (_, i: number) => i / 100)
              },
              {
                label: '宽度',
                value: modelRef(setting, '人影.监控.ryAirspaces.lineWidth'),
                type: 'range',
                min: 0,
                max: 5,
                arr: Array.from({length: 101}, (_, i: number) => 5 * i / 100)
              },
            ]
          },
          {
            label: '标签', type: 'folder', opened: modelRef(setting, '人影.监控.ryAirspaces.labelOpened'), children: [
              {label: '显示', value: modelRef(setting, '人影.监控.ryAirspaces.label'), type: 'checkbox'},
              {label: '颜色', value: modelRef(setting, '人影.监控.ryAirspaces.labelColor'), type: 'color'},
              {
                label: '透明度',
                value: modelRef(setting, '人影.监控.ryAirspaces.labelOpacity'),
                type: 'range',
                min: 0,
                max: 1,
                arr: Array.from({length: 101}, (_, i: number) => i / 100)
              },
            ]
          }
        ]
      },
      {label: '航路航线', value: modelRef(setting, '人影.监控.routeLine'), type: 'checkbox'},
      {label: '机场', value: modelRef(setting, '人影.监控.airport'), type: 'checkbox'},
      {label: '作业点', value: modelRef(setting, '人影.监控.zyd'), type: 'checkbox'},
      {label: '导航台', value: modelRef(setting, '人影.监控.navigationStation'), type: 'checkbox'},
      {label: '二次雷达信号', value: modelRef(setting, '人影.监控.plane'), type: 'checkbox'},
      {label: 'ADS-B信号', value: modelRef(setting, '人影.监控.adsb'), type: 'checkbox'},
      {label: '飞机标牌', value: modelRef(setting, '人影.监控.planeLabel'), type: 'checkbox'},
      {label: '航迹', value: modelRef(setting, '人影.监控.track'), type: 'checkbox'},
      {
        label: '航迹数量',
        value: modelRef(setting, '人影.监控.trackCount'),
        type: 'range',
        min: 0,
        max: 99,
        arr: Array.from({length: 101}, (_, i: number) => i)
      },
      {
        label: '位置',
        value: computed(() => setting.人影.监控.经纬度.substring(0, 10) + '\r\n0' + setting.人影.监控.经纬度.substring(10, 20)),
        type: 'text'
      },

      {
        label: '系统信息', type: 'folder', opened: modelRef(setting, '人影.监控.systemInfoOpened'), children: [
          {label: '在线人数', value: modelRef(setting, '在线人数'), type: 'text'},
          {label: '网络状态', value: modelRef(setting, '网络状态'), type: 'text'},
          {label: '内存占用', value: modelRef(setting, '内存占用'), type: 'text'},
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
        }
      },
      {
        label: '放大', type: 'button', click() {
          setting.zoomIn()
        }
      },
      {
        label: '缩小', type: 'button', click() {
          setting.zoomOut()
        }
      },
      {
        label: '测距', type: 'button', click: () => {
          setting.测距()
        }
      },
      {
        label: '获取经纬度', type: 'button', click() {
          setting.经纬度()
        }
      },
      {
        label: '批量操作', type: 'button', click() {
          setting.批量操作()
        }
      },
    ]
  },
]);

</script>
<style lang="scss" scoped>
.tool-btns {
  position: absolute;
  right: 18px;
  top: 38px;
  display: flex;


  .btn-box {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left:$grid-2;
    width: 40px;
    height: 40px;
    color: #c1c1c1;
    border-radius: $border-radius-1;
    background-color: var(--el-bg-color-opacity-8);
    border: 0.01rem solid var(--el-border-color);

  }

  .btn-box.active {
    border-color: var(--el-color-primary);
  }
}

</style>