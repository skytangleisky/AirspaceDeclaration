export function formatOperateType({operate_type}:{operate_type:number}){
  switch(operate_type){
    case 1:
      return '待申报'
    case 2:
      return '审批中'
    case 3:
      return '审批通过'
    case 4:
      return '审批驳回'
    case 5:
      return '执行中'
    case 6:
      return '已完成'
    default:
      return `未知状态${operate_type}`
  }
}
export function formatControlMode(value:any){
  switch(value){
    case 1:
      return '遥控飞行'
    case 2:
      return '自主飞行'
    default:
      return `未知状态${value}`
  }
}
export function formatFlightMode(value:any){
  switch(value){
    case 1:
      return '视距内飞行'
    case 2:
      return '超视距飞行'
    default:
      return `未知状态${value}`
  }
}
export function formatControlZone(value:any){
  switch(value){
    case 1:
      return '漳州分区'
    case 2:
      return '福州分区'
    default:
      return `未知状态${value}`
  }
}
export function formatPlanType(value:any){
  switch(value){
    case 1:
      return '一般飞行'
    case 2:
      return '紧急飞行'
    case 3:
      return '特别紧急'
    case 4:
      return '长期飞行活动'
    default:
      return `未知状态${value}`
  }
}
export function formatPlanNature(value: any) {
  switch (value) {
    case 1:
      return '违法建设巡查'
    case 2:
      return '海事巡查'
    case 3:
      return '汛期地质灾害抢险排查飞行'
    case 4:
      return '训练飞行'
    case 5:
      return '试飞'
    case 6:
      return '熟练飞行'
    case 7:
      return '转场（调机）'
    case 8:
      return '个人娱乐'
    case 9:
      return '航空表演'
    case 10:
      return '空中广告'
    case 11:
      return '空中拍照'
    case 12:
      return '跳伞飞行服务'
    case 13:
      return '航空摄影'
    case 14:
      return '空中游览'
    case 15:
      return '驾驶员培训'
    case 16:
      return '包机飞行'
    case 17:
      return '石油服务'
    case 18:
      return '气象探测'
    case 19:
      return '科学实验'
    case 20:
      return '海洋监测'
    case 21:
      return '直升机引航'
    case 22:
      return '城市消防'
    case 23:
      return '空中巡查'
    case 24:
      return '医疗救护'
    case 25:
      return '电子作业'
    case 26:
      return '渔业飞行'
    case 27:
      return '航空喷洒'
    case 28:
      return '航空护林'
    case 29:
      return '航空探矿'
    case 30:
      return '人工降水'
    case 31:
      return '路桥巡查'
    case 32:
      return '其他'
    default:
      return `未知类型${value}`
  }
}
export function formatUavType(value:number){
  switch(value){
    case 1:
      return '多旋翼'
    case 2:
      return '固定翼'
    case 3:
      return '直升机'
    case 4:
      return '垂直起降固定翼'
    case 5:
      return '自转旋翼'
    case 6:
      return '飞艇'
    case 7:
      return '其它'
    default:
      return `未知状态${value}`
  }
}
export function formatUavCategory(value:number){
  switch(value){
    case 1:
      return 'Ⅰ-微型'
    case 2:
      return 'Ⅱ-轻型'
    case 3:
      return 'Ⅲ-小型'
    case 4:
      return 'Ⅳ-中型'
    case 10:
      return 'Ⅹ-大型'
    default:
      return `未知状态${value}`
  }
}
export function formatAirspaceShape(value:number){
  switch(value){
    case 1:
      return '多边形'
    case 2:
      return '圆形'
    case 3:
      return '航线'
    default:
      return `未知状态${value}`
  }
}