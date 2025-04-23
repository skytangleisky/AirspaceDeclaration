import request from '../utils/request'
let dbConfig = 'host=192.168.0.240&port=3306&user=root&password=mysql'
let database1 = `${dbConfig}&database=union`
let database2 = `${dbConfig}&database=ryplat_bjry`
dbConfig = "host=10.224.153.90&port=3306&user=bjryb&password=ryb115"
database1 = `${dbConfig}&database=union`
database2 = `${dbConfig}&database=ryplat`
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
        "select z.*,u.strName as unitName FROM `zydpara` z left join `units` u on z.strMgrUnit = u.strID WHERE z.strID LIKE '110%' AND z.strWeapon!='3'",
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
        "SELECT z.*,u.strName as unitName FROM `zyddata` z left join `units` u on z.strATCUnitID = u.strID ORDER BY z.tmBeginApply ASC",
        "SELECT z.*,u.strName as unitName FROM `zydhisdata` z left join `units` u on z.strATCUnitID=u.strID where DATE_FORMAT(z.tmBeginApply,'%Y-%m-%d') = CURDATE() ORDER BY z.tmBeginApply ASC",//当天的数据
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