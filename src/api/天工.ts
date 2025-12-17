import moment from 'moment'
import request from '../utils/request'
import { useSettingStore } from '~/stores/setting'
import { wrapKeys } from '~/tools'
import { v4 as uuidv4 } from 'uuid';

//公司
// let dbConfig = 'host=192.168.0.240&port=3306&user=root&password=mysql'
// let database1 = `${dbConfig}&database=union`
// let database2 = `${dbConfig}&database=BEPK_RYB_GSYTHPT&type=xugu`

//北京市
// dbConfig = "host=10.224.153.90&port=3306&user=bjryb&password=ryb115"
// database1 = `${dbConfig}&database=union`
// database2 = `${dbConfig}&database=BEPK_RYB_GSYTHPT`

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
    url: '/backend/db/default',
    method: 'post',
    headers:{
      table:'airport',
    },
    data:{
      select:['*'],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
  // return request({
  //   url: '/qt/select/airport',
  //   method: 'post',
  //   data:{
  //       "select": [
  //       ],
  //       "where": [
  //       ],
  //       "orderby": [
  //       ]
  //   }
  // })
}
export function 华北飞行区域(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      table:'fly_area',
    },
    data:{
      select:['*'],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
  // return request({
  //   url: '/qt/select/flyarea?'+database1,
  //   method: 'post',
  //   data:{
  //     "select": [
  //     ],
  //     "where": [
  //     ],
  //     "orderby": [
  //     ]
  //   }
  // })
}
export function 烟炉数据() {
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      table:'stoves',
    },
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
export function 协同作业点(){
    return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      table:'`zydpara` z left join `units` u1 on z.strMgrUnit = u1.strID left join `units` u2 on z.strRelayUnit = u2.strID',
    },
    data:{
      select:["z.*","u1.strName as `strMgrUnitName`","u2.strName as `strRelayUnitName`"],
      where:[
        {
          "relation": "AND",
          "field": "z.strID",
          "relationship": "NOT LIKE",
          "condition": getMask()
        },
        {
          "relation": "AND",
          "field": "z.strWeapon",
          "relationship": "!=",
          "condition": "3"
        },
        {
          "relation": "AND",
          "field": "z.strIP",
          "relationship": "!=",
          "condition": '1'
        },
      ],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
  // return request({
  //   url:'/qt/select/zydpara',
  //   method:'post',
  //   data:{
  //     "where": [
  //       {
  //         "relation": "AND",
  //         "field": "strID",
  //         "relationship": "NOT LIKE",
  //         "condition": getMask()
  //       },
  //       {
  //         "relation": "AND",
  //         "field": "strWeapon",
  //         "relationship": "!=",
  //         "condition": "3"
  //       },
  //     ]
  //   }
  // })
}
export function 作业点(){
  // return request({
  //   url: '/backend/transaction?'+database2,
  //   method: 'post',
  //   data:{
  //     sqls:[
  //       "select z.*,u1.strName as strMgrUnitName,u2.strName as strRelayUnitName FROM `zydpara` z left join `units` u1 on z.strMgrUnit = u1.strID left join `units` u2 on z.strRelayUnit = u2.strID WHERE z.strID LIKE '110%' AND z.strWeapon!='3'",
  //     ]
  //   }
  // })
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      table:'`zydpara` z left join `units` u1 on z.strMgrUnit = u1.strID left join `units` u2 on z.strRelayUnit = u2.strID',
    },
    data:{
      select:["z.*","u1.strName as `strMgrUnitName`","u2.strName as `strRelayUnitName`"],
      where:[
        {
          "relation": "AND",
          "field": "z.strID",
          "relationship": "LIKE",
          "condition": getMask()
        },
        {
          "relation": "AND",
          "field": "z.strWeapon",
          "relationship": "!=",
          "condition": "3"
        },
      ],
      distinct:false,
      offset:0,
      limit:0,
    }
  })
  // return request({
  //   url:'/qt/select/zydpara',
  //   method:'post',
  //   data:{
  //     "where": [
  //       {
  //         "relation": "AND",
  //         "field": "strID",
  //         "relationship": "LIKE",
  //         "condition": getMask()
  //       },
  //       {
  //         "relation": "AND",
  //         "field": "strWeapon",
  //         "relationship": "!=",
  //         "condition": "3"
  //       },
  //       {
  //         "relation": "AND",
  //         "field": "strIP",
  //         "relationship": "!=",
  //         "condition": '1'
  //       },
  //     ]
  //   }
  // })
}
export function 当前作业查询(signal:AbortSignal){
  return request({
    url:'/qt/select/zyddata',
    method:'post',
    signal,
    data:{
      "where": [
        {
          "relation": "AND",
          "field": "strZydID",
          "relationship": "LIKE",
          "condition": getMask()
        },
      ],
      "orderby": [
        {
          "field": "tmBeginApply",
          "order": "desc",
        }
      ]
    }
  })
}
export function 历史作业查询(){
  return request({
    url:'/qt/select/zydhisdata',
    method:'post',
    data:{
      "where": [
        {
          "relation": "AND",
          "field": "strZydID",
          "relationship": "LIKE",
          "condition": getMask()
        },
        {
            "relation": "AND",
            "field": "tmBeginApply",
            "relationship": "<=",
            "condition": `${moment().format('YYYY-MM-DD')} 23:59:59`
        },
        {
            "relation": "AND",
            "field": "tmBeginApply",
            "relationship": ">=",
            "condition": `${moment().format('YYYY-MM-DD')} 00:00:00`
        }
      ],
      "orderby": [
        {
          "field": "tmBeginApply",
          "order": "desc"
        }
      ]
    }
  })
}

