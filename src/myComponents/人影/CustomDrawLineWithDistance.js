import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';
import {lngLat2XY,XY2LngLat} from '~/myComponents/map/js/core.js'
const DrawLineString = MapboxDraw.modes.draw_line_string;
const DISTANCE_LAYER_ID = 'draw-distance-labels__';
const DISTANCE_SOURCE_ID = 'draw-distance-source__';
export default {
  ...DrawLineString,
  clickAnywhere(state,e){
    DrawLineString.clickAnywhere.call(this,state,e)
  },
  clickOnVertex(state){
    DrawLineString.clickOnVertex.call(this,state)
  },
  onSetup(...args) {
    const state = DrawLineString.onSetup.apply(this, args);
    state.distancePoints = [];
    this.map.on('draw.delete',  (e) =>{
      e.features.forEach((feature) => {
        if (feature.geometry.type === 'LineString') {
          const source = this.map.getSource(DISTANCE_SOURCE_ID)
          if(source){
            source.setData({
              type: 'FeatureCollection',
              features:[]
            })
          }
          // 你可以在这里清除距离显示、UI 或其他关联资源
        }
      });
    });
    return state;
  },

  // onClick(state, e) {
  //   console.log(state)
  //   DrawLineString.onClick.call(this, state, e);
  //   this._updateDistanceLabels(state);
  // },

  onMouseMove(state, e) {
    DrawLineString.onMouseMove.call(this, state, e);
    this._updateDistanceLabels(state, e.lngLat);
  },

  onStop(state) {
    // this._removeDistanceLabels();
    DrawLineString.onStop.call(this, state);
  },
  onTrash(state) {
    this._removeDistanceLabels();
    // DrawLineString.onTrash.call(this, state);
  },

  _updateDistanceLabels(state, cursorLngLat) {
//     let totalLength = 0;
//     for (let i = 1; i < coordinates.length; i++) {
//       const from = coordinates[i - 1];
//       const to = coordinates[i];
//       const line = turf.lineString([from, to]);
//       const segmentLength = turf.length(line, { units: 'kilometers' });
//       totalLength += segmentLength;

//       const mid = turf.midpoint(turf.point(from), turf.point(to));
//       const text = segmentLength < 1
//         ? `${(segmentLength * 1000).toFixed(0)} m`
//         : `${segmentLength.toFixed(2)} km`;
// console.log(mid.geometry)
//       features.push({
//         type: 'Feature',
//         geometry: mid.geometry,
//         properties: {
//           text
//         }
//       });
//     }
    if(state.line.coordinates.length<2)return;
    state.distancePoints.length = 0
    for(let i=1;i<state.line.coordinates.length;i++){
      const from = state.line.coordinates[i-1];
      const to = state.line.coordinates[i];
      // const mid = turf.midpoint(turf.point(from), turf.point(to));
      let pos1 = lngLat2XY(...from)
      let pos2 = lngLat2XY(...to)
      const center = XY2LngLat((pos1.x+pos2.x)/2,(pos1.y+pos2.y)/2)
      const mid = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": [center.lng,center.lat]
        }
      }
      const rotate = pos1.x-pos2.x==0?0:-Math.atan2(pos1.y-pos2.y,pos1.x-pos2.x)*180/Math.PI+180
      const distance = turf.distance(from, to, { units: 'kilometers' }).toFixed(3)+'km';
      state.distancePoints.push({
        'type': 'Feature',
        'geometry': mid.geometry,
        'properties': {
          'text': distance,
          rotate,
        }
      })
    }
    const source = this.map.getSource(DISTANCE_SOURCE_ID)
    if(source){
      source.setData({
        type: 'FeatureCollection',
        features:state.distancePoints
      })
    }else{
      this.map.addSource(DISTANCE_SOURCE_ID, {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features':state.distancePoints
        }
      });
      this.map.addLayer({
        id: DISTANCE_LAYER_ID,
        type: "symbol",
        source: DISTANCE_SOURCE_ID,
        layout: {
          visibility: "visible",
          "text-pitch-alignment": "map",
          "icon-allow-overlap": true,
          "icon-ignore-placement": true,
          "text-field": ["get", "text"],
          "text-font": ["simkai"],
          "text-size": 14,
          // "text-transform": "uppercase",
          // "text-letter-spacing": 0.05,
          "text-anchor": "bottom",
          "text-line-height": 1,
          "text-justify": "center",
          "text-offset": [0, 0],
          "text-ignore-placement": true,
          "text-allow-overlap": true,
          "text-rotation-alignment": "map",
          "text-max-width": 400,
          "text-rotate":['get','rotate']
        },
        paint: {
          "text-opacity": 1,
          "text-color": 'yellow',
          "text-halo-color": "black",
          "text-halo-width": 0.1,
        }
      });
    }
  },

  _removeDistanceLabels() {
    if (this.map.getLayer(DISTANCE_LAYER_ID)) {
      console.log('removeLayer')
      this.map.removeLayer(DISTANCE_LAYER_ID);
    }
    if (this.map.getSource(DISTANCE_SOURCE_ID)) {
      this.map.removeSource(DISTANCE_SOURCE_ID);
    }
  }
};
