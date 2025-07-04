import moment from 'moment'
import request from '../utils/request'

//公司
let dbConfig = 'host=192.168.0.240&port=3306&user=root&password=mysql'
let database1 = `${dbConfig}&database=union`
let database2 = `${dbConfig}&database=ryplat_bjry`

//北京市
dbConfig = "host=10.224.153.90&port=3306&user=bjryb&password=ryb115"
database1 = `${dbConfig}&database=union`
database2 = `${dbConfig}&database=ryplat`

//华为
// dbConfig = "host=127.0.0.1&port=3306&user=bjryb&password=ryb115"
// database1 = `${dbConfig}&database=union`
// database2 = `${dbConfig}&database=ryplat_bjry`

//钟桃
// dbConfig = "host=127.0.0.1&port=3306&user=root&password=Tao.1841"
// database1 = `${dbConfig}&database=union`
// database2 = `${dbConfig}&database=ryplat_bjry`

export function 机场(){
  return request({
    url: '/backend/transaction?'+database1,
    method: 'post',
    data:{
      sqls:[
        "select * from `airport`"
      ]
    }
  })
}
export function 华北飞行区域(){
  return request({
    url: '/backend/transaction?'+database1,
    method: 'post',
    data:{
      sqls:[
        "select * from `华北飞行区域`"
      ]
    }
  })
}
export function 烟炉数据() {
  return request({
    url: 'backend/db/stoves?'+database2,
    method: 'post',
    data:{
      select:['*'],
      where:[
        {
          relation:'AND',
          field:'stovetype',
          relationship:'=',
          condition:'1'
        }
      ],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
}
export function 作业点(){
  return request({
    url: '/backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "select z.*,u1.strName as strMgrUnitName,u2.strName as strRelayUnitName FROM `zydpara` z left join `units` u1 on z.strMgrUnit = u1.strID left join `units` u2 on z.strRelayUnit = u2.strID WHERE z.strID LIKE '110%' AND z.strWeapon!='3'",
      ]
    }
  })
}
export function 作业状态数据(){
  return request({
    url: '/backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls: [
        "SELECT z.*,u1.strName as strATCUnitIDName,u2.strName as strUpApplyUnitName FROM `zyddata` z left join `units` u1 on z.strATCUnitID = u1.strID left join `units` u2 on z.strUpApplyUnit = u2.strID ORDER BY z.tmBeginApply DESC",
        "SELECT z.*,u1.strName as strATCUnitIDName,u2.strName as strUpApplyUnitName FROM `zydhisdata` z left join `units` u1 on z.strATCUnitID=u1.strID left join `units` u2 on z.strUpApplyUnit = u2.strID where DATE_FORMAT(z.tmBeginApply,'%Y-%m-%d') = CURDATE() ORDER BY z.tmBeginApply DESC",//当天的数据
        // "SELECT z.*,u.strName as unitName FROM `zydhisdata` z left join `units` u on z.strATCUnitID=u.strID where DATE_FORMAT(z.tmBeginApply,'%Y-%m-%d') = DATE_FORMAT((select MAX(DATE(tmBeginApply)) from zydhisdata),'%Y-%m-%d')",//最后一天的数据
      ],
    }
  })
}
export function ADSB(){
  return request({
    url: '/adsb/getPlaneInfo',
    method: 'get',
  })
}
// # 定义烟炉指令发送结构体
// # '''
// # 参数cmd说明：烟炉控制命令，
// #     "JF":即时点火，当发送即时点火命令时，使用参数iPara作为附加参数，表示点火数量，默认填1
// #     "YZ":烟条装载，当发送烟条装载命令时，使用参数sPara作为附加参数，表示装在方式：996第一个烟炉，999全部烟炉，001第一根烟条
// #     "YX":烟条卸载，当发送烟条卸载命令时，使用参数iPara作为附加参数，表示要卸载的烟条序号，取值为001-056
// #     "XC":烟炉的时间查询，当发送烟炉的时间查询命令时，无需填写附加参数
// #     "XS":给烟炉设置时间，当发送烟炉的时间设置命令时，使用参数sPara作为附加参数，具体值为当前计算机时间，格式为"yyyy-MM-dd hh:mm:ss"
// #     "TC":查询烟条状态，当发送烟炉的查询烟条状态命令时，无需填写附加参数
// #     "QC":查询天气情况，当发送烟炉的查询天气情况命令时，无需填写附加参数
// # '''
// class RY_Stove_Cmd(Structure):
//   _fields_ = [
//       ("localUnitID", c_char * 20),           # 本地单位，如：110000000
//       ("localUserCode", c_char * 20),         # 本地用户，如：PYCLIENT
//       ("stoveID", c_char * 20),               # 烟炉ID，如：110108XT
//       ("cmd", c_char * 20),                   # 烟炉控制命令，
//       ("iPara", c_uint),                      # 整数附加参数
//       ("sPara", c_char * 64)                  # 字符串附加参数
//   ]