export function 作业状态数据(signal:AbortSignal){
  return request({
    signal,
    url: '/backend/transaction',
    method: 'post',
    data:{
      sqls: [
        "SELECT z.*,u1.strName as `strATCUnitIDName`,u2.strName as `strUpApplyUnitName` FROM `zyddata` z left join `units` u1 on z.strATCUnitID = u1.strID left join `units` u2 on z.strUpApplyUnit = u2.strID where strApplyUnit IS NOT NULL ORDER BY z.tmBeginApply DESC",
        `SELECT z.*,u1.strName AS strATCUnitIDName,u2.strName AS strUpApplyUnitName FROM zydhisdata z LEFT JOIN units u1 ON z.strATCUnitID = u1.strID LEFT JOIN units u2 ON z.strUpApplyUnit = u2.strID WHERE strApplyUnit IS NOT NULL AND '${moment().format('YYYY-MM-DD 00:00:00')}' <= z.tmBeginApply AND z.tmBeginApply < '${moment().add(1,'day').format('YYYY-MM-DD 00:00:00')}' ORDER BY z.tmBeginApply DESC`,//当天的数据
        // "SELECT z.*,u.strName as unitName FROM `zydhisdata` z left join `units` u on z.strATCUnitID=u.strID where DATE_FORMAT(z.tmBeginApply,'%Y-%m-%d') = DATE_FORMAT((select MAX(DATE(tmBeginApply)) from zydhisdata),'%Y-%m-%d')",//最后一天的数据
      ],
    }
  })
}
export function 修改作业状态数据(ubyStatus:number,strWorkID:string){
  return request({
    url: '/backend/transaction',
    method: 'post',
    data:{
      sqls: [
        `UPDATE zyddata SET ubyStatus = ${ubyStatus} WHERE strWorkID = '${strWorkID}'`,
        `UPDATE zydhisdata SET ubyStatus = ${ubyStatus} where strWorkID = '${strWorkID}'`
      ],
    }
  })
}
export function ADSB(){
  return request({
    url: '/adsb/getPlaneInfo',
    timeout:10000,
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
      "replyUnitID": "510000000",//北京气象局
      "workReceiveUnit": data.strID,
      "workReceiveUser": "",
      "workBeginTime": moment().format('YYYY-MM-DD'+' '+data.workBeginTime),
      "workTimeLen": data.workTimeLen*60,
      "beginDirection": data.beginDirection,
      "endDirection": data.endDirection,
    }
  })
}
export function 空域申请移除(data:Array<{strWorkID:string}>) {
  return request({
    url:'/backend/db/default',
    method:'delete',
    headers:{
      table:'zyddata',
    },
    data
  })
  // return request({
  //   url:'/qt/delete/zyddata',
  //   method:'post',
  //   data: {
  //     //一般根据主键删除即可
  //     "where": [
  //         {
  //             "relation": "AND",
  //             "field": "strWorkID",
  //             "relationship": "=",
  //             "condition": strWorkID
  //         }
  //     ]
  //   }
  // })
}
export function 空域申请拒绝(data){
  return request({
    url: 'ry_api/api/work/send/reject',
    method: 'post',
    data:{
      "workID": data.strWorkID,
      "zydID": data.strID,
      "replyUnitID": "510000000",
      "workReceiveUnit": data.strID,
      "workReceiveUser": "",
      "delayTimeLen": data.delayTimeLen,
      "denyCode": data.denyCode,
    }
  })
}

