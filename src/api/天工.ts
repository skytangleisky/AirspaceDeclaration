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