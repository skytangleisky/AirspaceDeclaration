import request from '../utils/request'
export function 铁路(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('铁路'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 机场管制区(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('机场管制区'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 障碍物(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('障碍物'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 地标(table:string){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent(table),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 飞行管制区(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('飞行管制区'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 飞行管制分区(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('飞行管制分区'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}