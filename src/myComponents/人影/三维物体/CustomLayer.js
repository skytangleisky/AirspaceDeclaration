/*GLB,GLTF格式支持*/
import './three.min.js'
import './GLTFLoader.js'
import glbUrl from './airplane.glb?url'
import mapboxgl from 'mapbox-gl';
// const modelOrigin = [148.9819, -35.39847];//澳大利亚天文台
const modelOrigin = [103.94399181722866, 30.562962069460042];//成都
const modelAltitude = 492;
const modelRotate = [Math.PI / 2, Math.PI/180*65, 0];

const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
modelOrigin,
modelAltitude
);
const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    //  Since the 3D model is in real world meters, a scale transform needs to be applied since the CustomLayerInterface expects units in MercatorCoordinates.
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()*0.025
};
export default class CustomLayer{
    constructor(){
        this.id = 'null-island'
        this.type = 'custom'
        this.renderingMode = '3d'
    }
    onAdd(map, gl) {
        this.clock = new THREE.Clock();
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        // create two three.js lights to illuminate the model
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        const loader = new THREE.GLTFLoader();
        // let resource = location.origin+'/resources/34M_17.gltf'
        // let resource = location.origin+'/resources/CesiumDrone.glb'
        loader.load(glbUrl,(gltf) => {
            const scene = gltf.scene;
            scene.scale.set(1, 1, 1);
            this.scene.add(scene);
            const animations = gltf.animations;
            this.mixer = new THREE.AnimationMixer(scene);
            animations.forEach((clip) => {
                const action = this.mixer.clipAction(clip);
                action.play();
            });
        })
        this.map = map;

        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });

        this.renderer.autoClear = false;
    }
    render(gl, matrix) {

    // console.log('海拔高度',this.map.queryTerrainElevation([103.94399181722866, 30.562962069460042],{ exact: false }))
        const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0),modelTransform.rotateX);
        const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0),modelTransform.rotateY);
        const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1),modelTransform.rotateZ);

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4().makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
        )
        .scale(
            new THREE.Vector3(modelTransform.scale,-modelTransform.scale,modelTransform.scale)
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta()); // 更新动画
        }
    }
}