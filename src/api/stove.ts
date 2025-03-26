import request from '../utils/request'
const databaseRaw = 'host=192.168.0.240&port=3306&user=root&password=mysql&database=ryplat_bjry'
export function fetchList() {
  return request({
    url: 'backend/db/stoves?'+databaseRaw,
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