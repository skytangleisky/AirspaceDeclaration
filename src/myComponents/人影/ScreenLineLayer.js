import { Layer } from '@deck.gl/core';
import { GL } from '@luma.gl/constants';

export class ScreenLineLayer extends Layer {
  static layerName = 'ScreenLineLayer';

  initializeState() {
    const { gl } = this.context;

    // 顶点缓冲区 [-0.5,0] -> [0.5,0]，表示线段从起点到终点
    const positions = new Float32Array([0, 0, 1, 0]);
    this.state.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(GL.ARRAY_BUFFER, this.state.vertexBuffer);
    gl.bufferData(GL.ARRAY_BUFFER, positions, GL.STATIC_DRAW);

    // 实例属性
    this.getAttributeManager().addInstanced({
      instancePositions: { size: 2, accessor: 'getPosition' }, // 屏幕空间起点
      instanceAngle: { size: 1, accessor: 'getAngle', defaultValue: 0 },
      instanceLength: { size: 1, accessor: 'getLength', defaultValue: 100 },
      instanceColor: { size: 4, accessor: 'getColor', defaultValue: [255, 0, 0, 255] }
    });
  }

  getShaders() {
    return {
      vs: `
      attribute vec2 positions;
      attribute vec2 instancePositions;
      attribute float instanceAngle;
      attribute float instanceLength;
      attribute vec4 instanceColor;

      uniform vec2 viewportSize;
      varying vec4 vColor;

      void main(void) {
        // 起点屏幕坐标 -> NDC
        vec2 startNDC = (instancePositions / viewportSize) * 2.0 - 1.0;
        startNDC.y = -startNDC.y;

        // 方向向量
        vec2 dir = vec2(cos(instanceAngle), sin(instanceAngle));

        // 屏幕像素偏移
        vec2 pixelOffset = dir * positions.x * instanceLength;

        // 转 NDC
        vec2 offset = pixelOffset / viewportSize * 2.0;
        offset.y = -offset.y; // y 翻转

        gl_Position = vec4(startNDC + offset, 0.0, 1.0);
        vColor = instanceColor / 255.0;
      }
      `,
      fs: `
      precision highp float;
      varying vec4 vColor;
      void main(void) {
        gl_FragColor = vColor;
      }
      `
    };
  }

  draw({ uniforms }) {
    const { gl, viewport } = this.context;
    const { vertexBuffer } = this.state;
    const { data } = this.props;

    if (!data || data.length === 0) return;

    // 创建 program
    if (!this.state.program) {
      const { vs, fs } = this.getShaders();
      const vsShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vsShader, vs);
      gl.compileShader(vsShader);
      const fsShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fsShader, fs);
      gl.compileShader(fsShader);
      const program = gl.createProgram();
      gl.attachShader(program, vsShader);
      gl.attachShader(program, fsShader);
      gl.linkProgram(program);
      this.state.program = program;
    }

    const program = this.state.program;
    gl.useProgram(program);

    // 顶点缓冲区
    gl.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    const posLoc = gl.getAttribLocation(program, 'positions');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, GL.FLOAT, false, 0, 0);

    // 实例属性
    const instancePositions = [];
    const instanceAngles = [];
    const instanceLengths = [];
    const instanceColors = [];

    data.forEach(d => {
      const screenPos = viewport.project([d.fLongitude, d.fLatitude]); // 经纬度 -> 屏幕像素
      instancePositions.push(screenPos[0], screenPos[1]);
      const x = d.offset[0] - 4
      const y = d.offset[1]
      instanceAngles.push(Math.atan2(y, x));
      instanceLengths.push(Math.sqrt(x*x+y*y));
      instanceColors.push(0,255,0,255);
    });

    const attrs = {
      instancePositions: { value: instancePositions, size: 2 },
      instanceAngle: { value: instanceAngles, size: 1 },
      instanceLength: { value: instanceLengths, size: 1 },
      instanceColor: { value: instanceColors, size: 4 }
    };

    Object.keys(attrs).forEach(name => {
      const attr = attrs[name];
      const loc = gl.getAttribLocation(program, name);
      if (loc < 0) return;
      const buf = gl.createBuffer();
      gl.bindBuffer(GL.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attr.value), GL.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, attr.size, GL.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(loc, 1);
    });

    // viewportSize uniform
    const viewportSizeLoc = gl.getUniformLocation(program, 'viewportSize');
    gl.uniform2f(viewportSizeLoc, viewport.width, viewport.height);

    // 绘制 instanced
    gl.drawArraysInstanced(GL.LINES, 0, 2, data.length);
  }

  finalizeState() {
    const { gl } = this.context;
    if (this.state.vertexBuffer) gl.deleteBuffer(this.state.vertexBuffer);
    if (this.state.program) gl.deleteProgram(this.state.program);
  }
}