export function 完成信息查询({page,size,range,zydID}:{page:number,size:number,range?:any,zydID?:string}={page:1,size:10},signal?:AbortSignal){
  const data = {
    select:['o.*','z.strName as `strZydIDName`'],
    "where": new Array<any>(),
    "orderby": [
      'beginTm DESC'
    ],
    distinct:false,
    offset:(page-1)*size,
    limit:size,
    simple:0
  }
  if(getMask()=='%%'){//北京人影办显示的数据需要满足已经区县确认
    data.where.push(
      {
        "relation": "AND",
        "field": "isquxianconfirmed",
        "relationship": "=",
        "condition": "1"
      },
      {
        "relation": "AND",
        "field": "strZydID",
        "relationship": "like",
        "condition": getMask()
      }
    )
  }else{
    data.where.push(
      {
        "relation": "AND",
        "field": "strZydID",
        "relationship": "like",
        "condition": getMask()
      }
    )
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
    headers:{
      'table':'overinfo o left join  `zydpara` z on o.strZydID=z.strID'
    },
    url: 'backend/db/default',
    method: 'post',
    data,
  })

  // return request({
  //   signal,
  //   url: '/qt/select/overinfo',
  //   method: 'post',
  //   data,
  // })
}
export function 完成信息查询中一段时间内作业点数据(range,signal?:AbortSignal){
  const data = {
    select:['o.strZydID as `strZydID`','z.strName as `strZydIDName`','count(*) `count`','max(o.beginTm) `maxBeginTm`'],
    where:[
      {
        relation:'AND',
        field:'isquxianconfirmed',
        relationship:'=',
        condition:'1'
      },
      {
        "relation": "AND",
        "field": "o.strZydID",
        "relationship": "like",
        "condition": getMask()
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
      'maxBeginTm DESC'
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
    url: 'backend/db/default',
    headers:{
      table:'overinfo o LEFT JOIN zydpara z ON o.strZydID=z.strID'
    },
    method: 'post',
    data,
  })
}
export function 获取作业点ID数据(){
  return request({
    url: 'backend/db/zydpara',
    method: 'post',
    data:{
      select:['strID','strName','strPos'],
      where:[
        {
          "relation": "AND",
          "field": "strID",
          "relationship": "like",
          "condition": getMask()
        }
      ],
      distinct:true,
      offset:0,
      limit:0,
    }
  })
}
// export function 完成信息查询中一段时间内作业点数据(range,signal?:AbortSignal){
//   const data = {
//     "select":[
//         "strZydID",
//         "COUNT(*) AS Num",
//         "MAX(beginTm) AS Last"
//     ],
//     "where": [
//         {
//             "relation": "AND",
//             "field": "isquxianconfirmed",
//             "relationship": "=",
//             "condition": "1"
//         },
//         {
//             "relation": "AND",
//             "field": "strZydID",
//             "relationship": "like",
//             "condition": getMask()
//         }
//     ],
//     "groupby":[
//         "strZydID"
//     ],
//     "orderby": [
//         {
//             "field": "Last",
//             "order": "desc"
//         }
//     ],
//     "distinct": false,
//     "simple":1
//   }
//   if(range){
//     data.where.push({
//       relation:'AND',
//       field:'beginTm',
//       relationship:'>=',
//       condition:moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
//     },
//     {
//       relation:'AND',
//       field:'beginTm',
//       relationship:'<=',
//       condition:moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
//     })
//   }
//   return request({
//     signal,
//     url:'/qt/select/overinfo',
//     method:'post',
//     data
//   })
// }
export function 判断是否有完成信息(workID){
  return request({
    url: 'backend/db/default',
    method: 'post',
    headers:{
      table:'overinfo'
    },
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
    url: 'backend/db/default',
    method: 'post',
    headers:{
      table:'overinfo_confirmed'
    },
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
// export function 保存完成信息和完成信息确认(完成信息数据){
//   return request({
//     url: 'backend/transaction?'+database2,
//     method: 'post',
//     data:{
//       sqls:[
//         "INSERT INTO `overinfo` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`, `isquxianconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
//         "INSERT INTO `overinfo_confirmed` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, b'"+完成信息数据.isconfirmed+"');",
//       ],
//       vals:[
//         [
//           完成信息数据.workID,
//           完成信息数据.strZydID,
//           完成信息数据.tagPos,
//           完成信息数据.beginTm,
//           完成信息数据.timeLen,
//           完成信息数据.workType,
//           完成信息数据.workTool,
//           完成信息数据.numPD,
//           完成信息数据.numHJ,
//           完成信息数据.numYT,
//           完成信息数据.numOther,
//           完成信息数据.shootDirect,
//           完成信息数据.shootAngle,
//           完成信息数据.workArea,
//           完成信息数据.beforeWeather,
//           完成信息数据.afterWeather,
//           完成信息数据.workEffect,
//           完成信息数据.recordTm,
//           完成信息数据.isconfirmed,
//           完成信息数据.isquxianconfirmed,
//         ],
//         [
//           完成信息数据.workID,
//           完成信息数据.strZydID,
//           完成信息数据.tagPos,
//           完成信息数据.beginTm,
//           完成信息数据.timeLen,
//           完成信息数据.workType,
//           完成信息数据.workTool,
//           完成信息数据.numPD,
//           完成信息数据.numHJ,
//           完成信息数据.numYT,
//           完成信息数据.numOther,
//           完成信息数据.shootDirect,
//           完成信息数据.shootAngle,
//           完成信息数据.workArea,
//           完成信息数据.beforeWeather,
//           完成信息数据.afterWeather,
//           完成信息数据.workEffect,
//           完成信息数据.recordTm,
//         ],
//       ]
//     }
//   })
// }
export function 增加完成信息(data){
  return request({
    url: 'backend/db/default',
    method: 'put',
    headers:{
      table:'overinfo'
    },
    data:[wrapKeys(data,key=>key=='workID')]
  })
  // return request({
  //   url:'/qt/insert/overinfo',
  //   method:'post',
  //   data
  // })
}
export function 增加完成信息确认(data){
  return request({
    url: 'backend/db/default',
    method: 'put',
    headers:{
      table:'overinfo_confirmed'
    },
    data:[wrapKeys(data,key=>key=='workID')]
  })
  // return request({
  //   url:'/qt/insert/overinfo_confirm',
  //   method:'post',
  //   data
  // })
}
export function 通过workID获取完成信息(workID){
  return request({
    url: 'backend/db/overinfo o left join zydpara z on o.strZydID = z.strID',
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
// export function 完成信息确认(完成信息数据){
//   return request({
//     url: 'backend/transaction?'+database2,
//     method: 'post',
//     data:{
//       sqls:[
//         "INSERT INTO `overinfo` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`, `isquxianconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) \
//         ON DUPLICATE KEY UPDATE \
//         `workID`=VALUES(`workID`),\
//         `strZydID`=VALUES(`strZydID`),\
//         `tagPos`=VALUES(`tagPos`),\
//         `beginTm`=VALUES(`beginTm`),\
//         `timeLen`=VALUES(`timeLen`),\
//         `workType`=VALUES(`workType`),\
//         `workTool`=VALUES(`workTool`),\
//         `numPD`=VALUES(`numPD`),\
//         `numHJ`=VALUES(`numHJ`),\
//         `numYT`=VALUES(`numYT`),\
//         `numOther`=VALUES(`numOther`),\
//         `shootDirect`=VALUES(`shootDirect`),\
//         `shootAngle`=VALUES(`shootAngle`),\
//         `workArea`=VALUES(`workArea`),\
//         `beforeWeather`=VALUES(`beforeWeather`),\
//         `afterWeather`=VALUES(`afterWeather`),\
//         `workEffect`=VALUES(`workEffect`),\
//         `recordTm`=VALUES(`recordTm`),\
//         `isconfirmed`=VALUES(`isconfirmed`),\
//         `isquxianconfirmed`=VALUES(`isquxianconfirmed`)\
//         ;",
//         "INSERT INTO `overinfo_confirmed` (`workID`, `strZydID`, `tagPos`, `beginTm`, `timeLen`, `workType`, `workTool`, `numPD`, `numHJ`, `numYT`, `numOther`, `shootDirect`, `shootAngle`, `workArea`, `beforeWeather`, `afterWeather`, `workEffect`, `recordTm`, `isconfirmed`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, b'"+完成信息数据.isconfirmed+"') \
//         ON DUPLICATE KEY UPDATE \
//         `workID` = VALUES(`workID`), \
//         `strZydID` = VALUES(`strZydID`), \
//         `tagPos` = VALUES(`tagPos`), \
//         `beginTm` = VALUES(`beginTm`), \
//         `timeLen` = VALUES(`timeLen`), \
//         `workType` = VALUES(`workType`), \
//         `workTool` = VALUES(`workTool`), \
//         `numPD` = VALUES(`numPD`), \
//         `numHJ` = VALUES(`numHJ`), \
//         `numYT` = VALUES(`numYT`), \
//         `numOther` = VALUES(`numOther`), \
//         `shootDirect` = VALUES(`shootDirect`), \
//         `shootAngle` = VALUES(`shootAngle`), \
//         `workArea` = VALUES(`workArea`), \
//         `beforeWeather` = VALUES(`beforeWeather`), \
//         `afterWeather` = VALUES(`afterWeather`), \
//         `workEffect` = VALUES(`workEffect`), \
//         `recordTm` = VALUES(`recordTm`), \
//         `isconfirmed` = VALUES(`isconfirmed`) \
//         ;",
//       ],
//       vals:[
//         [
//           完成信息数据.workID,
//           完成信息数据.strZydID,
//           完成信息数据.tagPos,
//           完成信息数据.beginTm,
//           完成信息数据.timeLen,
//           完成信息数据.workType,
//           完成信息数据.workTool,
//           完成信息数据.numPD,
//           完成信息数据.numHJ,
//           完成信息数据.numYT,
//           完成信息数据.numOther,
//           完成信息数据.shootDirect,
//           完成信息数据.shootAngle,
//           完成信息数据.workArea,
//           完成信息数据.beforeWeather,
//           完成信息数据.afterWeather,
//           完成信息数据.workEffect,
//           完成信息数据.recordTm,
//           完成信息数据.isconfirmed,
//           完成信息数据.isquxianconfirmed,
//         ],
//         [
//           完成信息数据.workID,
//           完成信息数据.strZydID,
//           完成信息数据.tagPos,
//           完成信息数据.beginTm,
//           完成信息数据.timeLen,
//           完成信息数据.workType,
//           完成信息数据.workTool,
//           完成信息数据.numPD,
//           完成信息数据.numHJ,
//           完成信息数据.numYT,
//           完成信息数据.numOther,
//           完成信息数据.shootDirect,
//           完成信息数据.shootAngle,
//           完成信息数据.workArea,
//           完成信息数据.beforeWeather,
//           完成信息数据.afterWeather,
//           完成信息数据.workEffect,
//           完成信息数据.recordTm,
//         ],
//       ]
//     }
//   })
// }
// export function 通过workID删除完成信息和完成信息确认(workID){
//   return request({
//     url: 'backend/transaction?'+database2,
//     method: 'post',
//     data:{
//       sqls:[
//         "DELETE FROM `overinfo` WHERE `workID` = ?;",
//         "DELETE FROM `overinfo_confirmed` WHERE `workID` = ?;",
//       ],
//       vals:[
//         [
//           workID
//         ],
//         [
//           workID
//         ],
//       ]
//     }
//   })
// }
export function 修改完成信息(data){
  return request({
    url: 'backend/db/default',
    method: 'put',
    headers:{
      table:'overinfo'
    },
    data:[wrapKeys(data,(key)=>key=='workID')],
  })
  // return request({
  //   url:'/qt/update/overinfo',
  //   method:'post',
  //   data,
  // })
}
export function 删除完成信息(workID){
  console.log(workID)
  return request({
    url: 'backend/db/default',
    method: 'delete',
    headers:{
      table:'overinfo'
    },
    data: [{workID}]
  })
  // return request({
  //   url:'/qt/delete/overinfo',
  //   method:'post',
  //   data: {
  //       //一般根据主键删除即可
  //       "where": [
  //           {
  //               "relation": "AND",
  //               "field": "workID",
  //               "relationship": "=",
  //               "condition": workID
  //           }
  //       ]
  //   }
  // })
}
export function 删除完成信息确认(workID){
  return request({
    url: 'backend/db/default',
    method: 'delete',
    headers:{
      table:'overinfo_confirmed'
    },
    data: [{workID}]
  })
  // return request({
  //   url:'/qt/delete/overinfo_confirm',
  //   method:'post',
  //   data: {
  //       //一般根据主键删除即可
  //       "where": [
  //           {
  //               "relation": "AND",
  //               "field": "workID",
  //               "relationship": "=",
  //               "condition": workID
  //           }
  //       ]
  //   }
  // })
}
export function 通过workID恢复完成信息(workID){
  return request({
    url: 'backend/transaction',
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
    url: 'backend/db/default',
    method: 'post',
    headers:{
      table:'appoint'
    },
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
    url: 'backend/transaction',
    method: 'post',
    data:{
      sqls:[
        "INSERT INTO appoint (`uuid`,`beginTime`, `interval`, `flare`, `times`, `stoveID`) VALUES (?,?,?,?,?,?);",
      ],
      vals:[
        [
          uuidv4(),
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
    url: 'backend/transaction',
    method: 'post',
    data:{
      sqls:[
        "DELETE FROM appoint WHERE `stoveID` = ?;",
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
    url: 'backend/transaction?abcdef',
    method: 'post',
    data:{
      sqls:[
        "UPDATE BEPK_RYB_GSYTHPT.`appoint` SET `begun` = 1 WHERE `stoveID` = ? AND `begun` = 0;",
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
    const setting = useSettingStore()
    setting.人影.监控.红外云图时间 = '加载时间列表'
    request({
      url:'/zcgk/api/v1/satellite/product/getLocalFileList',
      method:'get',
      params:{
        type:'WMC-K.0008.0010.T',
        order:'desc'
      }
    }).then(({data})=>{
      if(data.data.dateList.length>0){
        setting.人影.监控.红外云图时间 = '加载卫星数据'
        request({
          url:'/zcgk/api/v1/satellite/product/getProduct',
          method:'get',
          params:{
            productType:'WMC-K.0008.0010.T',
            fileName:data.data.dateList[0].fileName,
          }
        }).then(({data:tmpData})=>{
          setting.人影.监控.红外云图时间 = data.data.dateList[0].obsTime
          resolve(tmpData)
        }).catch(e=>{
          setting.人影.监控.红外云图时间 = e.message
          reject(e)
        })
      }else{
        setting.人影.监控.红外云图时间 = '暂无红外云图'
        reject('暂无红外云图')
      }
    }).catch(e=>{
      setting.人影.监控.红外云图时间 = e.message
      reject(e)
    })
  })
}
//全国拼图V3.0：组合反射率
export function 组合反射率(){
  return new Promise((resolve,reject)=>{
    const setting = useSettingStore()
    setting.人影.监控.组合反射率时间 = '加载时间列表'
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
        setting.人影.监控.组合反射率时间 = '加载雷达数据'
        request({
          url:'/zcgk/api/v1/rada/radarV3Product/getProduct',
          method:'get',
          params:{
            fileName:data.data.dateList[0].fileName,
            productType:'RADA_L3_MST_CREF_QC',
            smooth:false
          }
        }).then(({data:tmpData})=>{
          setting.人影.监控.组合反射率时间 = data.data.dateList[0].title
          resolve(tmpData)
        }).catch(e=>{
          setting.人影.监控.组合反射率时间 = e.message
          reject(e)
        })
      }else{
        setting.人影.监控.组合反射率时间 = '暂无组合反射率数据'
        reject('暂无组合反射率')
      }
    }).catch(e=>{
      reject(e)
    })
  })
}
//1km分辨率CMPAS降水融合3km
export function CMPAS降水融合3km(){
  const setting = useSettingStore()
  return new Promise((resolve,reject)=>{
    setting.人影.监控.CMPAS降水融合3km时间 = '加载时间列表'
    request({
      url:'/zcgk/api/v1/cmpas1kmProduct/findDateList',
      method:'get',
      params:{
        type:'ss',
        product:'SURF_CMPAS_MUL_1KM_RT',
        order:'desc'
      }
    }).then(({data})=>{
      if(data&&data.data.length>0){
        setting.人影.监控.CMPAS降水融合3km时间 = '加载雷达数据'
        request({
          url:'/zcgk/api/v1/cmpas1kmProduct/getProduct',
          method:'get',
          params:{
            productType:'SURF_CMPAS_MUL_1KM_RT',
            fileName:data.data[0].fileName,
          }
        }).then(({data: tmpData})=>{
          setting.人影.监控.CMPAS降水融合3km时间 = data.data[0].title
          resolve(tmpData)
        }).catch(e=>{
          setting.人影.监控.CMPAS降水融合3km时间 = e.message
          reject(e)
        })
      }else{
        setting.人影.监控.CMPAS降水融合3km时间 = '暂无CMPAS降水融合3km数据'
        reject('暂无CMPAS降水融合3km')
      }
    }).catch(e=>{
      setting.人影.监控.CMPAS降水融合3km时间 = e.message
      reject(e)
    })
  })
}

export function 睿图雷达(){
  return new Promise((resolve,reject)=>{
    const setting = useSettingStore()
    setting.人影.监控.睿图雷达时间 = '加载时间列表'
    request({
      url:`/ryyth-meteordata/bjInterface/ramapsRada/getDataFileList`,
      method:'get',
      params:{
        date:moment().format('YYYY-MM-DD'),
        ottProduct:'Cr',
        order:'desc'
      }
    }).then(({data})=>{
      if(data&&data.data.length>0){
        setting.人影.监控.睿图雷达时间 = '加载雷达数据'
        request({
          url:`/ryyth-meteordata/bjInterface/ramapsRada/getDataFile?ottProduct=Cr&filePath=${data.data[0].path}&height=3000`,
          method:'get',
        }).then(({data})=>{
          setting.人影.监控.睿图雷达时间 = data.data.mapTitle
          resolve(data)
        }).catch(e=>{
          setting.人影.监控.睿图雷达时间 = e.message
          reject(e)
        })
      }else{
        setting.人影.监控.睿图雷达时间 = '暂无睿图雷达数据'
        reject('暂无睿图雷达数据')
      }
    }).catch(e=>{
      setting.人影.监控.睿图雷达时间 = e.message
      reject(e)
    })
  })
}
export function 真彩图(){
  return new Promise((resolve,reject)=>{
    const setting = useSettingStore()
    setting.人影.监控.真彩图时间 = '加载时间列表'
    request({
      url:`/cdb/api/v1/satellite/fy4/product/findLocalFileList`,
      method:'get',
      params:{
        beginTimeBeijing:'',
        endTimeBeijing:'',
        type:'WMC-K.0008.0012.T',
        order:'desc',
        caseDate:'',
        sdpTime:1755347692988
      }
    }).then(({data})=>{
      if(data&&data.data&&data.data.dateList&&data.data.dateList.length>0){
        setting.人影.监控.真彩图时间 = '加载卫星数据'
        request({
          url:`/cdb/api/v1/satellite/fy4/product/getProduct?productType=WMC-K.0008.0012.T&fileName=${data.data.dateList[0].fileName}&sdpTime=1755347693127`,
          method:'get',
        }).then(({data})=>{
          setting.人影.监控.真彩图时间 = data.data.mapTitle
          resolve(data)
        }).catch(e=>{
          setting.人影.监控.真彩图时间 = e.message
          reject(e)
        })
      }else{
        setting.人影.监控.真彩图时间 = '暂无真彩图数据'
        reject('暂无真彩图数据')
      }
    }).catch(e=>{
      setting.人影.监控.真彩图时间 = e.message
      reject(e)
    })
  })
}
export function 基本站(){
  return new Promise((resolve,reject)=>{
    request({
      url:'ryyth-meteordata/md1000/autoStation/findDateList?date=&sdpTime=1754292267633',
      method:'get',
      headers:{
        'Authorization':'09ef3716291116453d7e1d76229631ae'
      }
    }).then(res=>{
      const it = res.data.data.dateList[0]
      request({
        url:`/ryyth-meteordata/md1000/autoStation/getRainLayer`,
        method:'get',
        params:{
          staLvs:'11,12',
          dateTimes:it.date,
          dataSource:'localJsonData',
          fileNames:it.fileName,
          sdpTime:1754296746550
        },
        headers:{
          'Authorization':'09ef3716291116453d7e1d76229631ae'
        }
      }).then(({data})=>{
        if(data.data){
          resolve(data)
        }else{
          reject('暂无基本站数据')
        }
      }).catch(e=>{
        reject(e)
      })
    }).catch(e=>{
      reject(e)
    })
  })
}
export function 一般站(){
  return new Promise((resolve,reject)=>{
    request({
      url:'ryyth-meteordata/md1000/autoStation/findDateList?date=&sdpTime=1754292267633',
      method:'get',
      headers:{
        'Authorization':'09ef3716291116453d7e1d76229631ae'
      }
    }).then(res=>{
      const it = res.data.data.dateList[0]
      console.log(it)
      request({
        url:`/ryyth-meteordata/md1000/autoStation/getRainLayer`,
        method:'get',
        params:{
          staLvs:'13',
          dateTimes:it.date,
          dataSource:'localJsonData',
          fileNames:it.fileName,
          sdpTime:1754296746550
        },
        headers:{
          'Authorization':'09ef3716291116453d7e1d76229631ae'
        }
      }).then(({data})=>{
        console.log(data)
        if(data.data){
          resolve(data)
        }else{
          reject('暂无一般站数据')
        }
      }).catch(e=>{
        reject(e)
      })
    }).catch(e=>{
      reject(e)
    })
  })
}


export function 区域站(){
  return new Promise((resolve,reject)=>{
    request({
      url:'ryyth-meteordata/md1000/autoStation/findDateList?date=&sdpTime=1754292267633',
      method:'get',
      headers:{
        'Authorization':'09ef3716291116453d7e1d76229631ae'
      }
    }).then(res=>{
      const it = res.data.data.dateList[0]
      request({
        url:`/ryyth-meteordata/md1000/autoStation/getRainLayer`,
        method:'get',
        params:{
          staLvs:'14',
          dateTimes:it.date,
          dataSource:'localJsonData',
          fileNames:it.fileName,
          sdpTime:1754296746550
        },
        headers:{
          'Authorization':'09ef3716291116453d7e1d76229631ae'
        }
      }).then(({data})=>{
        if(data.data){
          resolve(data)
        }else{
          reject('暂无区域站数据')
        }
      }).catch(e=>{
        reject(e)
      })
    }).catch(e=>{
      reject(e)
    })
  })
}



export function 注册飞机查询({page,size}:{page:number,size:number}){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'plane_addr',
    },
    data:{
      // orderby: [
      //   {
      //     "field": "dtRegTime",
      //     "order": "DESC"
      //   }
      // ],
      "distinct": false,
      "offset": (page-1)*size,
      "limit": size
    }
  })
  // return request({
  //   url:'/qt/select/regplane',
  //   method:'post',
  //   data:{
  //     orderby: [
  //       {
  //         "field": "dtRegTime",
  //         "order": "DESC"
  //       }
  //     ],
  //     "distinct": false,
  //     "offset": (page-1)*size,
  //     "limit": size
  //   }
  // })
}
export function 判断飞机是否存在(iAddress:string){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'plane_addr',
    },
    data:{
      where:[
        {
          "relation": "AND",
          "field": "iAddress",
          "relationship": "=",
          "condition": iAddress
        }
      ],
      "distinct": false,
      "offset": 0,
      "limit": 0
    }
  })
}
export function 删除飞机(iAddress:string){
  return request({
    url:'/backend/db/default',
    method:'delete',
    headers:{
      table:'plane_addr',
    },
    data: [{iAddress}]
  })
  // return request({
  //   url:'/qt/delete/regplane',
  //   method:'post',
  //   data: {
  //     "where": [
  //         {
  //           "relation": "AND",
  //           "field": "iAddress",
  //           "relationship": "=",
  //           "condition": address
  //         }
  //     ]
  //   }
  // })
}
export function 新增飞机(data:any){
  return request({
    url:'/backend/db/default',
    method:'put',
    headers:{
      table:'plane_addr',
    },
    data
  })
  // return request({
  //   url:'/qt/insert/regplane',
  //   method:'post',
  //   data
  // })
}
export function 修改飞机(data:any){
  return request({
    url:'/backend/db/default',
    method:'put',
    headers:{
      table:'plane_addr',
    },
    data
  })
  // return request({
  //   url:'/qt/update/regplane',
  //   method:'post',
  //   data
  // })
}

import {csv2list} from '~/tools'
import unitsStr from '/units.csv?url&raw'

export function getMask(){
  const units = csv2list(unitsStr)
  const config = localStorage.getItem('config')!
  const name = JSON.parse(config).userInfo.name
  const results = units.filter(item=>item.strName == name)
  if(results.length===1){
    const result = results[0]
    const strID = result.strID
    if(strID.endsWith('110000000')){//北京人影办
      return '%%'
    }else if(strID.endsWith('120000000')){//天津人影办
      return '12%'
    }else if(strID.endsWith('130000000')){//河北人影办
      return '13%'
    }else if(strID.endsWith('140000000')){//山西人影办
      return '14%'
    }else if(strID.endsWith('150000000')){//内蒙人影办
      return '15%'
    }else if(strID.endsWith('000')){//区县人影办
      return strID.substring(0, strID.length - 3)+'%'
    }
    // return '110116%'
  }else if(results.length===0){
    throw('未找到权限信息')
  }else{
    throw('权限配置错误')
  }
}

export function getTrack(beginDateTime:string,endDateTime:string,unSsrCode:number,uiTrackNo:number){
  return request({
    // url:`/test/backend/tracks`,
    url:`/backend/tracks`,
    method:'get',
    params:{
      beginDateTime,
      endDateTime,
      unSsrCode
    }
  })
}

export function getPlanPath(){
  return new Promise((resolve,reject)=>{
    request({
      url:'/weatherModification/dicts/getTypeById?id=43',
      method:'get',
    }).then(res=>{
      resolve(res.data.data[0])
    }).catch(err=>{
      reject(err)
    })
  })
}




export function getRegion(){
  return request({
    url:'/backend/db/default1',
    method:'post',
    headers:{
      table:'map_border_info',
    },
    data:{
      select:['adcode','name','childrenNum','parent_adcode'],
      where:[
        {
          "relation": "AND",
          "field": "adcode",
          "relationship": '!=',
          "condition": '100000_JD'
        }
      ],
      "distinct": false,
      "offset": 0,
      "limit": 0
    }
  })
}
export function getAllShouldExpendRegion(){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'map_border_info',
    },
    data:{
      select:['adcode'],
      where:[
        {
          "relation": "AND",
          "field": "childrenNum",
          "relationship": ">",
          "condition": 0
        }
      ],
      "distinct": false,
      "offset": 0,
      "limit": 0
    }
  })
}

export function 烟炉历史(paginationOption:any,range:[Date, Date]){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'STOVEFIREHIS',
    },
    data:{
      select:['*'],
      where:range?[
        {
          "relation": "AND",
          "field": "writeTm",
          "relationship": ">=",
          "condition": moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          "relation": "AND",
          "field": "writeTm",
          "relationship": "<=",
          "condition": moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      ]:[],
      orderby:[
        'writeTm desc'
      ],
      "distinct": false,
      "offset": (paginationOption.currentPage - 1) * paginationOption.pageSize,
      "limit": paginationOption.pageSize,
    }
  })
}

