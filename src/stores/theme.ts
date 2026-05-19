import {defineStore} from "pinia";

export const useThemeStore = defineStore("themeColor", {
  state: () => ({
    themeStyle:'w-style-2',//风格1：江西  风格2：福建 3：天工3.0

    bgColorPage: "", //页面背景色
    bgColor: "",//背景色
    bgColorOverlay: "",//模块背景色
    textColorPrimary: '',//主要文字颜色
    textColorRegular: '',//常规文字颜色
    textColorSecondary: '',//次要文字颜色
    borderColor: '',//描边颜色
    colorPrimary: "",//主题色
    colorSuccess: "",//成功色-绿色
    colorWarning: "",//告警色 - 黄色
    colorError: "",//错误色 - 红色
    colorYellow: "",//黄色
    colorPurple: "",//紫色
    colorWhite: "#fff",//白色
    colorDark: "#000",//黑色
    //===================系统中实际用的变量色
    mapBg: "", // 地图地球颜色
    countyBg: "", // 区县填充色
    mapOutline: "", // 区县边框颜色
    countyLabelColor: "", // 区县文字颜色
    airportStroke: "", // 机场描边颜色
    airportFill: "", // 机场填充颜色
  }),
  getters: {},
  actions: {
    /**
     * @author yhl 2025/9/29 16:01
     * @description 设置关于地图的颜色配置
     * @params
     */


    /**
     * @author yhl 2025/9/29 16:04
     * @description 根据风格，设置系统中需ts代码配置的相关颜色
     * @params isDark: 是否深色主题
     * @params isInit: 是否是系统初始化调用
     */
    setThemeColor(isDark: boolean, isInit: boolean) {
      //配置常规变量
      const setVarStyle = () => {

      }

      //配置深色风格
      const setDarkThemeStyle = () => {
        this.bgColorPage = "#051332"
        this.bgColor = "#0d224b"
        this.bgColorOverlay = "#0F2859"
        this.textColorPrimary = '#B2E3FF'
        this.textColorRegular = '#4493C6'
        this.textColorSecondary = '#096FAA'
        this.borderColor = '#0082c4'
        this.colorPrimary = "#55B8F7"
        this.colorSuccess = "#3AC8A5"
        this.colorWarning = "#FF8E59"
        this.colorError = "#F46E70"
        this.colorYellow = "#EEEC55"
        this.colorPurple = "#975CE4"

        //地图配置相关颜色
        this.mapBg = "#051332"
        this.countyBg = "#0d224b"
        this.mapOutline = "#0082c4"
        this.countyLabelColor = "#B2E3FF"
        this.airportStroke = "#FF6B6B"
        this.airportFill = "rgba(255,107,107,0.3)"
      }
      //配置浅色风格
      const setLightThemeStyle = () => {
        this.bgColorPage = "#F4FBFF"
        this.bgColor = "#E5F6FF"
        this.bgColorOverlay = "#E2F5FF"
        this.textColorPrimary = '#19445E'
        this.textColorRegular = '#23516d'
        this.textColorSecondary = '#798E99'
        this.borderColor = '#A2BECC'
        this.colorPrimary = "#52B7F7"
        this.colorSuccess = "#7eefe0"
        this.colorWarning = "#ffdf99"
        this.colorError = "#ffac93"
        this.colorYellow = "#EEEC55"
        this.colorPurple = "#975CE4"

        //地图配置相关颜色
        this.mapBg = "#F4FBFF"
        this.countyBg = "#E5F6FF"
        this.mapOutline = "#A2BECC"
        this.countyLabelColor = "#19445E"
        this.airportStroke = "#F46E70"
        this.airportFill = "rgba(244,110,112,0.3)"
      }
      if (isDark) {
        setDarkThemeStyle()
      } else {
        setLightThemeStyle()
      }
      setVarStyle()
    }


  },
  persist: true, //开启持久化
})