/*烟炉接口start，注意接口调用后返回的结果是通过websocket返回，而不是通过接口直接返回*/
export function 即时点火(stoveID:string,count:number=1){
  return request({
    url: 'ry_api/api/stove/send_cmd',
    method: 'post',
    data:{
      "localUnitID": "110000000",
      "localUserCode": "PYCLIENT",
      "stoveID": stoveID,//110108XT2
      "cmd": "JF",
      "iPara": count,//点火数量
      "sPara": ''
    }
  })
}
export function 烟条装载(stoveID:string,sPara:'996'|'999'|'001'){
  return request({
    url: 'ry_api/api/stove/send_cmd',
    method: 'post',
    data:{
      "localUnitID": "110000000",
      "localUserCode": "PYCLIENT",
      "stoveID": stoveID,//110108XT2
      "cmd": "YZ",
      "iPara": 0,
      sPara//996第一个烟炉，999全部烟炉，001第一根烟条
    }
  })
}
export function 烟条卸载(stoveID:string,unloadIndex:number){
  return request({
    url: 'ry_api/api/stove/send_cmd',
    method: 'post',
    data:{
      "localUnitID": "110000000",
      "localUserCode": "PYCLIENT",
      "stoveID": stoveID,//110108XT2
      "cmd": "YX",
      "iPara": unloadIndex,//表示要卸载的烟条序号，取值为001-056//996表示第一个烟炉，999表示全部烟炉
      "sPara": ''
    }
  })
}
export function 烟炉的时间查询(stoveID:string){
  return request({
    url: 'ry_api/api/stove/send_cmd',
    method: 'post',
    data:{
      "localUnitID": "110000000",
      "localUserCode": "PYCLIENT",
      "stoveID": stoveID,//110108XT2
      "cmd": "XC",
      "iPara": 0,
      "sPara": ''
    }
  })
}
export function 给烟炉设置时间(stoveID:string,time:string){
  return request({
    url: 'ry_api/api/stove/send_cmd',
    method: 'post',
    data:{
      "localUnitID": "110000000",
      "localUserCode": "PYCLIENT",
      "stoveID": stoveID,//110108XT2
      "cmd": "XS",
      "iPara": 0,
      "sPara": time
    }
  })
}
export function 查询烟条状态(stoveID:string){
  return request({
    url: 'ry_api/api/stove/send_cmd',
    method: 'post',
    data:{
      "localUnitID": "110000000",
      "localUserCode": "PYCLIENT",
      "stoveID": stoveID,//110108XT2
      "cmd": "TC",
      "iPara": 0,
      "sPara": ''
    }
  })
}
export function 查询天气情况(stoveID:string){
  return request({
    url: 'ry_api/api/stove/send_cmd',
    method: 'post',
    data:{
      "localUnitID": "110000000",
      "localUserCode": "PYCLIENT",
      "stoveID": stoveID,//110108XT2
      "cmd": "QC",
      "iPara": 0,
      "sPara": ''
    }
  })
}
/*烟炉接口end*/
export function 空域申请批准(data){
  return request({
    url:'ry_api/api/work/send/accept',
    method:'post',
    data:{
      "workID": data.strWorkID,
      "zydID": data.strID,
      "replyUnitID": "110000000",//北京气象局
      "workReceiveUnit": data.strID,
      "workReceiveUser": "",
      "workBeginTime": moment().format('YYYY-MM-DD'+' '+data.workBeginTime),
      "workTimeLen": data.workTimeLen*60,
      "beginDirection": data.beginDirection,
      "endDirection": data.endDirection,
    }
  })
}
export function 空域申请拒绝(data){
  return request({
    url: 'ry_api/api/work/send/reject',
    method: 'post',
    data:{
      "workID": data.strWorkID,
      "zydID": data.strID,
      "replyUnitID": "110000000",
      "workReceiveUnit": data.strID,
      "workReceiveUser": "",
      "delayTimeLen": data.delayTimeLen,
      "denyCode": data.denyCode,
    }
  })
}

