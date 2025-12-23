import mapboxgl from 'mapbox-gl'
import '../三维物体/three.min.js'
/*
export default {
    id:'null-island',
    type:'custom',
    renderingMode:'3d',
    onAdd(map, gl) {
        this.map = map
        const vertexSource2 = `
        precision highp float;
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_globeToMercMatrix;
        void main() {
            gl_Position = u_projectionMatrix * u_globeToMercMatrix * vec4(0.0, 0.0, 1303.7972938088067, 1.0);
            gl_PointSize = 20.0;
        }`;
        const fragmentSource = `
        precision highp float;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;
        const vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader2, vertexSource2);
        gl.compileShader(vertexShader2);
        const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader2, fragmentSource);
        gl.compileShader(fragmentShader2);
        this.program2 = gl.createProgram();
        gl.attachShader(this.program2, vertexShader2);
        gl.attachShader(this.program2, fragmentShader2);
        gl.linkProgram(this.program2);

        const vertexSource = `
        precision highp float;
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_globeToMercMatrix;
        void main() {
            gl_Position = u_projectionMatrix * vec4(0.5, 0.5, 0.0, 1.0);
            gl_PointSize = 20.0;
        }`;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
    },
    render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        if(projection && projection.name === 'globe'){
            gl.useProgram(this.program2);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, "u_projectionMatrix"), false, projectionMatrix);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, "u_globeToMercMatrix"), false, globeToMercMatrix);
            gl.drawArrays(gl.POINTS, 0, 1);
        }else{
            gl.useProgram(this.program);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_projectionMatrix"), false, projectionMatrix);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
        // this.map.triggerRepaint();
    }
}
*/

/*
let animTime = 0
let mapInstance
export default {
    id: 'highlight',
    type: 'custom',
    onAdd: function (map, gl) {
        mapInstance = map
        var vertexSource = `
        precision highp float;
        uniform mat4 u_matrix;
        uniform float  anim;
        attribute vec2 a_pos;
        void main() {
            gl_Position = u_matrix * vec4(a_pos,anim , 1.0);
        }
        `
        var fragmentSource = `
        precision highp float;
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
        }
        `
        var vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        this.aPos = gl.getAttribLocation(this.program, 'a_pos');
        this.unifromAnim = gl.getUniformLocation(this.program, "anim");
        var topLeft = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: -180.00,
            lat: 85
        });
        var topRight = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: 180,
            lat: 85
        });
        var bottomLeft = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: -180.00,
            lat: -85
        });
        var bottomRight = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: 180,
            lat: -85
        });
        this.buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                topLeft.x,
                topLeft.y,
                topRight.x,
                topRight.y,
                bottomLeft.x,
                bottomLeft.y,
                bottomRight.x,
                bottomRight.y,
            ]),
            gl.STATIC_DRAW
        );
        this.texture = gl.createTexture();
        const image = new Image();
        image.src = '/texture.webp'; // 替换为你的图片地址
        image.onload = function () {
            console.log(image)
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //     map.triggerRepaint();
        };
    },
    render: function (gl, matrix) {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(
            gl.getUniformLocation(this.program, 'u_matrix'),
            false,
            matrix
        );
        // animTime += 0.002;
        // animTime = animTime % 0.2;
        gl.uniform1f(this.unifromAnim, animTime);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.enableVertexAttribArray(this.aPos);
        gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        // mapInstance.triggerRepaint();
        return true;
    }
};
*/



function createShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
function createProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}
/*有跳变
export default{
    id: 'custom-image-layer',
    type: 'custom',
    renderingMode: '3d',
    imageLoaded:false,
    images: {texture1:{url:'/kysq/01.png'},texture2:{url:'/kysq/02.png'},texture3:{url:'/kysq/03.png'},texture4:{url:'/kysq/04.png'}},
    onAdd(map, gl){
        // console.log(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE))
        this.map = map
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        // gl.depthMask(true);
        const vertexSource = `
            attribute vec3 a_mercator_pos;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            uniform mat4 u_matrix;
            void main() {
                gl_Position = u_matrix * vec4(a_mercator_pos, 1.0);
                v_texCoord = a_texCoord;
            }
        `;
        const fragmentSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_image;
            uniform int u_shape; //0:点,1:线,2:三角形
            void main() {
                if(u_shape==0){
                    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
                }else if(u_shape==1){
                    gl_FragColor = vec4(1.0,1.0,0.0,1.0);
                }else if(u_shape==2){
                    gl_FragColor = texture2D(u_image, v_texCoord);
                }else{
                    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
                }
            }
        `;
        this.program = createProgram(gl, vertexSource, fragmentSource);
        let delta = 0.03;
        let minLng = 102.0322-delta;
        let maxLng = 102.0322+delta;
        let minLat = 36.52845-delta;
        let maxLat = 36.52845+delta;

        let cenLng = (minLng+maxLng)/2;
        let cenLat = (minLat+maxLat)/2;
        let h = this.map.queryTerrainElevation([cenLng,cenLat])
        let h0 =        h*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h1 =  (h+500)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h2 = (h+1000)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h3 = (h+1500)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h4 = (h+2000)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        var topLeft = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: minLng,
            lat: maxLat
        });
        var topRight = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: maxLng,
            lat: maxLat
        });
        var bottomLeft = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: minLng,
            lat: minLat
        });
        var bottomRight = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: maxLng,
            lat: minLat
        });
        const positions = new Float32Array([
            topLeft.x, topLeft.y,h1,
            topRight.x,topRight.y,h1,
            bottomLeft.x, bottomLeft.y,h1,
            bottomRight.x, bottomRight.y,h1,
            topLeft.x, topLeft.y,h2,
            topRight.x,topRight.y,h2,
            bottomLeft.x, bottomLeft.y,h2,
            bottomRight.x, bottomRight.y,h2,
            topLeft.x, topLeft.y,h3,
            topRight.x,topRight.y,h3,
            bottomLeft.x, bottomLeft.y,h3,
            bottomRight.x, bottomRight.y,h3,
            topLeft.x, topLeft.y,h4,
            topRight.x,topRight.y,h4,
            bottomLeft.x, bottomLeft.y,h4,
            bottomRight.x, bottomRight.y,h4,
//绘制线
            topLeft.x,topLeft.y,h0,
            topRight.x,topRight.y,h0,
            bottomRight.x,bottomRight.y,h0,
            bottomLeft.x,bottomLeft.y,h0,

            topLeft.x,topLeft.y,h4,
            topRight.x,topRight.y,h4,
            bottomRight.x,bottomRight.y,h4,
            bottomLeft.x,bottomLeft.y,h4,

            topLeft.x,topLeft.y,h0,
            topLeft.x,topLeft.y,h4,
            topRight.x,topRight.y,h0,
            topRight.x,topRight.y,h4,
            bottomRight.x,bottomRight.y,h0,
            bottomRight.x,bottomRight.y,h4,
            bottomLeft.x,bottomLeft.y,h0,
            bottomLeft.x,bottomLeft.y,h4,
        ]);

        const globePosition = new Float32Array([
            // 500米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+500),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+500),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+500),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+500),
            // 1000米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+1000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+1000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+1000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+1000),
            // 1500米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+1500),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+1500),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+1500),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+1500),
            // 2000米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+2000),
            //底部四条线，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+0),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+0),
            //顶部四条线，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+2000),
            //侧边四条线，8个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+0),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+2000),
        ]);
        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);


        this.globePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.globePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, globePosition, gl.STATIC_DRAW);

        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        const texCoords = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
//下面仅占位
            0,0,
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
        gl.uniform1i(gl.getUniformLocation(this.program, 'u_shape'), -1);
        this.imageLoaded = false
        let funcs = []
        for(let key in this.images){
            funcs.push(new Promise((resolve,reject)=>{
                const texture = gl.createTexture();
                const image = new Image();
                image.src = this.images[key].url;
                image.onload = ()=>{
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    this.images[key].texture = texture;
                    resolve(this.images[key])
                };
                image.onerror=()=>{
                    reject()
                }
            }))
        }
        Promise.all(funcs).then(values=>{
            this.imageLoaded = true;
        })
    },
    render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        if(this.imageLoaded){
            const isGlobe = projection&&projection.name === 'globe'
            // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.useProgram(this.program);
            if(isGlobe){
                gl.bindBuffer(gl.ARRAY_BUFFER, this.globePosBuffer);
            }else{
                gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            }
            const aMercatorPosLocation = gl.getAttribLocation(this.program, 'a_mercator_pos');
            gl.vertexAttribPointer(aMercatorPosLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aMercatorPosLocation);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            const aTexCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');
            gl.vertexAttribPointer(aTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aTexCoordLocation);


            if(isGlobe){
                const p = new THREE.Matrix4().fromArray(projectionMatrix)
                const g = new THREE.Matrix4().fromArray(globeToMercMatrix)
                gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'u_matrix'), false, p.multiply(g).toArray());
            }else{
                gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'u_matrix'), false, projectionMatrix);
            }

            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(gl.getUniformLocation(this.program, 'u_image'), 0);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.uniform1i(gl.getUniformLocation(this.program, 'u_shape'), 2);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture1'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture2'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP,4,4);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture3'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP,8,4);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture4'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP,12,4);
            gl.uniform1i(gl.getUniformLocation(this.program, 'u_shape'), 1);

            gl.clear(gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.LINE_LOOP,16,4);
            gl.drawArrays(gl.LINE_LOOP,20,4);

            gl.drawArrays(gl.LINES,24,8);
            // this.map.triggerRepaint();
        }
    }
}
*/
export default{
    id: 'custom-image-layer',
    type: 'custom',
    renderingMode: '3d',
    imageLoaded:false,
    images: {texture1:{url:'/kysq/01.png'},texture2:{url:'/kysq/02.png'},texture3:{url:'/kysq/03.png'},texture4:{url:'/kysq/04.png'}},
    onAdd(map, gl){
        this.globeToMercMatrix = new THREE.Matrix4()//在投影变换中，记录最后一次有效的globe投影矩阵
        // console.log(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE))
        this.map = map
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        // gl.depthMask(true);
        const vertexSource = `
            attribute vec3 a_globe_pos;
            attribute vec3 a_mercator_pos;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            uniform mat4 u_matrix_g;
            uniform mat4 u_matrix_p;
            uniform float u_zoom;
            uniform bool u_globe;
            void main() {
                if(u_globe){
                    if(u_zoom<5.0){
                        gl_Position = u_matrix_p * u_matrix_g * vec4(a_globe_pos,1.0);
                    }else{
                        gl_Position = u_matrix_p * u_matrix_g * vec4(a_globe_pos,1.0);
                        // gl_Position = u_matrix_p * vec4(a_mercator_pos,1.0);
                    }
                }else{
                    gl_Position = u_matrix_p * vec4(a_mercator_pos,1.0);
                }
                v_texCoord = a_texCoord;
            }
        `;
        const fragmentSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_image;
            uniform int u_shape; //0:点,1:线,2:三角形
            void main() {
                if(u_shape==0){
                    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
                }else if(u_shape==1){
                    gl_FragColor = vec4(1.0,1.0,0.0,1.0);
                }else if(u_shape==2){
                    gl_FragColor = texture2D(u_image, v_texCoord);
                }else{
                    gl_FragColor = vec4(0.0,0.0,0.0,0.0);
                }
            }
        `;
        this.program = createProgram(gl, vertexSource, fragmentSource);
        let delta = 0.03;
        // let minLng = 102.0322-delta;
        // let maxLng = 102.0322+delta;
        // let minLat = 36.52845-delta;
        // let maxLat = 36.52845+delta;
        let minLng = 115.910703-delta;
        let maxLng = 115.910703+delta;
        let minLat = 28.859667-delta;
        let maxLat = 28.859667+delta;

        let cenLng = (minLng+maxLng)/2;
        let cenLat = (minLat+maxLat)/2;
        let h = this.map.queryTerrainElevation([cenLng,cenLat])
        let h0 =        h*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h1 =  (h+500)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h2 = (h+1000)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h3 = (h+1500)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        let h4 = (h+2000)*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
        var topLeft = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: minLng,
            lat: maxLat
        });
        var topRight = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: maxLng,
            lat: maxLat
        });
        var bottomLeft = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: minLng,
            lat: minLat
        });
        var bottomRight = mapboxgl.MercatorCoordinate.fromLngLat({
            lng: maxLng,
            lat: minLat
        });
        const positions = new Float32Array([
            topLeft.x, topLeft.y,h1,
            topRight.x,topRight.y,h1,
            bottomLeft.x, bottomLeft.y,h1,
            bottomRight.x, bottomRight.y,h1,
            topLeft.x, topLeft.y,h2,
            topRight.x,topRight.y,h2,
            bottomLeft.x, bottomLeft.y,h2,
            bottomRight.x, bottomRight.y,h2,
            topLeft.x, topLeft.y,h3,
            topRight.x,topRight.y,h3,
            bottomLeft.x, bottomLeft.y,h3,
            bottomRight.x, bottomRight.y,h3,
            topLeft.x, topLeft.y,h4,
            topRight.x,topRight.y,h4,
            bottomLeft.x, bottomLeft.y,h4,
            bottomRight.x, bottomRight.y,h4,
//绘制线
            topLeft.x,topLeft.y,h0,
            topRight.x,topRight.y,h0,
            bottomRight.x,bottomRight.y,h0,
            bottomLeft.x,bottomLeft.y,h0,

            topLeft.x,topLeft.y,h4,
            topRight.x,topRight.y,h4,
            bottomRight.x,bottomRight.y,h4,
            bottomLeft.x,bottomLeft.y,h4,

            topLeft.x,topLeft.y,h0,
            topLeft.x,topLeft.y,h4,
            topRight.x,topRight.y,h0,
            topRight.x,topRight.y,h4,
            bottomRight.x,bottomRight.y,h0,
            bottomRight.x,bottomRight.y,h4,
            bottomLeft.x,bottomLeft.y,h0,
            bottomLeft.x,bottomLeft.y,h4,
        ]);

        const globePosition = new Float32Array([
            // 500米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+500),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+500),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+500),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+500),
            // 1000米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+1000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+1000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+1000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+1000),
            // 1500米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+1500),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+1500),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+1500),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+1500),
            // 2000米处平面，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+2000),
            //底部四条线，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+0),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+0),
            //顶部四条线，4个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+2000),
            //侧边四条线，8个点
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(minLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, maxLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+0),
            ...new mapboxgl.LngLat(minLng, minLat).toEcef(h+2000),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+0),
            ...new mapboxgl.LngLat(maxLng, minLat).toEcef(h+2000),
        ]);
        this.posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);


        this.globePosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.globePosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, globePosition, gl.STATIC_DRAW);

        this.texCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
        const texCoords = new Float32Array([
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
//下面仅占位
            0,0,
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,
            0,0,

            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
            0,0,
        ]);
        gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
        this.imageLoaded = false
        let funcs = []
        for(let key in this.images){
            funcs.push(new Promise((resolve,reject)=>{
                const texture = gl.createTexture();
                const image = new Image();
                image.src = this.images[key].url;
                image.onload = ()=>{
                    gl.bindTexture(gl.TEXTURE_2D, texture);
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                    this.images[key].texture = texture;
                    resolve(this.images[key])
                };
                image.onerror=()=>{
                    reject()
                }
            }))
        }
        Promise.all(funcs).then(values=>{
            this.imageLoaded = true;
        })
    },
    render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        // console.log(centerInMercator)
        if(this.map.getZoom()<6){
            this.globeToMercMatrix = globeToMercMatrix;
        }
        if(!this.globeToMercMatrix){
            this.globeToMercMatrix = new THREE.Matrix4().toArray()
        }
        if(this.imageLoaded){
            const isGlobe = projection&&projection.name === 'globe'
            // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.useProgram(this.program);

            gl.uniform1i(gl.getUniformLocation(this.program, "u_globe"), isGlobe);
            gl.uniform1i(gl.getUniformLocation(this.program, 'u_shape'), -1);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.globePosBuffer);
            const aGlobePosLocation = gl.getAttribLocation(this.program, 'a_globe_pos');
            gl.vertexAttribPointer(aGlobePosLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aGlobePosLocation);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            const aMercatorPosLocation = gl.getAttribLocation(this.program, 'a_mercator_pos');
            gl.vertexAttribPointer(aMercatorPosLocation, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aMercatorPosLocation);

            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            const aTexCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');
            gl.vertexAttribPointer(aTexCoordLocation, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(aTexCoordLocation);





            const p = new THREE.Matrix4().fromArray(projectionMatrix)
            const g = new THREE.Matrix4().fromArray(this.globeToMercMatrix)
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'u_matrix_g'), false, g.toArray());
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'u_matrix_p'), false, p.toArray());

            gl.uniform1f(gl.getUniformLocation(this.program, 'u_zoom'), this.map.getZoom());

            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(gl.getUniformLocation(this.program, 'u_image'), 0);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            gl.uniform1i(gl.getUniformLocation(this.program, 'u_shape'), 2);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture1'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture2'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP,4,4);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture3'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP,8,4);
            gl.bindTexture(gl.TEXTURE_2D, this.images['texture4'].texture);
            gl.drawArrays(gl.TRIANGLE_STRIP,12,4);
            gl.uniform1i(gl.getUniformLocation(this.program, 'u_shape'), 1);

            // gl.clear(gl.DEPTH_BUFFER_BIT);
            gl.drawArrays(gl.LINE_LOOP,16,4);
            gl.drawArrays(gl.LINE_LOOP,20,4);

            gl.drawArrays(gl.LINES,24,8);
            // this.map.triggerRepaint();
        }
    }
}







// export default {
//   id: 'simple-triangle',
//   type: 'custom',
//   renderingMode: '3d',

//   onAdd(map, gl) {
//     this.gl = gl;

//     // === shader ===
//     const vs = `
//       attribute vec2 a_pos;
//       uniform mat4 u_matrix;
//       void main() {
//         gl_Position = u_matrix * vec4(a_pos, 0.0, 1.0);
//       }
//     `;

//     const fs = `
//       precision mediump float;
//       void main() {
//         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//       }
//     `;

//     const compile = (type, src) => {
//       const s = gl.createShader(type);
//       gl.shaderSource(s, src);
//       gl.compileShader(s);
//       return s;
//     };

//     this.program = gl.createProgram();
//     gl.attachShader(this.program, compile(gl.VERTEX_SHADER, vs));
//     gl.attachShader(this.program, compile(gl.FRAGMENT_SHADER, fs));
//     gl.linkProgram(this.program);

//     // === 三角形（NDC，直接裁剪空间） ===
//     const vertices = new Float32Array([
//       -0.5, -0.5,
//        0.5, -0.5,
//        0.0,  0.5
//     ]);

//     this.buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//   },

//   render(gl, matrix) {
//     // ======== 关键：完全重置状态 ========
//     gl.useProgram(this.program);

//     gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//     gl.disable(gl.DEPTH_TEST);
//     gl.depthMask(false);

//     gl.disable(gl.CULL_FACE);

//     gl.disable(gl.BLEND);

//     gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

//     const loc = gl.getAttribLocation(this.program, 'a_pos');
//     gl.enableVertexAttribArray(loc);
//     gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

//     const uMatrix = gl.getUniformLocation(this.program, 'u_matrix');
//     gl.uniformMatrix4fv(uMatrix, false, matrix);

//     gl.drawArrays(gl.TRIANGLES, 0, 3);
//   }
// };
