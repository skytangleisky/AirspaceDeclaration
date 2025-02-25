

<template>
  <div id="map"></div>
</template>

<script setup name="RgyxWorkPoint">
defineOptions({ name: "RgyxWorkPoint" });
import { onMounted } from "vue";
import "ol/ol.css";
import { Tile as TileLayer } from "ol/layer";
import XYZ from "ol/source/XYZ";
import { fromLonLat } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import { Map, View } from "ol";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import CircleStyle from "ol/style/Circle";
import workPointList from "../assets/json/workPointList.json";

let map = null;
onMounted(() => {
  initMap();
  for (let i = 0, len = workPointList.length; i < len; i++) {
    let point = [workPointList[i].lon, workPointList[i].lat];
    addWorkPoint(point);
  }
});

function addWorkPoint(point) {
  const marker = new Feature({
    geometry: new Point(fromLonLat(point)),
  });

  marker.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 10,
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.5)",
        }),
        stroke: new Stroke({
          color: "rgba(0, 0, 0, 0.8)",
          width: 2,
        }),
      }),
    })
  );

  const vectorLayer = new VectorLayer({
    source: new VectorSource({
      features: [marker],
    }),
  });

  map.addLayer(vectorLayer);
}

function initMap() {
  map = new Map({
    target: "map",
    view: new View({
      center: fromLonLat([110, 28]),
      zoom: 4,
      projection: "EPSG:3857",
    }),
    layers: [],
    controls: defaultControls({
      zoom: true,
      attribution: false,
      rotate: false,
    }),
  });

  let baseUrl = "http://t{0-7}.tianditu.com/DataServer?x={x}&y={y}&l={z}";

  // let url1 = `${baseUrl}&T=vec_c&tk=7f10e5bac8074b0640be5195096c86c7`;
  // let url1 = `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png`;
  // const source = new XYZ({
  //   url: url1,
  //   projection: "EPSG:3857",
  // });
  // const tdtLayer = new TileLayer({
  //   source: source,
  // });
  // map.addLayer(tdtLayer);

  // let url2 = `${baseUrl}&T=cia_c&tk=7f10e5bac8074b0640be5195096c86c7`;
  let url2 = `https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png`;
  const sourceCVA = new XYZ({
    url: url2,
    projection: "EPSG:3857",
  });
  const tdtcvaLayer = new TileLayer({
    source: sourceCVA,
  });
  map.addLayer(tdtcvaLayer);
}
</script>
<style scoped>
#map {
  position: absolute;
  inset: 0;
}
</style>