export function 完成信息查询({page,size,range,zydID}:{page:number,size:number,range?:any,zydID?:string}={page:1,size:10},signal?:AbortSignal){
  const data = {
    select:['o.*','z.strName as strZydIDName'],
    where:[
      {
        relation:'AND',
        field:'isquxianconfirmed',
        relationship:'=',
        condition:'1'
      }
    ],
    orderby:[
      {
        field:'beginTm',
        order:'desc',
      }
    ],
    distinct:false,
    offset:(page-1)*size,
    limit:size,
  }
  if(range){
    data.where.push({
      relation:'AND',
      field:'beginTm',
      relationship:'>=',
      condition:moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      relation:'AND',
      field:'beginTm',
      relationship:'<=',
      condition:moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
    })
  }
  if(zydID){
    data.where.push({
      relation:'AND',
      field:'strZydID',
      relationship:'=',
      condition:zydID
    })
  }
  return request({
    signal,
    url: 'backend/db/overinfo o left join  `zydpara` z on o.strZydID=z.strID?'+database2,
    method: 'post',
    data,
  })
}
export function 完成信息查询中一段时间内作业点数据(range,signal?:AbortSignal){
  const data = {
    select:['o.strZydID as strZydID','z.strName as strZydIDName','count(*) count','max(o.beginTm) maxBeginTm'],
    where:[
      {
        relation:'AND',
        field:'isquxianconfirmed',
        relationship:'=',
        condition:'1'
      },
      {
        relation:'AND',
        field:'z.strName',
        relationship:'IS NOT',
        condition:null
      },
      {
        relation:'AND',
        field:'o.strZydID',
        relationship:'IS NOT',
        condition:null
      }
    ],
    groupby:['o.strZydID','z.strName'],
    orderby:[
      {
        field:'maxBeginTm',
        order:'desc',
      }
    ],
    distinct:false,
    offset:0,
    limit:0,
  }
  if(range){
    data.where.push({
      relation:'AND',
      field:'o.beginTm',
      relationship:'>=',
      condition:moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      relation:'AND',
      field:'o.beginTm',
      relationship:'<=',
      condition:moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
    })
  }
  return request({
    signal,
    url: 'backend/db/overinfo o LEFT JOIN zydpara z ON o.strZydID=z.strID?'+database2,
    method: 'post',
    data,
  })
}
export function 获取作业点ID数据(){
  return request({
    url: 'backend/db/zydpara?'+database2,
    method: 'post',
    data:{
      select:['strID','strName','strPos'],
      where:[],
      distinct:true,
      offset:0,
      limit:0,
    }
  })
}
export function 判断是否有完成信息(workID){
  return request({
    url: 'backend/db/overinfo?'+database2,
    method: 'post',
    data:{
      select:['workID'],
      where:[
        {
          relation:'AND',
          field:'workID',
          relationship:'=',
          condition:workID
        }
      ],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
}
export function 判断是否有完成信息确认(workID){
  return request({
    url: 'backend/db/overinfo_confirmed?'+database2,
    method: 'post',
    data:{
      select:['workID'],
      where:[
        {
          relation:'AND',
          field:'workID',
          relationship:'=',
          condition:workID
        }
      ],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
}
export function 保存完成信息和完成信息确认(完成信息数据){
  return request({
    url: 'backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "INSERT INTO `overinfo` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`, `isquxianconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
        "INSERT INTO `overinfo_confirmed` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, b'"+完成信息数据.isconfirmed+"');",
      ],
      vals:[
        [
          完成信息数据.workID,
          完成信息数据.strZydID,
          完成信息数据.tagPos,
          完成信息数据.beginTm,
          完成信息数据.timeLen,
          完成信息数据.workType,
          完成信息数据.workTool,
          完成信息数据.numPD,
          完成信息数据.numHJ,
          完成信息数据.numYT,
          完成信息数据.numOther,
          完成信息数据.shootDirect,
          完成信息数据.shootAngle,
          完成信息数据.workArea,
          完成信息数据.beforeWeather,
          完成信息数据.afterWeather,
          完成信息数据.workEffect,
          完成信息数据.recordTm,
          完成信息数据.isconfirmed,
          完成信息数据.isquxianconfirmed,
        ],
        [
          完成信息数据.workID,
          完成信息数据.strZydID,
          完成信息数据.tagPos,
          完成信息数据.beginTm,
          完成信息数据.timeLen,
          完成信息数据.workType,
          完成信息数据.workTool,
          完成信息数据.numPD,
          完成信息数据.numHJ,
          完成信息数据.numYT,
          完成信息数据.numOther,
          完成信息数据.shootDirect,
          完成信息数据.shootAngle,
          完成信息数据.workArea,
          完成信息数据.beforeWeather,
          完成信息数据.afterWeather,
          完成信息数据.workEffect,
          完成信息数据.recordTm,
        ],
      ]
    }
  })
}
export function 通过workID获取完成信息(workID){
  return request({
    url: 'backend/db/overinfo o left join zydpara z on o.strZydID = z.strID?'+database2,
    method: 'post',
    data:{
      select:['o.*','z.strName as strZydIDName'],
      where:[
        {
          relation:'AND',
          field:'workID',
          relationship:'=',
          condition:workID
        }
      ],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
}
export function 完成信息确认(完成信息数据){
  return request({
    url: 'backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "INSERT INTO `overinfo` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`, `isquxianconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
        ON DUPLICATE KEY UPDATE \
        `workID`=VALUES(`workID`),\
        `strZydID`=VALUES(`strZydID`),\
        `tagPos`=VALUES(`tagPos`),\
        `beginTm`=VALUES(`beginTm`),\
        `timeLen`=VALUES(`timeLen`),\
        `workType`=VALUES(`workType`),\
        `workTool`=VALUES(`workTool`),\
        `numPD`=VALUES(`numPD`),\
        `numHJ`=VALUES(`numHJ`),\
        `numYT`=VALUES(`numYT`),\
        `numOther`=VALUES(`numOther`),\
        `shootDirect`=VALUES(`shootDirect`),\
        `shootAngle`=VALUES(`shootAngle`),\
        `workArea`=VALUES(`workArea`),\
        `beforeWeather`=VALUES(`beforeWeather`),\
        `afterWeather`=VALUES(`afterWeather`),\
        `workEffect`=VALUES(`workEffect`),\
        `recordTm`=VALUES(`recordTm`),\
        `isconfirmed`=VALUES(`isconfirmed`),\
        `isquxianconfirmed`=VALUES(`isquxianconfirmed`)\
        ;",
        "INSERT INTO `overinfo_confirmed` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, b'"+完成信息数据.isconfirmed+"') \
        ON DUPLICATE KEY UPDATE \
        `workID` = VALUES(`workID`), \
        `strZydID` = VALUES(`strZydID`), \
        `tagPos` = VALUES(`tagPos`), \
        `beginTm` = VALUES(`beginTm`), \
        `timeLen` = VALUES(`timeLen`), \
        `workType` = VALUES(`workType`), \
        `workTool` = VALUES(`workTool`), \
        `numPD` = VALUES(`numPD`), \
        `numHJ` = VALUES(`numHJ`), \
        `numYT` = VALUES(`numYT`), \
        `numOther` = VALUES(`numOther`), \
        `shootDirect` = VALUES(`shootDirect`), \
        `shootAngle` = VALUES(`shootAngle`), \
        `workArea` = VALUES(`workArea`), \
        `beforeWeather` = VALUES(`beforeWeather`), \
        `afterWeather` = VALUES(`afterWeather`), \
        `workEffect` = VALUES(`workEffect`), \
        `recordTm` = VALUES(`recordTm`), \
        `isconfirmed` = VALUES(`isconfirmed`) \
        ;",
      ],
      vals:[
        [
          完成信息数据.workID,
          完成信息数据.strZydID,
          完成信息数据.tagPos,
          完成信息数据.beginTm,
          完成信息数据.timeLen,
          完成信息数据.workType,
          完成信息数据.workTool,
          完成信息数据.numPD,
          完成信息数据.numHJ,
          完成信息数据.numYT,
          完成信息数据.numOther,
          完成信息数据.shootDirect,
          完成信息数据.shootAngle,
          完成信息数据.workArea,
          完成信息数据.beforeWeather,
          完成信息数据.afterWeather,
          完成信息数据.workEffect,
          完成信息数据.recordTm,
          完成信息数据.isconfirmed,
          完成信息数据.isquxianconfirmed,
        ],
        [
          完成信息数据.workID,
          完成信息数据.strZydID,
          完成信息数据.tagPos,
          完成信息数据.beginTm,
          完成信息数据.timeLen,
          完成信息数据.workType,
          完成信息数据.workTool,
          完成信息数据.numPD,
          完成信息数据.numHJ,
          完成信息数据.numYT,
          完成信息数据.numOther,
          完成信息数据.shootDirect,
          完成信息数据.shootAngle,
          完成信息数据.workArea,
          完成信息数据.beforeWeather,
          完成信息数据.afterWeather,
          完成信息数据.workEffect,
          完成信息数据.recordTm,
        ],
      ]
    }
  })
}
export function 通过workID删除完成信息和完成信息确认(workID){
  return request({
    url: 'backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "DELETE FROM `overinfo` WHERE `workID` = ?;",
        "DELETE FROM `overinfo_confirmed` WHERE `workID` = ?;",
      ],
      vals:[
        [
          workID
        ],
        [
          workID
        ],
      ]
    }
  })
}
export function 通过workID恢复完成信息(workID){
  return request({
    url: 'backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "UPDATE `overinfo` SET `isconfirmed` = b'0' WHERE `workID` = ?;",
        "DELETE FROM `overinfo_confirmed` WHERE `workID` = ?;",
      ],
      vals:[
        [
          workID
        ],
        [
          workID
        ],
      ]
    }
  })
}
export function 获取所有烟炉的预约点火信息(){
  return request({
    url: 'backend/db/appoint?'+database2,
    method: 'post',
    data:{
      select:['*'],
      where:[],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
}
export function 预约点火({beginTime,interval,flare,times,stoveID}){
  return request({
    url: 'backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "INSERT INTO `appoint` (`beginTime`, `interval`, `flare`, `times`, `stoveID`) VALUES (?,?,?,?,?);",
      ],
      vals:[
        [
          beginTime,
          interval,
          flare,
          times,
          stoveID,
        ]
      ]
    }
  })
}
export function 取消预约点火(stoveID){
  return request({
    url: 'backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "DELETE FROM `appoint` WHERE `stoveID` = ?;",
      ],
      vals:[
        [
          stoveID,
        ]
      ]
    }
  })
}

