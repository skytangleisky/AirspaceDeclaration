<template>
  <div>
    <div class="tool-btns">
      <div :class="`btn-box ${setting.人影.监控.是否显示分布面板?'active':''}`" @click="distributionButtonClick"><div class="distributionClass"></div><div class="triangleClass"></div></div>
      <div :class="`btn-box ${setting.人影.监控.是否显示产品面板?'active':''}`" @click="productsButtonClick"><div class="productsClass"></div><div class="triangleClass"></div></div>
      <div :class="`btn-box ${setting.人影.监控.是否显示工具面板?'active':''}`" @click="toolkitButtonClick"><div class="toolClass"></div><div class="triangleClass"></div></div>
      <div class="btn-box disabled"><div class="favoritesClass"></div><div class="triangleClass"></div></div>
    </div>
    <div class="side-box">
      <div class="side-box-left">
        <side-buttons></side-buttons>
      </div>
      <el-scrollbar v-if="showPanel">
        <MenuPanel></MenuPanel>
      </el-scrollbar>
    </div>
    <!-- <el-scrollbar v-if="setting.人影.监控.是否显示工具面板" style="position: absolute;top:80px;right:10px;bottom:10px;height:auto">
      <control-pane style="position:relative" :list="list" theme="default"></control-pane>
    </el-scrollbar> -->
    <div style="position: absolute;pointer-events: auto;right:0;bottom:0;margin:10px;width:fit-content;box-sizing: border-box;height:fit-content;max-height:calc(100% - 20px);overflow: auto;">
      <control-pane style="position:relative" :list="list" theme="default"></control-pane>
    </div>
  </div>
