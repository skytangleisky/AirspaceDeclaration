// export function getImage(url, extent) {
//   return new Promise((resolve, reject) => {
//     const image = new Image();
//     image.crossOrigin = "anonymous";
//     image.src = url;
//     image.onload = () => {
//       const [minLon, minLat, maxLon, maxLat] = extent;
//       const w_4326 = image.width;
//       const h_4326 = image.height;

//       // 将经纬度转为3857米坐标
//       const R = 6378137.0;
//       const lonLatTo3857 = (lon, lat) => {
//         const x = R * lon * Math.PI / 180;
//         const y = R * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360));
//         return { x, y };
//       };
//       const xy1 = lonLatTo3857(minLon, minLat);
//       const xy2 = lonLatTo3857(maxLon, maxLat);
//       const width_m = Math.abs(xy2.x - xy1.x);
//       const height_m = Math.abs(xy2.y - xy1.y);
//       const meter_per_pixel = width_m / w_4326;
//       const w_3857 = w_4326;
//       const h_3857 = Math.round(height_m / meter_per_pixel);

//       // 创建源 canvas
//       const sourceCanvas = document.createElement("canvas");
//       sourceCanvas.width = w_4326;
//       sourceCanvas.height = h_4326;
//       const srcCtx = sourceCanvas.getContext("2d");
//       srcCtx.drawImage(image, 0, 0);
//       const srcData = srcCtx.getImageData(0, 0, w_4326, h_4326);

//       // 创建目标 canvas
//       const destCanvas = document.createElement("canvas");
//       destCanvas.width = w_3857;
//       destCanvas.height = h_3857;
//       const destCtx = destCanvas.getContext("2d");
//       const destImg = destCtx.createImageData(w_3857, h_3857);

//       // yToLat 反变换
//       const yToLat = (y) =>
//         (180 / Math.PI) * (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2);

//       // 开始重采样
//       for (let y3857 = 0; y3857 < h_3857; y3857++) {
//         for (let x3857 = 0; x3857 < w_3857; x3857++) {
//           const x_m = xy1.x + (x3857 / w_3857) * width_m;
//           const y_m = xy2.y - (y3857 / h_3857) * height_m;
//           const lon = (x_m / R) * (180 / Math.PI);
//           const lat = yToLat(y_m);

//           // 经纬度映射回原图像素坐标
//           const u = (lon - minLon) / (maxLon - minLon);
//           const v = (maxLat - lat) / (maxLat - minLat);
//           const sx = Math.floor(u * w_4326);
//           const sy = Math.floor(v * h_4326);

//           if (sx >= 0 && sx < w_4326 && sy >= 0 && sy < h_4326) {
//             const srcIdx = (sy * w_4326 + sx) * 4;
//             const dstIdx = (y3857 * w_3857 + x3857) * 4;
//             destImg.data[dstIdx] = srcData.data[srcIdx];
//             destImg.data[dstIdx + 1] = srcData.data[srcIdx + 1];
//             destImg.data[dstIdx + 2] = srcData.data[srcIdx + 2];
//             destImg.data[dstIdx + 3] = srcData.data[srcIdx + 3];
//           }
//         }
//       }

//       // 输出新图
//       destCtx.putImageData(destImg, 0, 0);
//       resolve(destCanvas.toDataURL());
//     };
//     image.onerror = reject;
//   });
// }
// src/utils/getImage.js

import workerUrl from './projectWorker.js?url'

export function getImage(url, extent) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;

    image.onload = async () => {
      const bitmap = await createImageBitmap(image);
      const w = image.width;
      const h = image.height;

      const worker = new Worker(workerUrl,{ type: 'module' });

      worker.postMessage({
        imageBitmap: bitmap,
        extent,
        width: w,
        height: h,
      }, [bitmap]);

      worker.onmessage = (e) => {
        const blob = e.data;
        const blobUrl = URL.createObjectURL(blob);
        resolve(blobUrl); // 可用于 <img :src="..." />
        worker.terminate();
      };

      worker.onerror = reject;
    };

    image.onerror = reject;
  });
}
