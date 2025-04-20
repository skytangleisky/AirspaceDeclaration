import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import inject from '@rollup/plugin-inject'
import Unocss from 'unocss/vite'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import path from "path";
import {
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[name]",
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      resolvers: [ElementPlusResolver({importStyle: 'sass'})],
    }),
    inject({
      $: "jquery",
      // jQuery: "jquery",
      // "window.jQuery": "jquery"
    }),
    Unocss({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ]
    }),
  ],
  build: {
    outDir: "lib",
    lib: {
      // entry: path.resolve(__dirname, "./src/components/index.js"),
      entry: "src/components/index.js",
      // entry: "src/App.vue",
      // formats: ["umd"],
      name: "index",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["vue","pinia"],
      output: {
        globals: {
          vue: "Vue",
          pinia: "Pinia",
        },
      },
    },
  },
  define: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
    __USE_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:true,
    process: {
      env: {
        NODE_ENV: "development",
      },
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      // pinia: `${__dirname}/packages/pinia/src/index.ts`,
      // '@mapbox/mapbox-gl-draw':`${__dirname}/packages/mapbox-gl-draw`,
      marchingsquares:`${__dirname}/packages/marchingsquares.js/src/main.js`,
    },
  },

  css:{
    preprocessorOptions:{
      scss:{
        additionalData: `@use "~/styles/variable.scss" as *;`,
      }
    }
  },

  server:{
    // https:{
    //   cert: fs.readFileSync('dev.tanglei.top.pem'),
    //   key: fs.readFileSync('dev.tanglei.top.key')
    //   // cert: fs.readFileSync('tanglei.site.pem'),
    //   // key: fs.readFileSync('tanglei.site.key')
    // },
    // open:'http://localhost:5173',
    host:true,
    port:5174,
    strictPort:true,
    proxy:{
      // '/guangheng':{
      //   target:'http://tanglei.top:8000',//替换的服务端地址
      //   changeOrigin:true,//开启代理，允许跨域
      //   rewrite:path=>path.replace(/^\/guangheng/,''), // 设置重写的路径
      // },
      '/api':{
        target:'https://main.emgo-tech.com',//替换的服务端地址
        // target:'http://127.0.0.1:3000',//替换的服务端地址
        changeOrigin:true,
      },
      '/backend':{
        target:'http://backend.victorysoft.cn',
        secure:false,
        changeOrigin:true,
        // rewrite:path=>path.replace(/^\/backend/,''), // 设置重写的路径
        ws:true,
      },
      '/debug':{
        target:'http://tanglei.top:7777',
        secure:false,
        changeOrigin:true,
        ws:true,
      },
      '/tanglei':{
        target:'http://tanglei.top',//替换的服务端地址
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/tanglei/,'') // 设置重写的路径
      },
      '/qqAuth':{
        target:'https://graph.qq.com',//替换的服务端地址
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/qqAuth/,'') // 设置重写的路径
      },
      '/ArcGIS':{
        target:'https://map.geoq.cn',//替换的服务端地址
        changeOrigin:true,
      },
      '/qt':{
        // target:'http://192.168.0.135:9090',//替换的服务端地址
        target:'http://qt.tanglei.top',//替换的服务端地址
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/qt/,'') // 设置重写的路径
      },
      '/amap':{
        target:'http://tanglei.top:8000',//替换的服务端地址
        // target:'http://192.168.0.133:8000',//替换的服务端地址
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/amap/,'') // 设置重写的路径
      },
      '/aircraft_position':{//人影飞机
        target:'http://192.168.0.135:8081',
        // target:'http://victorysoft.cn:8081',
        rewrite:path=>path.replace(/^\/aircraft_position/,''), // 设置重写的路径
        secure:false,
        changeOrigin:true,
        ws:true,
      },
      '/ry_api':{//人影接口
        target:'http://victorysoft.cn:8080',
        rewrite:path=>path.replace(/^\/ry_api/,''), // 设置重写的路径
        secure:false,
        changeOrigin:true,
        ws:true,
      },
      '/python':{
        // target:'http://192.168.0.135:8000',
        target:'http://victorysoft.cn:8000',
        rewrite:path=>path.replace(/^\/python/,''), // 设置重写的路径
        secure:false,
        changeOrigin:true,
        ws:true,
      },
      '/tianditu':{
        target:'http://t0.tianditu.com',
        rewrite:path=>path.replace(/^\/tianditu/,''), // 设置重写的路径
        secure:false,
        changeOrigin:true,
        ws:true,
      },
      '/adsb':{
        target:'http://113.44.175.230:18301',
        rewrite:path=>path.replace(/^\/adsb/,''),
        secure:false,
        changeOrigin:true,
      }
    }
  }
});
