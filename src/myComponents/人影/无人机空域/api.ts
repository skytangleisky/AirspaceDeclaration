import request from '~/utils/request'
import moment from 'moment'
export function fetchList({page,size,range}:{page:number,size:number,range:any}){
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'flight_activity_apply',
    },
    data:{
      select:['*'],
      where: range?[
        {
          "relation": "and",
          "field":"tmBegin",
          "relationship":">",
          "condition":moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          "relation": "and",
          "field":"tmEnd",
          "relationship":"<",
          "condition":moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      ]:[],
      "orderby":['id asc'],
      "distinct": false,
      "offset": (page-1)*size,
      "limit": size
    }
  })
}