</template>
<script lang="ts" setup>
import sideButtons from './sideButtons.vue'
import MenuPanel from './menuPanel.vue'
import {reactive,computed,defineAsyncComponent,watch} from 'vue'
import {useSettingStore} from '~/stores/setting'
import toolkitSvg from '~/assets/toolkit.svg?raw'
import {getMask} from '~/api/天工'
import {resetTheme} from '~/theme'
const ControlPane = defineAsyncComponent(() => import("~/myComponents/controlPane/index.vue"));
const setting = useSettingStore()
const distributionButtonClick = (e: any) => {
  setting.人影.监控.是否显示分布面板 = !setting.人影.监控.是否显示分布面板
  setting.人影.监控.是否显示产品面板 = false
  setting.人影.监控.是否显示工具面板 = false
  setting.devtoolsOpen = false
}
const productsButtonClick = (e: any) => {
  setting.人影.监控.是否显示分布面板 = false
  setting.人影.监控.是否显示产品面板 = !setting.人影.监控.是否显示产品面板
  setting.人影.监控.是否显示工具面板 = false
  setting.devtoolsOpen = false
}
const toolkitButtonClick = (e: any) => {
  setting.人影.监控.是否显示分布面板 = false
  setting.人影.监控.是否显示产品面板 = false
  setting.人影.监控.是否显示工具面板 = !setting.人影.监控.是否显示工具面板
  setting.devtoolsOpen = false
}
const showPanel = computed(()=>{
  return setting.人影.监控.是否显示分布面板 || setting.人影.监控.是否显示产品面板 || setting.人影.监控.是否显示工具面板
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
const mask = getMask()
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
  {label: '红外云图', value: modelRef(setting, '人影.监控.红外云图'), type: 'checkbox'},
  {label: 'CMPAS降水融合3km', value: modelRef(setting, '人影.监控.CMPAS降水融合3km'), type: 'checkbox'},
  {label: '组合反射率', value: modelRef(setting, '人影.监控.组合反射率'), type: 'checkbox'},
  {label: '睿图雷达产品', value: modelRef(setting, '人影.监控.睿图雷达'), type: 'checkbox'},
  {label: '真彩图', value: modelRef(setting, '人影.监控.真彩图'), type: 'checkbox'},
  {label: '航路航线', value: modelRef(setting, '人影.监控.routeLine'), type: 'checkbox'},
  {label: '规划航线', value: modelRef(setting, '人影.监控.规划航线'), type: 'checkbox'},
  {label: '机场', value: modelRef(setting, '人影.监控.airport'), type: 'checkbox'},
  {label: '作业点', value: modelRef(setting, '人影.监控.zyd'), type: 'checkbox'},
  {label: '协同作业点', value: modelRef(setting, '人影.监控.synergyZyd'), type: 'checkbox'},
  {label: '导航台', value: modelRef(setting, '人影.监控.navigationStation'), type: 'checkbox'},
  ...(mask=='%%'?[{label: '二次雷达信号', value: modelRef(setting, '人影.监控.plane'), type: 'checkbox'},{label: 'ADS-B信号', value: modelRef(setting, '人影.监控.adsb'), type: 'checkbox'},
  {label: '飞机标牌', value: modelRef(setting, '人影.监控.planeLabel'), type: 'checkbox'},
  {label: '航迹', value: modelRef(setting, '人影.监控.track'), type: 'checkbox'},
  {
    label: '航迹数量',
    value: modelRef(setting, '人影.监控.trackCount'),
    type: 'range',
    min: 0,
    max: 3000,
    arr: Array.from({length: 3001}, (_, i: number) => i)
  }]:[]),
  {
    label: '位置',
    value: computed(() => {
      if(setting.人影.监控.经纬度){
        return setting.人影.监控.经纬度.substring(0, 10) + '\r\n0' + setting.人影.监控.经纬度.substring(10, 20)
      }else{
        return '000000000E\r\n000000000N'
      }
    }),
    type: 'text'
  },

  {
    label: '系统信息', type: 'folder', opened: modelRef(setting, '人影.监控.systemInfoOpened'), children: [
      {label: '在线人数', value: modelRef(setting, '在线人数'), type: 'text'},
      {label: '网络状态', value: modelRef(setting, '网络状态'), type: 'text'},
      {label: '内存占用', value: modelRef(setting, '内存占用'), type: 'text'},
      {label: '中心经度', value: computed(()=>setting.人影.监控.center[0]), type: 'text'},
      {label: '中心纬度', value: computed(()=>setting.人影.监控.center[1]), type: 'text'},
      {label: '缩放等级', value: computed(()=>setting.人影.监控.zoom), type: 'text'},
      {label: '帧率', value: computed(()=>setting.人影.监控.fps), type: 'text'},
      {label: '帧率曲线',value:{
        fps: {
          value: computed(()=>setting.人影.监控.fps),
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
      resetTheme()
    }
  },
  {
    label: '全国行政区划', type: 'button', click() {
      setting.显示全国行政区划配置 = true
    }
  },
  {
    label: '烟炉控制', type: 'button', click() {
      setting.显示烟炉 = true
    }
  },
  {
    label: '火箭架配置', type: 'button', click() {
      setting.火箭架配置 = true
    }
  },
  {
    label: '弹药概况', type: 'button', click() {
      setting.弹药概况 = true
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
  }
]}])
</script>
<style lang="scss" scoped>
.side-box{
  pointer-events: none;
  position:absolute;
  right:0;
  top:calc(31px + 40px + 10px);bottom:16px;right:18px;height:fit-content;width:fit-content;
  display: flex;
}
.tool-btns {
  position: absolute;
  right: 18px;
  top: 31px;
  display: flex;
  .btn-box {
    position:relative;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left:$grid-2;
    width: 40px;
    height: 40px;
    color: #c1c1c1;
    border-radius: 5px;
    background-color: #eaf1ff;
    border: 0.01rem solid var(--el-border-color);
    cursor:pointer;
    &.active{
      background:#fff;
      .triangleClass {
        display: block;
      }
    }
    .distributionClass{
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAndJREFUWEftVr9rE2EYft5EB8H/IN9ld1B0Eiq0FXTp0IASewFBJ9cWh+YSBFuw5stS28HBrRYkXyoOLUpBFNuCRkQQEfwDvEsHOzjoYkvvlWuTmlzu+t0l1S698b3ne57ne3/dEQ75oUPWx5GBrjKQlevpJG1fBtN1ImwAtAGXf4DxolIUtThljWUg+/D7ycTP33MEuhomQoSn7jbmq0XxPIqRyAbMe3UDx3gewKCemLdcTgwtFFKvdNhIBrLTdiqxScsEnNYRtrxfB7kZlU9/3O9MJAMj0i4TaDyGeBP6QVnifE8GclP2GU7SewAnOoiYJwGsAHQOhOlAIcIllRevQ3tGdytTOlMAigHiF1XBWGmNm9LhAL4HyhK3uzdQdh6BcauNgLGkCiLjJ81Je5xB5bY4oabyoq97A9J5BuBKuwGeVAVjwk9qluxBEL3xx5UlQntN24SmdDxC/+gtK0sMBRiYANFdXzwQ28ToDZTrw2BeDGrA1iyE3R4cnK3IBjygKetfAT7VWUd6CXZrjSkYDqozA2erlvjcdQ/sGCjZQanVDRAQ0qytB7Ul8MC734DNdzE3IVy4AwtWeq2nRdQ8nLvv3OAE5vTX3kUQMFuxxJgOHykDTRKz5CyCEFhr3+zb2KIL6k7KPlAD1+S3/gQSqzpSBo9VLWNWh2tkKgrsLyYnnRkGRsO7mtYqVmogKmusEuxMhPdfcJzfgmEEihBlVD619M8MeMQj0h4l0EyHCOGxyoubUcW7KsHeVMj6KoP798QYv5LEfU8s48t/MWD6V7Rm5fa0CcMONzak13Cf9vvmH8giipPWONjYUxCHPAr2yMChZ+APmHzOIV5Te7wAAAAASUVORK5CYII=);
      width:32px;
      height:32px;
      background-size:100% 100%;
      background-repeat: no-repeat;
    }
    .productsClass{
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA+lJREFUWEe1l19oHFUUxr8zqUgtFUGwkrkT8yqioBIUW8Q+2NIKImp3Z1sq2kpVCkVLde4kIA3iZjax1n+ISrWoNHO3qYIPxhYsBius9kV9ENGAoDObWvomWKFm58jM7qybdDZztyT3aWbvd873m3PP3rlDWOZheyGDUAPjW2bUVhmoHXNE2M2GltkfCcCiwaDxqjSdLK8VAAjeAuhmBt9BoOtSUwZ+IaaScs3vO0GWHSBNvqtyYe1F/vtWoG8vQNvbpsyjyrUOpvcrBtD5lMXK3MPE0Sfpb8YqY3DyQP/v8f2yA9hjwSQTneljmp10zS87QTr6Y0ZJsTEToPTy+XXApXXzqzE7td/6p9cmXdCERL5yzHb57UpYBsNtGpPjS3N8QQVKE8Ft3KAfE1OmUeWa7bXSBcn6Fygp2j62Vz8F8KY4Xx/BWgBge+EZABvaZmS8pJz+F3XNU11xLNgDwh4C3dkq8+u+FM/G1yVvbgMjin3AjEIHWTAB0IEMs7KSYqRXiFhve+FXAO5LzaqumNrmzQ30IUoaEMDhBMAuhzth4KNuJgTyfGkma7d47Jz484Z/o2iAgQEDGGjw/M9XXbOmdmzf9X8VyvX1hsHfJFUgnvAd64UmWP0cwDfGO2YTYCz8DIQHl3rKzt3M9sJXAawHcAuANYvjGDxelZazoxKKBiNoVoCnq671QKsyNQB3J2Bb3pi9+tqLqy8QsDa/zPSKkubzyVpWwuPM2JYVQ4Rp3xGJWd6gQjnYahj0eZ6wY/6wkmJ/DkRbk5eXSl54iIEkoe4g4P+uzqgEAU/7Uryrk486O1UnINUQ6E1fmvsyK8G8UbnWjE6+KwZoNhberrpib6uxpgA8Gl9fasz3fzoyeG7FARIDwjvKEc/El0UvPEHAkJLiJh3zJPxKl2CBAeE95Yin0uXwHVHQBih54QkGHtEN6K7j95W0nuw1D5Uq9SeY+YNeA7P0DBytSrGrl1yUbKWN+fO9BC2pZXyoXPG4br7mVuyF0wC26Abl6ggfK0c8lqtLT0R2pb4bzEd0AvQ1PKmktSNP334dl7z6SQZvzgvoZZ4A5UtRWiqmDVDw/thswDjZiwGAGWKqM/FDWW/FVq7jSopit7yLTkTBEYB260Aw8ENVitubPRScBWioWxyDt1al9UXW/GWnYttLPiyS7TVvUIR7GBzBIAVgsCtAhOeqw+I1LYBYVPQCSaCxPACteaKDyjFHtZagU2R7wXaA4rfdXVpGl4tOI+IRNWx9p9WE3UQtkHhjuV8PhH8ioqO+Iw7p6LW/jIrjc5vA0RAx3Zue61sGvwF0mhB9HUV0tjosftUxTjX/AQEme8tlW1W4AAAAAElFTkSuQmCC);
      width:29px;
      height:29px;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .toolClass{
      position: relative;
      width:32px;
      height:32px;
      background-size:100% 100%;
      background-repeat: no-repeat;
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAdtJREFUWEftlr9Lw1AQx+/SikMnQQdNCy0IgnXTQTddFBcHQZuCboJLRyGtCNalP3TTScRNbdTBQScXu7jpIKjo1EJbC/4J2uYkrYHan++lkVZpphDu7vu573u59xBa/GCL9eFvAkjh1GQt55SAI87jKpcDC6Fsn0XIv9cTIKD7U79jjBWCC6DQOeKNJoIEV+UiiMI4Ac0A0RSrE4YAagnogE0DSNH0PhBMA4CT1UqGuCQgXCuyfbU0tsIBKZwKAuImQ0FjIURbSsAR1JN/AEjhhBOwK2GsMkcWfbqUgCupZZQBFDcZRyljoSWbtAPQhg4A1ByzhQUXBAJVLYKXvvPthrg+qLgGEZ8GW7SxJSBhXgkMXEiRNOkyit+O3u2Ml1Q6aSjd9F+AuKLI4qEUyTwCkBsBL2N+cc4TTfmQcO/3AQCfFL844g2+9VJ33qdPNimS1mZI/T2k0TXtQLHFuKrixtm6eOsNpSdIwAPNjYbdmwjApFU1yCQHOgD/0IGlaGYoR/RivDW2TIvV4j5e63+uuA9oHzyR1B0CjrKV4o9ChPOYbF+seiP6BpgFgF0EHOQvXz+j2pW96mG0vPNg+8j1DCOgzSwIqyBkj2Txtbxee52GZnXLU6flDnwBwAvsIT+rrzoAAAAASUVORK5CYII=);
    }
    .favoritesClass{
      width:29px;
      height:29px;
      background-size:100% 100%;
      background-repeat: no-repeat;
      background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAhNJREFUWEftlzFoE1Ecxr/vXVNXEUFqLtjBxQhOVVxdCi6Cg+nVSRw6C4q5TNZBkjoo2sVJQdBcEFQcXBx0cNHo2OggtHCJIOLYoaXeJ0mMpMHmcpdeWsSbjuP//77f+97j3XvEDj/cYX+0AGZKjWeE9kaCET5bKWvx0ZWJWqS+nmI6RX8e5LU4IgTulF37UpzeTs9QAJJeEqiGAhgjBMGm6SbNj7KbXhwKINQ4pEBCrhtgleJzIfgyrHDffsMJCHOtGul6F4Cqnps5kaj5b3GnVH8A4EIPAN54rn1qJACdhb85gVFY93j8B/g3EhDuyWCVwuXIq2gbEnjnufbJ9v+kfptAtG15WADy53Q5f+hVE8ApLk+CqeVIKcQD4BKpmgLVvEJmvtuw+WOjYVZiFtDRUJioAM29u1Kwn4QKt6bEPw3gLsHDW9ZHBTAyU48LBz8OAtCaloX6dwj7tw0A4JI1ZnJhh5DZG98OyNp4CGi6L2zUBNpi/SHO3fL3WWt8DeJYaFLxAABxI1vJT376m8HMwsoRamywY1pMgHXPtff0G51Tqq8BGE8oAX3w3MzxjrhTbFxsvnuF9P0/30p+FeBUQgBYkYKcZI0b6iqIM+3TDV4E4k3D9QaQegsinRRAqO7ABTHXwMD6oYW7BODrWTB4GkqbQAENz7evZkV/juRsAh5b78Lg+4qbzu+Oy+koR97r9Qu1GxEUrW28KwAAAABJRU5ErkJggg==);
    }
    .triangleClass{
      position: absolute;
      left:50%;
      transform: translateX(-50%);
      pointer-events: none;
      bottom:-20px;
      width: 25px;
      height: 28px;
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAchJREFUWEftlL1rFEEchp93QSUYbUWsBCsjHCkUnfMDO1FiRPCYJKWWagTFVi2FWBiwTBPEm6QJkSikEiW3pxYS4ldh7T9gDKSQ/cmeF41wxt3z9BB2qoWZed9nn90Z0eWhLvdTABQGCgP/t4HwwkqRUOWAFtu9T/7IQIhtBpB3OvPPAap1Oy1jNi2O4GzFKYXJPdo2EGJ7BfQ3G5e8Uyl3e6qvnU2hZpcQ48CnbwLoTYxrw2XdyZuXG2D6ifUmW/gIbJcYRWyyhDFgeSVh1/nDWs4DkRsg1G0M4yrw1jvtS8tCbB+APQb3hpwu/jWABwvWF0W8aRYMeKe5BkDdRjDup8/JF0rDR7WUFSKXganYZgzSIzfvnU6sLwmxPQOOYDz2ZZ3qOMDUcztpCY8axy6ir3JQ734CqNl+xMvGvBisHNLDLBCZDYTYXgPpN5/wThdahYfYpoFzwHvvtLdjANWaXZa4mwbu2EnP8d1abRU+OW9bN2/jc3Puindq7Nlo/NJAtWY31zZKXAd6zLjVKiyKsCT5cadI3ABWzbi9tn6orO956zM2BJA49rs3yDJvxtPcAFmCO7Em80/YibJWGQVAYaAw0HUDXwFq2IEhfOfa3gAAAABJRU5ErkJggg==);
      background-size: 100% 100%;
      display: none;
    }
  }
  .btn-box.disabled{
    opacity: 0.5;
  }
  .btn-box.active {
    border-color: var(--el-color-primary);
  }
}
.dark .tool-btns{
  .btn-box{
    background:#243349;
    .distributionClass{
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAxZJREFUWEfFl0toFEEQhqs6L49Bb2rwEEHEi5EESeL2Q4mBKNEEzEEvPsCbIuQggpL4AEGCIngRFD0oghKD8SRu6OmJLgiCIkQ8xIuKOQii4sJumHRJQxbiZmd6diM416r665uuv5oZhP/8YNr+uVxu9fz8/B7G2DYi2g4ALQCwHhG/EtEcEb0hopdNTU2TXV1d39PqpgIwxhxCxDNEtMUnjIgzRHRZCHHfl+viXoAwDB8S0YE0YktzEPER53zIV5cIYIwhn4AvLoRI7BEbNMaMAcCwr4Ev7juJigBu5gBwzyeeNm6tPa+UGq2UvwzAuT2KojCN4dICuE0BgHbO+Vx5zTIAY8wxALjlES8AwLi1draurm4DAHT4gIloWEp5NQ3ATQA4Hgfg1gwAhjjn70s5WutmxpgGgK1xdUT0QkqZSQOQA4DOGKFfhUJhbW9vb75SPAxDTUQyDiKfz6/q6+sr/rWu5cnGmM/uhqtoGM9uT09Pn7TWXo8DqK+v39jd3f3RBxC7+0ludqJaa7k4iooM1lqllAoSAYIg+ICIm2JO4C7n/EjcGxpjjgLA7bi4tbZFKfXFdwJPAKA/BmBmYWFhh1LqR4wHkq7tn0KIZq8JwzC8RkSnEtbwrRCirTyutR5ljI0k1L0WQnR4AbTW+xljE0n3ACIGiDgRRdE7RNyMiO0A4I4/9mGMXcpkMue8AC7Bt05JjWJiv621bUqp2VQAWuvDjLE7NTSqWIKINzjnJyr6KsHRjwFgYKUQiOj2vn/pzZm4BaXg1NRUa0NDwzMial0JBBENSiljPZX4sRAEwQAiupOo6fFdXE7U+0mWYr3i4CaEEIM+ci+AEzDGVOUHN/disbizp6fn0z8ByOVy66IoMlX4YZ8QYtLXPNUISiJa672Msac+UUQc4Zxf8OWV4qlGUEo2xpwFgIsJ4qnmnmoNE+6HcQBYZq7Ffe/knH9L+/ZVjaAkms1m1zQ2Nr4q9wMR7ZZSPq+meU0ArigMw11ElC01I6LTUsor1TavGWBxNd1PyxgiPuCcH6yl+YoAam1YXvcHmiE9MLSgCk8AAAAASUVORK5CYII=);
      width:26px;
      height:26px;
      background-size:100% 100%;
      background-repeat: no-repeat;
    }
    .productsClass{
      background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA71JREFUWEe1V12IHEUQ/mr3OOGOgE9GRM+8iiioBI/bbFXPgQYjiPgTiaL4hz8EREU9JSA5hCgXYxRFVNSgQgxJfPDBVcGw2z133JkX9UEkBgRREfFNDny57ZJeZpa5dXenVzcNy85Mf1XfN1XV3TWEMQ9rrQJYVdW17H81SZJfB9HQmPmRCdjkloiWmHmhH9e5EPAGgMsAXA3g/JxUVc8Q0R4R+aYoZOwCcufLy8tb2u32FQD2Argzf+69X0ySZH9+f84EFN/SWnsLgE/yZxMTE9tqtdrP4X7sAlqt1lEAabVaPVuv17/qERIKFETUYuakr4C1tbWt6+vrW6emps7Ozc39PWqRFouQiD5m5m74nXMHVPW54FNVF4wxS5si4Jy7UlW/y0gXRaSbq1gh/VaBiHR5rLVfArg++PPeX9IrIFXVHd0CIXqBmZ+PJc9x1tqHAITfNdmz10Tk8XDdbDZ3VCqVNIvC7qKygwCe6iVT1QPGmH2jigh451xTVU1OZow5kabpjPe+U4CqergjoNVq3U1EHw4heUlEOrnrHSsrKxeo6ky73Z4hohkAP0xOTq7Ozs7+5ZyrqepyVngHmfmZcG2t/R3AhWGn7Aiw1n4K4KZhb1nczZxzr6hqDcDlAKb7RG3JGLPQbDYvrlQqv2TzDRG5MeNbBTDbEdZoNM6bnp7+E8CWsjAT0cvM/HQW3uOqevsAmy5ZqU9r7S4An5UB8/mQN2PMk8NEENFhZu5gygY55w6pahS44Kxb1c65fpF4RETeLiPvpKBYqTEGOYaIXmfmx/pFwnufJEnSivH3nwVkzt8UkXDYhJV0gohuyyr+ImYOlV46/q+AQPCWiDyaVfdJItrOzJeWMmeAcQgIrt4RkYfzdDDz7lEEnFTVW2MNhuDeE5EHR/VDaZre571/f1TDfnhVPWKMuX8UXxS20o2NjT9GMSrBfiAi98b6y7fiBoAbYo3KcET0ETPfU4brrJiseh8A8G6MwQiYoyJyVxm+eBx/AWBnmcEo86p6zBizZ5hNV4BzbqeqBhHRI/R2qvobgJv7nYqZo+Micscgp5s6ImttSENIR8z4VkSuylJ4GsD2QUaqussY83m/+X91xdba8GHR2V7LhqrOee99tVo9BmDbILz3/okkSV6NEpC90bMAXiwTEDm/X0QWo1JQBFlrQzsdTrtrI4l6Yafa7fa++fn5r6OKcBAoExI2lutihKjq90R0REQOxeCjv4ystaGXD4XGeV8fCIjoJwCnQhNMRKfr9fqPMcQ55h96/aI3ImMDoAAAAABJRU5ErkJggg==);
      width:26px;
      height:26px;
      background-size:100% 100%;
      background-repeat: no-repeat;
    }
    .toolClass{
      position: relative;
      background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAdFJREFUWEftlr9rFFEQx78zcFyR1vQnCEJilxQGjvfuNYY0KSwEeyFN/oSAyb+QVCK2NhYW2pzN2/fu0iWdiqlMF8j/cDOywYXL/dp9m5VTyVbLMjPf7/vsMPMIS35oyfr4Nw1473vzyDnnshSqSQRijKuqel0icG6t3axqIslAfnJm9gDOReTzpAgzPwWwLSKuKolaBuYJFAbvbCCE8AbAMwCdqigrxF0C+GKt3RuPnSLgvT9k5tcVCtYKEZEj59xhkXzLgPe+w8w/a1VOSBKRh865nMjtOTDWZAnl0kPHe2SSQNHl6VUTMu4NLCQAYO6YzSkzs4rIza8bf0/4A3loVgyqpEGUKFIpvFYTqurzXq/3MYSghYq1lgaDwUsReV+m3EQTvrLWvosxflXVdQCfrLW7McZ9VT354waI6Jsx5on3/gGA/WKyxRi9qi7sodxcEwRARPnePzDGnGZZtsXMb3/TKAPQjIFSlQUBjRC4N/B/EhgOh49Ho9GPu5yuSi4RrRtjvk/dB/IPIYQzABtVCtWJIaIPxpgXM29EN1siy3YAHBPRozoCJTlTV/aZy6jf76+02+01VV1pykSr1brqdrsXk/X+rm3Y1GlT6iydwC9J1QIwQShSFwAAAABJRU5ErkJggg==);
      width:26px;
      height:26px;
      background-size:100% 100%;
      background-repeat: no-repeat;
      border:1px soldi red;
    }
    .favoritesClass{
      background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAVBJREFUWEftl91xwjAQhNedQCXhKgFXkrgSSCVHJziVJKxy9tiBsXQSyDMZ7sUvkvbT6f7cYGVrVtZHo6obAO8A+PVaKyK9d9N0PQE+DCDnnE5EuD/bSgF4+89M9TOAvhQgU3vc1v4FOAH4Kj01sv8NwM7WdFOAXkS2TxYPx6vq8er+A4AZAG/f1QAAQAB6YQZQSXsm8wL4Hx4IBcWi2htHxR4YU1dVLxn9pBiAzYjpy9xmWqnTBdkAQVRE2qmgNTZWOnbWlO7qAuA788Z886iZR1hwlkBcABTdpvZ/mzMYF0vmBqAXJAZh4kO5fSgAD4tC6DUYJh3v4QAWf/djIdH1A5T7CcJGEVkcZh01IQtgNjdYtBNqzI4aT8DBZZimh+mGABxSz6r6Hc3T3wVZHkg8O2nZCyB4gMMhi8Ya1oV0Moh9ZQJmU7v+z2nlW9/I/QALgbkWzqLbRgAAAABJRU5ErkJggg==);
      width:26px;
      height:26px;
      background-size:100% 100%;
      background-repeat: no-repeat;
    }
  }
}

</style>