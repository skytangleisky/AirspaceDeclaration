<template>
  <div ref="cesiumContainerRef" class="cesiumContainer"></div>
  <ControlPane class="absolute left-20px top-20px" :list="list" :theme="isDark?'default':'retro'"></ControlPane>
</template>
<script setup lang="ts">
  import * as Cesium from 'cesium';
  import ControlPane from '~/myComponents/controlPane/index.vue';
  import { onMounted,ref,reactive, onBeforeUnmount,watch,toRefs } from 'vue';
  import { FPSTool } from '~/tools/index';
  import { useCesiumStore } from '~/stores/cesium';
  import { getFeather } from '~/tools';
  import { isDark } from "~/theme"
  import {calculateFireArea} from '~/tools';
  const cesiumStore = useCesiumStore();
  const fpsTool = new FPSTool();
  const fps = ref('0.00');
  const cesiumContainerRef = ref();
  let viewer:any;
  let imageryProviderViewModels = [
    new Cesium.ProviderViewModel({
      name: '高德地图',
      iconUrl: 'https://webst01.is.autonavi.com/appmaptile?style=6&x=0&y=0&z=0',
      tooltip: '高德地图',
      creationFunction: () => new Cesium.UrlTemplateImageryProvider({
        url: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      }),
    }),
    new Cesium.ProviderViewModel({
      name: '谷歌地图',
      iconUrl: 'http://127.0.0.1:3143?x=0&y=0&z=0', // 可以自定义图标
      tooltip: '谷歌地图',
      creationFunction: () => new Cesium.UrlTemplateImageryProvider({
        url: 'http://127.0.0.1:3143?x={x}&y={y}&z={z}',
      }),
    })
  ]
  onMounted(()=>{
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(115, 25, 125, 35);
    const viewer = new Cesium.Viewer(cesiumContainerRef.value,{
      navigationInstructionsInitiallyVisible:false,
      imageryProviderViewModels,
      selectedImageryProviderViewModel:imageryProviderViewModels[0],
      creditContainer:document.createElement("div"),
      msaaSamples:4,
      sceneMode: cesiumStore.sceneMode,
    })
    // viewer.scene.globe.depthTestAgainstTerrain = true
    // viewer.scene.camera.setView({
    //   destination: position,
    //   orientation: {
    //     heading: Cesium.Math.toRadians(0.0), // 方向
    //     pitch: Cesium.Math.toRadians(-90.0), // 俯仰角
    //     roll: 0.0 // 滚动角
    //   }
    // });
    // viewer.imageryLayers.addImageryProvider(gaodeImageryProvider)
    viewer.sceneModePicker.viewModel.morphTo3D.afterExecute.addEventListener(() => {
      cesiumStore.sceneMode = Cesium.SceneMode.SCENE3D;
    });
    viewer.sceneModePicker.viewModel.morphTo2D.afterExecute.addEventListener(() => {
      cesiumStore.sceneMode = Cesium.SceneMode.SCENE2D;
    });
    viewer.sceneModePicker.viewModel.morphToColumbusView.afterExecute.addEventListener(() => {
      cesiumStore.sceneMode = Cesium.SceneMode.COLUMBUS_VIEW;
    });

    const imageryLayer = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
      url: '/kysq/texture.webp',
      rectangle: Cesium.Rectangle.fromDegrees(120, 30, 130, 40), // 设置图片的覆盖区域
      tileHeight:0,
      tileWidth:0,
    }));
    const billboardCollection = new Cesium.BillboardCollection({scene: viewer.scene});
    viewer.scene.primitives.add(billboardCollection);
    for(let i=0;i<1000;i++){
      // 设置中心为左下角
      const width = 16; // Billboard 宽度
      const height = 32; // Billboard 高度
      const angle = Cesium.Math.toRadians(45); // 旋转角度
      // 将Billboard的中心对齐到左下角
      const offsetX = -width / 2;
      const offsetY = -height / 2;
      // 旋转矩阵，绕左下角旋转
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);
      // 新的坐标
      const rotatedX = offsetX * cosAngle - offsetY * sinAngle;
      const rotatedY = offsetX * sinAngle + offsetY * cosAngle;
      const position = Cesium.Cartesian3.fromDegrees(120*Math.random(), 30*Math.random(), 0);

      let feather = getFeather(Math.random()*60)
      billboardCollection.add({
        position,
        image: `/kysq/feathers/${feather}.svg`,
        // image: '/气象预警图标/暴雪-红.svg',
        width,
        height,
        alignedAxis: Cesium.Cartesian3.ZERO,
        heightReference: Cesium.HeightReference.NONE,
        rotation: angle,
        verticalOrigin:Cesium.VerticalOrigin.CENTER,
        horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
        pixelOffset:feather==0?new Cesium.Cartesian2(0,0):new Cesium.Cartesian2(-rotatedX, rotatedY),
      })
    }
    viewer.scene.postRender.addEventListener(()=>{
      fpsTool.measure(performance.now(),(frameRate:number)=>{
        fps.value = frameRate.toFixed(2)
      })
    })
    watch(()=>cesiumStore.timeline,(val)=>{
      (viewer.timeline.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
      (viewer.animation.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
      (viewer.fullscreenButton.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
    },{immediate:true})
    watch(()=>cesiumStore.geocoder,(val)=>{
      (viewer.geocoder.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true})
    watch(()=>cesiumStore.homeButton,(val)=>{
      ((viewer.homeButton.container as HTMLDivElement).querySelector('.cesium-home-button') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true})
    watch(()=>cesiumStore.sceneModePicker,(val)=>{
      switch(viewer.scene.mode){
        case Cesium.SceneMode.SCENE2D:
          ((viewer.sceneModePicker.container as HTMLDivElement).querySelector('.cesium-sceneModePicker-button2D') as HTMLDivElement).style.visibility = val? 'visible' : 'collapse'
          break;
        case Cesium.SceneMode.SCENE3D:
          ((viewer.sceneModePicker.container as HTMLDivElement).querySelector('.cesium-sceneModePicker-button3D') as HTMLDivElement).style.visibility = val? 'visible' : 'collapse'
          break;
        case Cesium.SceneMode.COLUMBUS_VIEW:
          ((viewer.sceneModePicker.container as HTMLDivElement).querySelector('.cesium-sceneModePicker-buttonColumbusView') as HTMLDivElement).style.visibility = val? 'visible' : 'collapse'
          break;
      }
    },{immediate:true})
    watch(()=>cesiumStore.baseLayerPicker,(val)=>{
      (viewer.baseLayerPicker.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true})
    watch(()=>cesiumStore.navigationHelpButton,(val)=>{
      ((viewer.navigationHelpButton.container as HTMLDivElement).querySelector('.cesium-navigationHelpButton-wrapper') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true})





    let points = calculateFireArea([116.39, 39.9], 10000, 40, 360, 36).flatMap((item)=>item)

    const geometry = new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(points.flatMap((item)=>item))
      ),
      perPositionHeight: false, // ⭐ 关键
    });

    const instance = new Cesium.GeometryInstance({
      geometry: geometry,
      attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(
          Cesium.Color.RED.withAlpha(0.2)
        ),
      },
    });
    viewer.scene.primitives.add(
      new Cesium.GroundPrimitive({
        geometryInstances: instance,
        appearance: new Cesium.PerInstanceColorAppearance({
          translucent: true,
          closed: true,
        }),
      })
    );
    viewer.scene.primitives.add(
      new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
          geometry: new Cesium.GroundPolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArray(points),
            width: 1,
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.RED.withAlpha(1)
            ),
          },
        }),
        appearance: new Cesium.PolylineColorAppearance(),
      })
    );
    let warningWall = calculateFireArea([116.39, 39.9], 20000, 0, 360, 36).flatMap((item)=>item)
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(warningWall),
        width: 2,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.RED,
          dashLength: 8,     // ⭐ 虚线长度
          gapColor: Cesium.Color.TRANSPARENT,
        }),
      },
    });
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(116.4, 39.9),
      label: {
        text: "这是中文标牌",
        font: "14px Menlo‌",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        // horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        // verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(0, -10),
      },
    });
  })
  onBeforeUnmount(()=>{
    viewer && viewer.destroy()
  })
  const list = reactive([{label:'devtools',type:'folder',opened:true,children:[
    {
      label:'FPS',type:'curve',value:{
        fps:{
          value:fps,
          min:0,
          max:200,
          strokeStyle:'#fff'
        }
      }
    },
    {label:'timeline',value:toRefs(cesiumStore).timeline,type:'checkbox'},
    {label:'geocoder',value:toRefs(cesiumStore).geocoder,type:'checkbox'},
    {label:'homeButton',value:toRefs(cesiumStore).homeButton,type:'checkbox'},
    {label:'sceneModePicker',value:toRefs(cesiumStore).sceneModePicker,type:'checkbox'},
    {label:'baseLayerPicker',value:toRefs(cesiumStore).baseLayerPicker,type:'checkbox'},
    {label:'navigationHelpButton',value:toRefs(cesiumStore).navigationHelpButton,type:'checkbox'},
  ]}])
</script>
<style scoped lang="scss">
  .cesiumContainer{
    position: absolute;
    inset: 0;
  }
</style>