export function 弹药概况(status:number){
  return request({
    url:'/backend/transaction',
    method:'post',
    data:{
      sqls:[
        `
select COALESCE(tmp_hjd.district_code,tmp_pd.district_code) as \`district_code\`,COALESCE(tmp_hjd.district_name,tmp_pd.district_name) as \`district_name\`,COALESCE(tmp_pd.pd_count,0) as \`pd_count\`,COALESCE(tmp_hjd.hjd_count,0) as \`hjd_count\` from (
SELECT
  concat(SUBSTR(s.id, 1, 6),'000') AS district_code,
  s2.name as district_name,
  COUNT(hjd.storage) AS hjd_count
FROM
  BEPK_RYB_GSYTHPT.dygl_storage s
LEFT JOIN
  BEPK_RYB_GSYTHPT.dygl_ammohjd hjd
  ON hjd.storage = s.id
LEFT JOIN
  BEPK_RYB_GSYTHPT.dygl_storage s2
  ON s2.id = concat(SUBSTR(s.id, 1, 6),'000')
WHERE
  hjd.status = ${status}
GROUP BY
  SUBSTR(s.id, 1, 6),s2.name
ORDER BY
  SUBSTR(s.id, 1, 6) asc
)tmp_hjd left join (
SELECT
  concat(SUBSTR(s.id, 1, 6),'000') AS district_code,
  s2.name as district_name,
  COUNT(pd.storage) AS pd_count
FROM
  BEPK_RYB_GSYTHPT.dygl_storage s
LEFT JOIN
  BEPK_RYB_GSYTHPT.dygl_storage s2
  ON s2.id = concat(SUBSTR(s.id, 1, 6),'000')
LEFT JOIN
  BEPK_RYB_GSYTHPT.dygl_ammopd pd
  ON pd.storage = s.id
WHERE
  pd.status = ${status}
GROUP BY
  SUBSTR(s.id, 1, 6),s2.name
ORDER BY
  SUBSTR(s.id, 1, 6) asc
) tmp_pd on tmp_hjd.district_code = tmp_pd.district_code order by district_code asc
`
      ]
      ,vals:[[]]
    }
  })
}

