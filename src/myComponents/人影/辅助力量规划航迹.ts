import { vi } from "element-plus/es/locale";

export function 辅助力量规划航迹(map,规划航线数据,setting,wgs84togcj02){
  const polygonsFeatues = {
    type: "FeatureCollection",
    features: new Array<any>([
      // {
      //   'type': 'Feature',
      //   'properties': { 'name': '区域A' },
      //   'geometry': {
      //     'type': 'Polygon',
      //     'coordinates': [[
      //       [116.2, 40.0],
      //       [116.6, 40.0],
      //       [116.6, 39.8],
      //       [116.2, 39.8],
      //       [116.2, 40.0]
      //     ]]
      //   }
      // }
    ])
  }

  map.addSource('standby_polygons', {
    'type': 'geojson',
    'data': polygonsFeatues
  });

  // 填充多边形
  map.addLayer({
    'id': 'standby_polygon-fill',
    'type': 'fill',
    'source': 'standby_polygons',
    'layout': {
      visibility:setting.人影.监控.规划航线&&setting.人影.监控.西北?'visible':'none'
    },
    'paint': {
      'fill-color': 'rgb(155,155,253)',
      'fill-opacity': 0.5
    },
    filter: ['in', ['get', 'tag'], ['get', 'tags']]
  });

  // 添加边框
  // map.addLayer({
  //   'id': 'polygon-outline',
  //   'type': 'line',
  //   'source': 'polygons',
  //   'layout': {},
  //   'paint': {
  //     'line-color': '#fff',
  //     'line-width': 1
  //   }
  //   filter: ['in', ['get', 'tag'], ['get', 'tags']]
  // });





  const 机场去重 = new Map()
  let airportsFeatures:any = {
      type: "FeatureCollection",
      features: new Array(),
    };
  map.addSource("军用机场数据standby", {
    type: "geojson",
    data: airportsFeatures,
  });
  map.addLayer({
    id: "军用机场图层standby",
    type: "symbol",
    source: "军用机场数据standby",
    layout: {
      "icon-image": [
        'match',
        ['get', 'armyType'],
        '民用', 'MYJC',
        'JYJC'// fallback
      ],
      // "icon-size": {
      //   base: 1,
      //   stops: [
      //     [0, 0.5],
      //     [22, 1],
      //   ],
      // },
      "icon-size": 0.3,
      "icon-rotate": ["get", "deg"],
      "icon-rotation-alignment": "map",
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,
      visibility:setting.人影.监控.规划航线&&setting.人影.监控.西北?'visible':'none',
      "text-pitch-alignment": "map",
      "text-field": ["get", "name"],
      "text-font": ["simkai"],
      "text-size": 14,
      "text-transform": "uppercase",
      // "text-letter-spacing": 0.05,
      "text-anchor": "left",
      "text-line-height": 1,
      "text-justify": "left",
      "text-offset": [1, 0],
      "text-ignore-placement": true,
      "text-allow-overlap": true,
      "text-rotation-alignment": "map",
      "text-max-width": 400,
    },
    paint: {
      "icon-opacity": 1,
      "text-color": "white",
      "text-halo-color": "black",
      "text-halo-width": 1,
    },
    filter: ['in', ['get', 'tag'], ['get', 'tags']]
  });




  for(let i=0;i<规划航线数据[0].flyCasesList.length;i++){

    const worklineData = {
      type: 'Feature',
      properties:{
        tag:'all', tags:['西南主力量','all']
      },
      geometry: {
        type: 'LineString',
        coordinates: new Array<[number,number]>()
      }
    }

    const arriveData = {
      type: 'Feature',
      properties:{
        tag:'all', tags:['西南主力量','all']
      },
      geometry: {
        type: 'LineString',
        coordinates: new Array<[number,number]>()
      }
    }
    const leaveData = {
      type: 'Feature',
      properties:{
        tag:'all', tags:['西南主力量','all']
      },
      geometry: {
        type: 'LineString',
        coordinates: new Array<[number,number]>()
      }
    }

    map.addLayer({
      id: 'standby_arrive-layer'+i,
      type: 'line',
      source: {
        type: 'geojson',
        data: arriveData
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': 'rgb(228, 208, 10)',
        'line-width': 1
      },
      filter: ['in', ['get', 'tag'], ['get', 'tags']]
    });
    map.addLayer({
      id: 'standby_leave-layer'+i,
      type: 'line',
      source: {
        type: 'geojson',
        data: arriveData
      },
      layout: {
        visibility:setting.人影.监控.规划航线&&setting.人影.监控.西南?'visible':'none',
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#5555ff',
        'line-width': 1
      },
      filter: ['in', ['get', 'tag'], ['get', 'tags']]
    });

    map.addLayer({
      id: 'standby_workline-layer'+i,
      type: 'line',
      source: {
        type: 'geojson',
        data: worklineData
      },
      layout: {
        visibility:setting.人影.监控.规划航线&&setting.人影.监控.西南?'visible':'none',
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#ff0000',
        'line-width': 2
      },
      filter: ['in', ['get', 'tag'], ['get', 'tags']]
    });

    const trajectoryInfo = 规划航线数据[0].flyCasesList[i].trajectoryInfo
    for(let k=0;k<trajectoryInfo.length;k++){
      const item = trajectoryInfo[k]
      if(item.chjzljyl>0){
        worklineData.geometry.coordinates.push(wgs84togcj02(item.longitude,item.latitude))
      }
    }
    for(let k=0;k<trajectoryInfo.length;k++){
      const item = trajectoryInfo[k]
      arriveData.geometry.coordinates.push(wgs84togcj02(item.longitude,item.latitude))
      if(item.chjzljyl>0)break;
    }
    for(let k=trajectoryInfo.length-1;k>=0;k--){
      const item = trajectoryInfo[k]
      leaveData.geometry.coordinates.push(wgs84togcj02(item.longitude,item.latitude))
      if(item.chjzljyl>0)break;
    }







    map.getSource('standby_arrive-layer'+i).setData(arriveData)
    map.getSource('standby_workline-layer'+i).setData(worklineData)
    map.getSource('standby_leave-layer'+i).setData(leaveData)
  }


  const obj = {
    "type": "FeatureCollection",
    "features": new Array()
    // [
    //   {
    //     "type": "Feature",
    //     "geometry": {
    //       "type": "Point",
    //       "coordinates": [116.3913, 39.9075]
    //     },
    //     "properties": {
    //       "label": "北京"
    //     }
    //   },
    // ]
  }
  const set = new Set()//防止重复绘制
  for(let i=0;i<规划航线数据[0].flyCasesList.length;i++){
    const feature = {
      'type': 'Feature',
      'properties': { 'name': '区域', tag:'all', tags:['西南主力量','all']},
      'geometry': {
        'type': 'Polygon',
        'coordinates': [[
          [116.7, 39.95],
          [117.0, 39.95],
          [117.0, 39.75],
          [116.7, 39.75],
          [116.7, 39.95]
        ]]
      }
    }
    if(规划航线数据[0].flyCasesList[i].nodeInfo){
      const O = 规划航线数据[0].flyCasesList[i].nodeInfo[0]
      const A = 规划航线数据[0].flyCasesList[i].nodeInfo[1]
      const B = 规划航线数据[0].flyCasesList[i].nodeInfo[2]
      const C = 规划航线数据[0].flyCasesList[i].nodeInfo[3]
      const D = 规划航线数据[0].flyCasesList[i].nodeInfo[4]
      机场去重.set(O.name,O);
      if(O.routeName=='无人机'){
        [A,B,C,D].forEach(item=>{
          obj.features.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": wgs84togcj02(item.longitude,item.latitude)
            },
            "properties": {
              tag:'all',
              tags:['西南主力量','all'],
              "label": item.name
            }
          })
        })
        feature.geometry.coordinates = [[
          [A.longitude, A.latitude],
          [B.longitude, B.latitude],
          [C.longitude, C.latitude],
          [D.longitude, D.latitude],
          [A.longitude, A.latitude]
        ]]
      }else{
        [A,B,C,D].forEach(item=>{
          obj.features.push({
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": wgs84togcj02(item.longitude,item.latitude)
            },
            "properties": {
              tag:'all',
              tags:['西南主力量','all'],
              "label": item.name
            }
          })
        })
        feature.geometry.coordinates = [[
          [A.longitude, A.latitude],
          [C.longitude, C.latitude],
          [B.longitude, B.latitude],
          [D.longitude, D.latitude],
          [A.longitude, A.latitude]
        ]]
      }
    }
    const workInfo = 规划航线数据[0].flyCasesList[i].workInfo
    if(workInfo){
      if(!set.has(workInfo.routeName)){
        polygonsFeatues.features.push(feature)
      }
      set.add(workInfo.routeName)
      obj.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": wgs84togcj02(Number(workInfo.longitude),Number(workInfo.latitude))
        },
        "properties": {
          tag:'all',
          tags:['西南主力量','all'],
          "label": workInfo.routeName
        }
      })
    }
  }
  map.getSource('standby_polygons').setData(polygonsFeatues)

  map.addLayer({
    id: 'text-layer2',
    type: 'symbol',
    source: {
      type:'geojson',
      data:obj
    },
    layout: {
      visibility:setting.人影.监控.规划航线&&setting.人影.监控.西北?'visible':'none',
      'text-field': ['get', 'label'], // 从属性中获取文字
      'text-size': 20,
      'text-offset': [0, 0],
      'text-anchor': 'center',
      'text-font': ['simkai']
    },
    paint: {
      'text-color': '#f00'
    },
    filter: ['in', ['get', 'tag'], ['get', 'tags']]
  });



  for(let item of 机场去重.values()){
    airportsFeatures.features.push({
      type: "Feature",
      properties: {
        name: item.name,
        // code: 机场名称.data[i].位置,
        armyType:item.armyType,
        deg: 0,
        tag:'all',
        tags:['西南主力量','all']
      },
      geometry: {
        type: "Point",
        coordinates: wgs84togcj02(item.longitude,item.latitude),
        // coordinates: [0, 0],
      },
    });
  }
  // map.getSource('军用机场数据standby').setData(airportsFeatures)
}
