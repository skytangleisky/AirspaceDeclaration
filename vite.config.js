import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import inject from '@rollup/plugin-inject'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import path from "path";
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { timeout } from "d3";
const option = {
  keepAlive: true
}

const agent = new HttpsProxyAgent('https://127.0.0.1:1100',option)
const testAgent = new HttpsProxyAgent('https://127.0.0.1:8181',option)
// https://vitejs.dev/config/
export default defineConfig({
  base: '/kysq/',
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
      symbolId: "icon-[name]",
    }),
    // AutoImport({
    //   resolvers: [ElementPlusResolver({
    //     locale: zhCn,
    //   })],
    // }),
    // Components({
    //   // allow auto load markdown components under `./src/components/`
    //   extensions: ['vue', 'md'],
    //   // allow auto import and register components used in markdown
    //   include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    //   resolvers: [ElementPlusResolver(
    //     {importStyle: 'sass'}
    //   )],
    // }),
    inject({
      $: "jquery",
      // jQuery: "jquery",
      // "window.jQuery": "jquery"
    }),
  ],
  build: {
    sourcemap: false,
    minify: 'esbuild',
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
      external: ["vue","pinia","element-plus"],
      output: {
        globals: {
          vue: "Vue",
          pinia: "Pinia",
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
  define: {
    global: 'globalThis',
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
      pinia: `${__dirname}/packages/pinia/src/index.ts`,
      '@mapbox/mapbox-gl-draw':path.resolve(__dirname, 'packages/mapbox-gl-draw'),
      marchingsquares:path.resolve(__dirname, 'packages/marchingsquares.js/src/main.js'),
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
    port:5173,
    strictPort:true,
    allowedHosts:true,
    proxy:{
      '/backend':{
        target:'http://127.0.0.1:3000',
        secure:false,
        changeOrigin:true,
        // rewrite:path=>path.replace(/^\/backend/,''),
        ws:true,
      },
      '/test':{
        agent,
        target:'http://10.194.22.240:4000',
        changeOrigin:true,
        rewrite:path=>path.replace(/^\/test/,''),
      },
      '/ry_api':{//人影接口
        target:'http://127.0.0.1:21000',
        rewrite:path=>path.replace(/^\/ry_api/,''),
        secure:false,
        changeOrigin:true,
        ws:true,
      },
      '/adsb':{
        agent,
        target:'http://10.225.3.150:18185',
        // target:'http://113.44.175.230:18301',
        // rewrite:path=>path.replace(/^\/adsb/,''),
        secure:false,
        changeOrigin:true,
      },
      '/videoLive':{
        agent,
        target:'http://10.225.3.150:8091',
        changeOrigin:true,
        secure:false,
      },
      '/openUrl':{
        agent,
        target:'http://172.18.7.210:83',
        changeOrigin:true,
        secure:false,
      },
      '/tile':{//地图
        agent,
        target:'http://10.225.6.188:3141',
        rewrite:path=>path.replace(/^\/tile/,''),
        changeOrigin:true,
        secure:false,
      },
      '/cdb':{
        agent,
        target:'http://10.225.6.188:3141',
        changeOrigin:true,
        secure:false,
      },
      '/geoserver':{
        agent,
        target:'http://10.225.6.188:3141',
        changeOrigin:true,
        secure:false,
      },
      '/zcgk':{//三维产品接口
        agent,
        target:'http://10.225.6.188:3141',
        changeOrigin:true,
        secure:false,
      },
      '/ryyth-meteordata':{//睿图雷达
        agent,
        target:'http://10.225.6.188:3141',
        changeOrigin:true,
        secure:false,
      },
      // '/qt':{
      //   // agent,
      //   // target:'http://10.225.6.184:8001',
      //   // target:'http://172.18.7.38:8001',
      //   target:'http://192.168.0.135:8153',
      //   rewrite:path=>path.replace(/^\/qt/,''),
      //   changeOrigin:true,
      //   secure:false,
      // },
      '/weatherModification':{
        agent,
        target:'http://10.225.3.150:18185',
        changeOrigin:true,
        secure:false,
      },
      '/planPath':{
        agent,
        target:'http://10.225.3.150:8091',
        rewrite:path=>path.replace(/^\/planPath/,''),
        changeOrigin:true,
        secure:false,
      },
      '/maps0':{
        target:'http://127.0.0.1:3140',
        changeOrigin:true,
        secure:false,
      },
      '/maps1':{
        target:'http://127.0.0.1:3141',
        changeOrigin:true,
        secure:false,
      },
      '/maps2':{
        target:'http://127.0.0.1:3142',
        changeOrigin:true,
        secure:false,
      },
      '/maps3':{
        agent:testAgent,
        target:'http://127.0.0.1:3143',
        changeOrigin:true,
        secure:false,
      },
    }
  }
});
