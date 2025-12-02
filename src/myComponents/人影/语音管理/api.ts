import moment from 'moment'
import request from '~/utils/request'
import { useSettingStore } from '~/stores/setting'
import { wrapKeys } from '~/tools'
import { v4 as uuidv4 } from 'uuid'





export function fetchList({page,size}:{page:number,size:number}){
  return request({
    url:'/backend/db/default2',
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