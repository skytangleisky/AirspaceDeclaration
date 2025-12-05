import moment from 'moment'
import request from '~/utils/request'
import { useSettingStore } from '~/stores/setting'
import { wrapKeys } from '~/tools'
import { v4 as uuidv4 } from 'uuid'





export function fetchList({page,size}:{page:number,size:number}){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'audio',
    },
    data:{
      select:['*'],
      "distinct": false,
      "offset": (page-1)*size,
      "limit": size
    }
  })
}

export function 增加语音记录(data:Array<{path:string|null,caller:string,callee:string}>){
  return request({
    url:'/backend/db/default',
    method:'put',
    headers:{
      table:'audio',
    },
    data
  })
}
export function 删除语音记录(data:Array<{uuid:string}>){
  return request({
    url:'/backend/db/default',
    method:'delete',
    headers:{
      table:'audio',
    },
    data
  })
}