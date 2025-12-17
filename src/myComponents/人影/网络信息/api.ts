import request from '~/utils/request'
import moment from 'moment'
export function fetchList({page,size,range}:{page:number,size:number,range:any}){
  return request({
    url:'/backend/db/defaultD',
    method:'post',
    headers:{
      // database:JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"union","type":"mysql"}),
      database:JSON.stringify({"host":"10.194.22.240","port":33060,"user":"root","password":"SCRY@ryb1234","database":"union","type":"mysql"}),
      table:'connection',
    },
    data:{
      select:['*'],
      where: range?[
        {
          "relation": "and",
          "field":"datetime_create",
          "relationship":">",
          "condition":moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          "relation": "and",
          "field":"datetime_create",
          "relationship":"<",
          "condition":moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      ]:[],
      "orderby":['datetime_create desc'],
      "distinct": false,
      "offset": (page-1)*size,
      "limit": size
    }
  })
}