export function 弹药概况2(status:number){
  return request({
    url:'/backend/transaction',
    method:'post',
    data:{
      sqls:[
        `
select COALESCE(tmp_hjd.district_code,tmp_pd.district_code) as \`district_code\`,COALESCE(tmp_hjd.district_name,tmp_pd.district_name) as \`district_name\`,COALESCE(tmp_pd.pd_count,0) as \`pd_count\`,COALESCE(tmp_hjd.hjd_count,0) as \`hjd_count\` from (
SELECT
  s.id AS district_code,
  s.name AS district_name,
  COUNT(hjd.storage) AS hjd_count
FROM
  BEPK_RYB_GSYTHPT.dygl_storage s
LEFT JOIN
  BEPK_RYB_GSYTHPT.dygl_ammohjd hjd
  ON hjd.storage = s.id
WHERE
  s.id LIKE '110109%' AND hjd.status = ${status}
GROUP BY
  s.id, s.name
) tmp_hjd full join (
SELECT
  s.id AS district_code,
  s.name AS district_name,
  COUNT(pd.storage) AS pd_count
FROM
  BEPK_RYB_GSYTHPT.dygl_storage s
LEFT JOIN
  BEPK_RYB_GSYTHPT.dygl_ammopd pd
  ON pd.storage = s.id
WHERE
  s.id LIKE '110109%' AND pd.status = ${status}
GROUP BY
  s.id, s.name
) tmp_pd on tmp_hjd.district_code = tmp_pd.district_code order by district_code asc
`
      ]
      ,vals:[[]]
    }
  })
}

export function getSubRegion(adcode = '620000'){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'map_border_info',
    },
    data:{
      select:['name','adcode','parent_adcode'],
      where:[
        {
          "relation": "AND",
          "field": "parent_adcode",
          "relationship": '=',
          "condition": adcode
        }
      ],
      orderby:['adcode asc'],
      "distinct": false,
      "offset": 0,
      "limit": 0
    }
  })
}