export function 判断是否可以点火(stoveID){
  return request({
    url: 'backend/transaction?'+database2,
    method: 'post',
    data:{
      sqls:[
        "UPDATE `appoint` SET `begun` = b'1' WHERE `stoveID` = ? AND `begun` = b'0';",
      ],
      vals:[
        [
          stoveID,
        ]
      ]
    }
  })
}

export function 所有站点的视频信息(){
  return request({
    url:'/videoLive/videoQuery',
    method:'get',
    params:{
      region:'beijing'
    }
  })
}
export function m3u8(indexCode){
  return request({
    url:'/videoLive/videoBySite',
    method:'get',
    params:{
      indexCode:indexCode,
      region:'beijing'
    }
  })
}
//红外云图：%s
export function 红外云图(){
  return new Promise((resolve,reject)=>{
    request({
      url:'/zcgk/api/v1/satellite/product/getLocalFileList',
      method:'get',
      params:{
        type:'WMC-K.0008.0010.T',
        order:'desc'
      }
    }).then(({data})=>{
      if(data.data.dateList.length>0){
        request({
          url:'/zcgk/api/v1/satellite/product/getProduct',
          method:'get',
          params:{
            productType:'WMC-K.0008.0010.T',
            fileName:data.data.dateList[0].fileName,
          }
        }).then(({data})=>{
          resolve(data)
        }).catch(e=>{
          reject(e)
        })
      }else{
        reject('暂无红外云图')
      }
    }).catch(e=>{
      reject(e)
    })
  })
}
//全国拼图V3.0：组合反射率
export function 组合反射率(){
  return new Promise((resolve,reject)=>{
    request({
      url:'/zcgk/api/v1/rada/radarV3Product/findDateList',
      method:'get',
      params:{
        radarType:'ACHN_CREF',
        imgType:'RADA_L3_MST_CREF_QC',
        order:'desc'
      }
    }).then(({data})=>{
      if(data.data.dateList.length>0){
        request({
          url:'/zcgk/api/v1/rada/radarV3Product/getProduct',
          method:'get',
          params:{
            fileName:data.data.dateList[0].fileName,
            productType:'RADA_L3_MST_CREF_QC',
            smooth:false
          }
        }).then(({data})=>{
          resolve(data)
        }).catch(e=>{
          reject(e)
        })
      }else{
        reject('暂无组合反射率')
      }
    }).catch(e=>{
      reject(e)
    })
  })
}
//1km分辨率多源融合实况分析产品
export function 多源融合实况分析产品(){
  return new Promise((resolve,reject)=>{
    request({
      url:'/zcgk/api/v1/cmpas1kmProduct/findDateList',
      method:'get',
      params:{
        type:'ss',
        product:'SURF_CMPAS_MUL_1KM_RT',
        order:'desc'
      }
    }).then(({data})=>{
      if(data.data.length>0){
        request({
          url:'/zcgk/api/v1/cmpas1kmProduct/getProduct',
          method:'get',
          params:{
            productType:'SURF_CMPAS_MUL_1KM_RT',
            fileName:data.data[0].fileName,
          }
        }).then(({data})=>{
          resolve(data)
        }).catch(e=>{
          reject(e)
        })
      }else{
        reject('暂无多源融合实况分析产品')
      }
    }).catch(e=>{
      reject(e)
    })
  })
}