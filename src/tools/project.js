//4326->3857
export function getImage(url,extent){
  return new Promise((resolve, reject) => {
    // 加载纹理图像（EPSG:4326 图）
    const image = new Image();
    function lonLatTo3857(lon, lat) {
      const R = 6378137.0;
      const x = R * lon * Math.PI / 180;
      const y = R * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
      return { x, y };
    }
    image.crossOrigin = "";
    image.src = url;
    image.onload = () => {
      // 输入数据
      const w_4326 = image.width;
      const h_4326 = image.height;
      // extent = [73.0, 12.2, 135.0, 54.2]
      const minLon = extent[0], maxLon = extent[2];
      const minLat = extent[1], maxLat = extent[3];
      // 坐标转换
      const { x: x1, y: y1 } = lonLatTo3857(minLon, minLat);
      const { x: x2, y: y2 } = lonLatTo3857(maxLon, maxLat);

      // 计算米数宽高
      const width_m = Math.abs(x2 - x1);
      const height_m = Math.abs(y2 - y1);

      // 保持宽度像素数不变，计算每像素多少米
      const meter_per_pixel = width_m / w_4326;

      // 计算新图像的像素高度
      const h_3857 = Math.round(height_m / meter_per_pixel);
      const w_3857 = w_4326; // 宽度保持不变

      // console.log(`转换后的图片尺寸为：${w_3857} × ${h_3857}`);

      const canvas = document.createElement('canvas')
      canvas.width = w_3857;
      canvas.height = h_3857;
      const gl = canvas.getContext("webgl");
      gl.viewport(0, 0, w_3857, h_3857);
      // 清除上一帧内容（可选但推荐）
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      }


      const vsSource = `attribute vec2 a_position;
      varying vec2 v_texcoord;
      void main() {
        v_texcoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0, 1);
      }`;
      const fsSource = `precision highp float;
      varying vec2 v_texcoord;
      uniform sampler2D u_image;
      uniform float minLat;
      uniform float maxLat;
      uniform float minLon;
      uniform float maxLon;

      const float R = 6378137.0;

      float latToY(float lat) {
        float rad = radians(lat);
        return R * log(tan(3.1415926 / 4.0 + rad / 2.0));
      }

      float yToLat(float y) {
        return degrees(2.0 * atan(exp(y / R)) - 3.1415926 / 2.0);
      }

      void main() {
        // EPSG:3857 Y 范围
        float y0 = latToY(minLat);
        float y1 = latToY(maxLat);
        float y = mix(y0, y1, v_texcoord.y);
        float lat = yToLat(y);

        float lon = mix(minLon, maxLon, v_texcoord.x);

        float u = (lon - minLon) / (maxLon - minLon);
        float v = (maxLat - lat) / (maxLat - minLat);

        vec4 color = texture2D(u_image, vec2(u, v));
        gl_FragColor = color;
      }`;

      const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      // 顶点数据（两个三角形构成矩形）
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      const positions = new Float32Array([
        -1, -1, 1, -1, -1, 1,
        1, -1, 1,  1, -1, 1
      ]);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

      const aPosition = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      // 设置 uniform 经纬度范围
      gl.uniform1f(gl.getUniformLocation(program, "minLat"), minLat);
      gl.uniform1f(gl.getUniformLocation(program, "maxLat"), maxLat);
      gl.uniform1f(gl.getUniformLocation(program, "minLon"), minLon);
      gl.uniform1f(gl.getUniformLocation(program, "maxLon"), maxLon);



      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.drawArrays(gl.TRIANGLES, 0, 6);


      const result = canvas.toDataURL()
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      gl.deleteTexture(tex);
      gl.deleteBuffer(positionBuffer);
      canvas.remove()
      resolve(result)
    };
    image.onerror = (e)=>{
      reject(e)
    }
    image.onabort = (e)=>{
      reject(e)
    }
  })
}