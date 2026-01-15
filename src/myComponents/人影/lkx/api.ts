import moment from 'moment'
import request from '~/utils/request'
import { useSettingStore } from '~/stores/setting'
import { wrapKeys } from '~/tools'
import { v4 as uuidv4 } from 'uuid';
import { Data } from 'ol/DataTile';

const tableName = 'zydhisdata'
const tableName_join_left = 'zydhisdata z left join units u1 on z.strAnswerUnit=u1.strID left join units u2 on z.strUpApplyUnit=u2.strID'
const database = {"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"ryplat_scry","type":"mysql"}

export function getSubRegion(adcode = '620000'){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:encodeURIComponent(tableName),
      database:encodeURIComponent(JSON.stringify(database)),
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

//作业点名称筛选框数据接口
export function getZydName(){
  console.log('执行获取作业点名称接口')
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:encodeURIComponent(tableName),
      database:encodeURIComponent(JSON.stringify(database)),
    },
    data:{
      select:['strName',],
      distinct: true,
      "offset": 0, //开始查询的位置
      "limit": 0  //查询的数量
    }
  })
}


export function select_getZydHisData(beginTime:string,endTime:string,ZydName:string,offset:number,limit:number){
  console.log('执行筛选操作接口')
  let arrselect=[
    'z.strWorkID',
    'z.strName',
    'z.strUpApplyUnit',
    'z.tmBeginApply',
    'z.iApplyTimeLen',
    'z.strAnswerUnit',
    'z.banswervalid',
    'z.bansweraccept ',
    'z.ianswerTimeLen',
    'z.tmBeginAnswer',
    'z.tmAnswerRev',
    'z.vecProcess',
    'u1.strName as strAnswerUnitName',
    'u2.strName as strUpApplyUnitName',
  ]
  let arrwhere:any[] = []
  //无时间
  if(beginTime==='' && (endTime==='') ) {
    //无作业点名称
    if(ZydName==='全部'){
      arrwhere = []
    }
    //有名称
    else{
      arrwhere = [
        {
          relation:'AND',
          field:'z.strName',
          relationship:'=',
          condition:ZydName
        },
      ]
    }
  }
  //有时间
  else{
    //无作业点名称
    if(ZydName==='全部'){
      arrwhere=[
        {
          relation:'AND',
          field:'z.tmBeginApply',//申请开始时间
          relationship:'>=',
          condition:beginTime
        },
        {
          relation:'AND',
          field:'z.tmApplyRev',//申请结束时间
          relationship:'<=',
          condition:endTime
        },
      ]
    }
    //有名称
    else{
      arrwhere=[
        {
          relation:'AND',
          field:'z.strName',
          relationship:'=',
          condition:ZydName
        },
        {
          relation:'AND',
          field:'z.tmBeginApply',//申请开始时间
          relationship:'>=',
          condition:beginTime
        },
        {
          relation:'AND',
          field:'z.tmBeginApply',//申请结束时间
          relationship:'<=',
          condition:endTime
        },
      ]
    }
  }
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:encodeURIComponent(tableName_join_left),
      database:encodeURIComponent(JSON.stringify(database)),
    },
    data:{
    select:arrselect,
    where:arrwhere,
    "offset": offset, //开始查询的位置
    "limit": limit  //查询的数量
    }
  })
}

export function 历史作业记录(ZydName:string,range?:any,page:number=1,size:number=10){
  console.log('执行历史作业记录接口')

  const data = {
    select:[
      'z.strWorkID',
      'z.strName',
      'z.strUpApplyUnit',
      'z.tmBeginApply',
      'z.iApplyTimeLen',
      'z.strAnswerUnit',
      'z.banswervalid',
      'z.bansweraccept ',
      'z.ianswerTimeLen',
      'z.tmBeginAnswer',
      'z.tmAnswerRev',
      'z.vecProcess',
      'u1.strName as strAnswerUnitName',
      'u2.strName as strUpApplyUnitName',
    ],
    where:new Array(),
    offset:(page-1)*size,
    limit:size
  }
  if(range){
    data.where.push({
      relation:'AND',
      field:'z.tmBeginApply',//申请开始时间
      relationship:'>=',
      condition:moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      relation:'AND',
      field:'z.tmApplyRev',//申请结束时间
      relationship:'<=',
      condition:moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
    })
  }
  if(ZydName!=='全部'){
    data.where.push({
      relation:'AND',
      field:'z.strName',
      relationship:'=',
      condition:ZydName
    })
  }
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:encodeURIComponent(tableName_join_left),
      database:encodeURIComponent(JSON.stringify(database)),
    },
    data,
  })
}