import request from '~/utils/request'
import moment from 'moment'
export function fetchList({page,size,range}:{page:number,size:number,range:any}){
  const data = {
    select:['*'],
    where: new Array(),
    "orderby":['id asc'],
    "distinct": false,
    "offset": (page-1)*size,
    "limit": size
  }
  if(range){
    data.where.push({
      relation: "group",
      children:[
        {
          "relation": "and",
          "field":"create_time",
          "relationship":">",
          "condition":moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          "relation": "and",
          "field":"end_time",
          "relationship":"<",
          "condition":moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      ]
    })
  }
  return request({
    url:'/backend/db/enclosure',
    method:'post',
    headers:{
      table:'enclosure',
    },
    data
  })
}