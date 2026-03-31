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
      instancePositions: { size: 3, accessor: 'getPosition' }, // 屏幕空间起点
      instanceColor: { size: 4, accessor: 'getColor', defaultValue: [255, 0, 0, 255] },
      instanceOffset: { size: 2, accessor: 'getOffset', defaultValue: [0, 0] },
    });
    // 创建 program
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

  getShaders() {
    return {
      vs: `#version 300 es
      precision highp float;

      in vec2 positions;
      in vec3 instancePositions;
      in vec2 instanceOffset;
      in vec4 instanceColor;

      uniform vec2 viewportSize;

      out vec4 vColor;

      void main() {
        // 起点：屏幕像素 -> NDC
        vec2 startNDC = (instancePositions.xy / viewportSize) * 2.0 - 1.0;
        startNDC.y = -startNDC.y;

        vec2 pixelOffset = positions.x * instanceOffset;
        float z = instancePositions.z * 2.0 - 1.0; // depth 转 NDC
        vec2 offset = pixelOffset / viewportSize * 2.0;
        offset.y = -offset.y;

        gl_Position = vec4(startNDC + offset, z, 1.0);
        vColor = instanceColor / 255.0;
      }
      `,
      fs: `#version 300 es
      precision highp float;

      in vec4 vColor;
      out vec4 fragColor;

      void main() {
        fragColor = vColor;
      }
      `
    };
  }

  draw({ uniforms }) {
    const { gl, viewport } = this.context;
    const { vertexBuffer } = this.state;
    const { data } = this.props;

    if (!data || data.length === 0) return;



    const program = this.state.program;
    gl.useProgram(program);

    // 顶点缓冲区
    gl.bindBuffer(GL.ARRAY_BUFFER, vertexBuffer);
    const posLoc = gl.getAttribLocation(program, 'positions');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, GL.FLOAT, false, 0, 0);

    // 实例属性
    const instancePositions = [];
    const instanceColors = [];
    const instanceOffset = [];

    data.forEach(d => {
      const screenPos = viewport.project([d.fLongitude, d.fLatitude, d.iAltitudeADS2]); // 经纬度 -> 屏幕像素
      instancePositions.push(screenPos[0], screenPos[1], screenPos[2]);
      const x = d.offset[0] - 4
      const y = d.offset[1]
      instanceColors.push(...this.props.getColor(d));
      instanceOffset.push(x,y)
    });

    const attrs = {
      instancePositions: { value: instancePositions, size: 3 },
      instanceColor: { value: instanceColors, size: 4 },
      instanceOffset: { value: instanceOffset, size: 2 },
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

    gl.disable(gl.DEPTH_TEST);
    // 绘制 instanced
    gl.drawArraysInstanced(GL.LINES, 0, 2, data.length);
  }

  finalizeState() {
    const { gl } = this.context;
    if (this.state.vertexBuffer) gl.deleteBuffer(this.state.vertexBuffer);
    if (this.state.program) gl.deleteProgram(this.state.program);
  }
}



// import {LineLayer} from '@deck.gl/layers';

// export class OffsetPathLayer extends LineLayer {
//   static layerName = 'OffsetPathLayer';
//   initializeState() {
//     super.initializeState();

//     const attributeManager = this.getAttributeManager();

//     attributeManager.addInstanced({
//       instanceTargetPositions: {
//         size: 3,
//         accessor: 'getTargetPosition',
//         update: this.calculateTargetPositions
//       }
//     });
//   }

//   calculateTargetPositions(attribute) {
//     const {data, getTargetPosition, getPixelOffset} = this.props;
//     const {viewport} = this.context;

//     const {value} = attribute;
//     let i = 0;

//     for (const object of data) {
//       const [lng, lat, z = 0] = getTargetPosition(object);

//       // 👉 经纬度 → 屏幕
//       const [x, y,h] = viewport.project([lng, lat, z]);

//       // 👉 像素偏移
//       const [dx, dy] = getPixelOffset
//         ? getPixelOffset(object)
//         : [0, 0];

//       const x2 = x + dx;
//       const y2 = y + dy;

//       // 👉 屏幕 → 经纬度
//       const [lng2, lat2, z2] = viewport.unproject([x2, y2, h]);

//       value[i++] = lng2;
//       value[i++] = lat2;
//       value[i++] = z2;
//     }
//   }
// }

import {LineLayer} from '@deck.gl/layers';

export class OffsetPathLayer extends LineLayer {
  static layerName = 'OffsetPathLayer';

  getShaders() {
    const shaders = super.getShaders();

    shaders.inject = {
      'vs:#decl': `
        in vec2 instancePixelOffset;
      `,

      'vs:#main-end': `
        if (positions.x > 0.5) {
          gl_Position.x += instancePixelOffset.x/project.viewportSize.x*gl_Position.w*2.0;
          gl_Position.y -= instancePixelOffset.y/project.viewportSize.y*gl_Position.w*2.0;
        }
      `
    };

    return shaders;
  }

  initializeState() {
    super.initializeState();

    this.getAttributeManager().addInstanced({
      instancePixelOffset: {
        size: 2,
        accessor: 'getPixelOffset',
        defaultValue: [0, 0]
      }
    });
  }
}