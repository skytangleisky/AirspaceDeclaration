import request from '../utils/request'
// const host = '192.168.0.240'
const host = '127.0.0.1'
export function 九段线(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('九段线'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 铁路(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
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
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
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
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
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
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
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
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
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
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('飞行管制分区'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 国境线(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('国境线'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 岛屿(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('岛屿'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 河流(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('河流'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 海岸线(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('海岸线'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 省界(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('省界_region'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 县界(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('县'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 机场(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('airport'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 省名(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('省名'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 危险区(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('危险区'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 禁区(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('禁区'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}
export function 限制区(){
  return request({
    url: '/backend/db/default',
    method: 'post',
    headers:{
      database:JSON.stringify({"host":host,"port":3306,"user":"root","password":"mysql","database":"wsmap","type":"mysql"}),
      table:encodeURIComponent('限制区'),
    },
    data:{
      select:['*'],
      distinct:false,
    }
  })
}