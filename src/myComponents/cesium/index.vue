<template>
  <div>
    <ControlPane class="absolute left-20px top-20px" :list="list" :theme="isDark?'default':'retro'" style="pointer-events: auto;"></ControlPane>
  </div>
</template>
<script setup lang="ts">
  import {作业点} from '~/api/天工'
  import huabeiUrl from '~/assets/huabei.json?url'
  import circleUrl from '~/assets/circle.svg?url'
  import triangleUrl from '~/assets/triangle.svg?url'
  import { fromDMS, loadImage } from '~/tools';
  import { useCesiumStore } from '~/stores/cesium';
  const cesiumStore = useCesiumStore();
  let viewer: Cesium.Viewer
  import * as Cesium from 'cesium';
  import ControlPane from '~/myComponents/controlPane/index.vue';
  import { onMounted,ref,reactive, onBeforeUnmount,watch,toRefs } from 'vue';
  import { FPSTool } from '~/tools/index';
  import { getFeather } from '~/tools';
  import { isDark } from "~/theme"
  import {calculateFireArea} from '~/tools';
  import { getImage } from '~/tools/project.js'
  import { 睿图雷达 } from '~/api/天工';
  const fpsTool = new FPSTool();
  const fps = ref('0.00');
  const viewerRef = defineModel<Cesium.Viewer>('viewer')
  const watchList = new Array()
  watch(viewerRef,async()=>{
    const {data} = await 作业点()
    const circleImages:any = await loadImage(circleUrl,16,16,{
      'circle':{
        style:"fill:#2f6ef6;stroke:white;stroke-width:4px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
    })
    const triangleImages:any = await loadImage(triangleUrl,16,16,{
      'triangle':{
        style:"fill:#2f6ef6;stroke:white;stroke-width:4px;stroke-linejoin:round;stroke-linecap:round;image-rendering: crisp-edges;",
      },
    })
    viewer = viewerRef.value as Cesium.Viewer
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#000e24');
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
    const dataSource = await Cesium.GeoJsonDataSource.load(huabeiUrl,{
      stroke: Cesium.Color.HOTPINK,
      fill: Cesium.Color.TRANSPARENT,
      strokeWidth: 1,
    })
    viewer.dataSources.add(dataSource);
    const entities:any = dataSource.entities.values;
    for (const entity of entities) {
      if (entity.polygon) {
        const hierarchy = entity.polygon.hierarchy.getValue();
        entity.polyline = {
          positions: hierarchy.positions,
          width: 3,
          material: Cesium.Color.fromCssColorString('#CD9E46'),
        };

        entity.polygon.outline = false; // 关掉原 outline
      }
    }

    const imagery1 = viewer.imageryLayers.addImageryProvider(
      new Cesium.UrlTemplateImageryProvider({
        url: "/backend/image?x={x}&y={y}&z={z}",
      })
    );
    imagery1.alpha = 0.5;
    // const billboardCollection = new Cesium.BillboardCollection({scene: viewer.scene});
    // viewer.scene.primitives.add(billboardCollection);
    // for(let i=0;i<1000;i++){
    //   // 设置中心为左下角
    //   const width = 16; // Billboard 宽度
    //   const height = 32; // Billboard 高度
    //   const angle = Cesium.Math.toRadians(45); // 旋转角度
    //   // 将Billboard的中心对齐到左下角
    //   const offsetX = -width / 2;
    //   const offsetY = -height / 2;
    //   // 旋转矩阵，绕左下角旋转
    //   const cosAngle = Math.cos(angle);
    //   const sinAngle = Math.sin(angle);
    //   // 新的坐标
    //   const rotatedX = offsetX * cosAngle - offsetY * sinAngle;
    //   const rotatedY = offsetX * sinAngle + offsetY * cosAngle;
    //   const position = Cesium.Cartesian3.fromDegrees(120*Math.random(), 30*Math.random(), 0);

    //   let feather = getFeather(Math.random()*60)
    //   billboardCollection.add({
    //     position,
    //     image: `/kysq/feathers/${feather}.svg`,
    //     // image: '/气象预警图标/暴雪-红.svg',
    //     width,
    //     height,
    //     alignedAxis: Cesium.Cartesian3.ZERO,
    //     heightReference: Cesium.HeightReference.NONE,
    //     rotation: angle,
    //     verticalOrigin:Cesium.VerticalOrigin.CENTER,
    //     horizontalOrigin:Cesium.HorizontalOrigin.CENTER,
    //     pixelOffset:feather==0?new Cesium.Cartesian2(0,0):new Cesium.Cartesian2(-rotatedX, rotatedY),
    //   })
    // }
    viewer.scene.postRender.addEventListener(()=>{
      fpsTool.measure(performance.now(),(frameRate:number)=>{
        fps.value = frameRate.toFixed(2)
      })
    })





    data.results.forEach((item:any)=>{
      let pos = fromDMS(item.strPos)
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(...pos),
        billboard: {
          image: item.iType?triangleImages.triangle:circleImages.circle,
        },
        label: {
          text: item.strName,
          font: "14px Menlo",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
          verticalOrigin: Cesium.VerticalOrigin.CENTER,
          pixelOffset: new Cesium.Cartesian2(0, -20),
          translucencyByDistance: new Cesium.NearFarScalar(
            150000, 1.0,   // 近处：完全不透明
            200000, 0.0   // 远处：完全透明
          )
        },
      });
      if(item.strID.startsWith('110')){
        let points = calculateFireArea(pos, item.iMaxShotRange, item.iShortAngelBegin, item.iShortAngelEnd, 36).flatMap((item)=>item)
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
              Cesium.Color.GRAY.withAlpha(0.4)
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
                  Cesium.Color.fromCssColorString('#82a9f5')
                ),
              },
            }),
            appearance: new Cesium.PolylineColorAppearance(),
          })
        );
        let warningWall = calculateFireArea(pos, 20000, 0, 360, 36).flatMap((item)=>item)
        viewer.entities.add({
          polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(warningWall),
            width: 2,
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.fromCssColorString('#82a9f5'),
              dashLength: 8,     // ⭐ 虚线长度
              gapColor: Cesium.Color.TRANSPARENT,
            }),
          },
        });
      }
    })
    watchList.push(watch(()=>cesiumStore.timeline,(val)=>{
      (viewer.timeline.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
      (viewer.animation.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
      (viewer.fullscreenButton.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse';
    },{immediate:true}))
    watchList.push(watch(()=>cesiumStore.geocoder,(val)=>{
      (viewer.geocoder.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true}))
    watchList.push(watch(()=>cesiumStore.homeButton,(val)=>{
      ((viewer.homeButton.container as HTMLDivElement).querySelector('.cesium-home-button') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true}))
    watchList.push(watch(()=>cesiumStore.sceneModePicker,(val)=>{
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
    },{immediate:true}))
    watchList.push(watch(()=>cesiumStore.baseLayerPicker,(val)=>{
      (viewer.baseLayerPicker.container as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true}))
    watchList.push(watch(()=>cesiumStore.navigationHelpButton,(val)=>{
      ((viewer.navigationHelpButton.container as HTMLDivElement).querySelector('.cesium-navigationHelpButton-wrapper') as HTMLDivElement).style.visibility = val ? 'visible' : 'collapse'
    },{immediate:true}))







    睿图雷达().then(async({data}:any)=>{
      const extent = data.extent.split(',').map(Number)
      const imageUrl = await getImage(data.data,extent)
      const obj = {
        url: imageUrl,
        coordinates: [
          [extent[0], extent[3]],
          [extent[2], extent[3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]],
        ]
      }
      const imageryLayer = viewer.imageryLayers.addImageryProvider(new Cesium.SingleTileImageryProvider({
        url: obj.url,
        rectangle: Cesium.Rectangle.fromDegrees(...extent), // 设置图片的覆盖区域
      }));
      console.log(extent)
      // if(map){
      //   const source = map.getSource(map.getLayer('overlay-layer4').source)
      //   source.updateImage(obj);
      // }
    }).catch(err=>{
      console.log(err)
    })
  })
  onBeforeUnmount(()=>{
    for(let i=0;i<watchList.length;i++){
      const unwatch = watchList.splice(i--,1)[0]
      unwatch()
    }
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