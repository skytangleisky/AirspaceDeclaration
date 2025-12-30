/*GLB,GLTF格式支持*/
import './three.min.js'
import './GLTFLoader.js'
// import glbUrl from './airplane.glb?url'
import glbUrl from './drone.glb?url'
import mapboxgl from 'mapbox-gl';
// const this.modelOrigin = [148.9819, -35.39847];//澳大利亚天文台
export default class CustomLayer{
    constructor(lng,lat){
        this.id = Math.random().toString(36)
        this.type = 'custom'
        this.renderingMode = '3d'
        this.modelOrigin = [103.94399181722866, 30.562962069460042]
        this.scale = 1
        if(lng!=undefined&&lat!=undefined){
            this.modelOrigin = [lng,lat]
        }
    }
    onAdd(map, gl) {
        this.map = map;
        this.clock = new THREE.Clock();
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        // create two three.js lights to illuminate the model
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        const loader = new THREE.GLTFLoader();
        loader.load(glbUrl,(gltf) => {
            const scene = gltf.scene;
            scene.scale.set(1, 1, 1);
            this.scene.add(scene);
            const animations = gltf.animations;
            this.mixer = new THREE.AnimationMixer(scene);
            // animations.forEach((clip) => {
            //     const action = this.mixer.clipAction(clip);
            //     action.play();
            // });
            const clip = THREE.AnimationClip.findByName(animations, 'hover');
            if (clip) this.mixer.clipAction(clip).play();
        })

        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });

        this.renderer.autoClear = false;
    }
    render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        if(projection && projection.name === 'globe'){
            this.elevation = this.map.queryTerrainElevation(this.modelOrigin);
            let [x,y,z] = new mapboxgl.LngLat(this.modelOrigin[0], this.modelOrigin[1]).toEcef(this.elevation||0);
            const modelRotate = [(90-this.modelOrigin[1])*Math.PI/180,this.modelOrigin[0]*Math.PI/180,0];
            this.modelTransform = {
                translateX: x,
                translateY: y,
                translateZ: z,
                rotateX: modelRotate[0],
                rotateY: modelRotate[1],
                rotateZ: modelRotate[2],
                scale: pixelsPerMeterRatio*24*this.scale
            };
            const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this.modelTransform.rotateX);
            const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.modelTransform.rotateY);
            const qz = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), this.modelTransform.rotateZ);
            const q = qz.multiply(qy).multiply(qx);
            // const rotation = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(x, y, z).normalize(),Math.PI/2);
            const p = new THREE.Matrix4().fromArray(projectionMatrix);
            const g = new THREE.Matrix4().fromArray(globeToMercMatrix);
            const v = new THREE.Matrix4().makeTranslation(
                this.modelTransform.translateX,
                this.modelTransform.translateY,
                this.modelTransform.translateZ
            )
            .scale(
                new THREE.Vector3(this.modelTransform.scale,-this.modelTransform.scale,this.modelTransform.scale)
            )
            .multiply(new THREE.Matrix4().makeRotationFromQuaternion(q))
            this.camera.projectionMatrix = p.multiply(g).multiply(new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(x, y, z).normalize(),-Math.PI*65/180)).multiply(v);
        }else{
            this.elevation = this.map.queryTerrainElevation(this.modelOrigin);
            const modelRotate = [Math.PI / 2, Math.PI/180*65, 0];
            const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
                this.modelOrigin,
                this.elevation||0
            );
            this.modelTransform = {
                translateX: modelAsMercatorCoordinate.x,
                translateY: modelAsMercatorCoordinate.y,
                translateZ: modelAsMercatorCoordinate.z,
                rotateX: modelRotate[0],
                rotateY: modelRotate[1],
                rotateZ: modelRotate[2],
                //  Since the 3D model is in real world meters, a scale transform needs to be applied since the CustomLayerInterface expects units in MercatorCoordinates.
                scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()*100000*this.scale/(2**this.map.getZoom())*2**6
            };
            const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0),this.modelTransform.rotateX);
            const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0),this.modelTransform.rotateY);
            const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1),this.modelTransform.rotateZ);

            const p = new THREE.Matrix4().fromArray(projectionMatrix);
            const v = new THREE.Matrix4().makeTranslation(
                this.modelTransform.translateX,
                this.modelTransform.translateY,
                this.modelTransform.translateZ
            )
            .scale(
                new THREE.Vector3(this.modelTransform.scale,-this.modelTransform.scale,this.modelTransform.scale)
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);
            this.camera.projectionMatrix = p.multiply(v);
        }
        gl.clear(gl.DEPTH_BUFFER_BIT);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta()); // 更新动画
        }
    }
}


export class PointLayer {
    constructor() {
        this.id = 'point-layer';
        this.type = 'custom';
        this.renderingMode = '3d';
        this.modelOrigin = [103.94399181722866, 30.562962069460042]
    }
    onAdd(map, gl) {
        this.map = map
        //顶点着色器
        const vertexSource = `
        uniform mat4 u_projectionMatrix;
        uniform vec3 u_position;
        void main() {
            gl_Position = u_projectionMatrix * vec4(u_position, 1.0);
            gl_PointSize = 20.0;
        }`;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);

        //片元着色器
        const fragmentSource = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, .25);
        }`;
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);

        //着色器程序
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
    }
    render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        let pos = this.modelOrigin, altitude = this.map.queryTerrainElevation(this.modelOrigin);
        if(projection && projection.name === 'globe'){
            const point = new mapboxgl.LngLat(pos[0], pos[1]).toEcef(altitude);
            // gl.disable(gl.DEPTH_TEST);
            // gl.depthMask(false);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.useProgram(this.program);
            const p = new THREE.Matrix4().fromArray(projectionMatrix);
            const g = new THREE.Matrix4().fromArray(globeToMercMatrix);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_projectionMatrix"), false, p.multiply(g).toArray());
            gl.uniform3fv(gl.getUniformLocation(this.program, "u_position"), point);
            gl.drawArrays(gl.POINTS, 0, 1);
        }else{
            const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(pos,altitude);
            // gl.disable(gl.DEPTH_TEST);
            // gl.depthMask(false);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.useProgram(this.program);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_projectionMatrix"), false, projectionMatrix);
            gl.uniform3fv(gl.getUniformLocation(this.program, "u_position"), [modelAsMercatorCoordinate.x,modelAsMercatorCoordinate.y,modelAsMercatorCoordinate.z]);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}
