import request from '~/utils/request';
const headers = {table:'enclosure'}
export function 获取净空区() {
  return request({
    headers:{
      table:'enclosure'
    },
    url:'/backend/db/enclosure',
    method: 'post',
    data: {
      "select":["*"], // 需要获取的字段，"*"代表所有字段
      "distinct":false, // 是否对筛选后的数据去重
      "where":[
        {
          "relation":"AND",
          "field":"enclosure_type",
          "relationship":"=",
          "condition":"02"
        },
        {
          "relation":"AND",
          "field":"standby1",
          "relationship":"=",
          "condition":"S"//S净空区(糖果图) P禁飞区  D危险区 M可飞区   R限飞区  O计划空域  L	航线  F	航路 A	走廊
        },
        // {
        //   "relation":"OR",
        //   "field":"standby1",
        //   "relationship":"=",
        //   "condition":"O"//S净空区(糖果图) P禁飞区  D危险区 M可飞区   R限飞区  O计划空域  L	航线  F	航路 A	走廊
        // },
        // {
        //   "relation":"OR",
        //   "field":"standby1",
        //   "relationship":"=",
        //   "condition":"R"
        // },
        // {
        //   "relation":"OR",
        //   "field":"enclosure_type",
        //   "relationship":"=",
        //   "condition":"06"
        // }
      ],
      "groupby":[], // 分组，传参类似"select"
      "having":[], // 分组后的条件，传参类似"where"
      "orderby": [ // 根据字段排序
        // {
        //   "field": "id", // 某个字段
        //   "order": "ASC" // ASC|DESC
        // }
      ],
      "offset": 0,
      "limit": 0
    }
  })
}

// 形状00线形;01矩形;02多边形;03圆形,04扇形,05椭圆,06点
export function 获取飞行区() {
  return request({
    headers,
    url:'/backend/db/enclosure',
    method: 'post',
    data: {
      "select":["*"], // 需要获取的字段，"*"代表所有字段
      "distinct":false, // 是否对筛选后的数据去重
      "where":[
        {
          "relation":"AND",
          "field":"standby1",
          "relationship":"=",
          "condition":"O"//S净空区(糖果图) P禁飞区  D危险区 M可飞区   R限飞区  O计划空域  L	航线  F	航路 A	走廊
        },
        {
          "relation":"group",
          "children":[
            {
              "relation":"or",
              "field":"enclosure_type",
              "relationship":"=",
              "condition":"02"
            },
            {
              "relation":"or",
              "field":"enclosure_type",
              "relationship":"=",
              "condition":"00"
            },
            {
              "relation":"or",
              "field":"enclosure_type",
              "relationship":"=",
              "condition":"03"
            },
            {
              "relation":"or",
              "field":"enclosure_type",
              "relationship":"=",
              "condition":"06"
            },
          ]
        }
        // {
        //   "relation":"OR",
        //   "field":"standby1",
        //   "relationship":"=",
        //   "condition":"O"//S净空区(糖果图) P禁飞区  D危险区 M可飞区   R限飞区  O计划空域  L	航线  F	航路 A	走廊
        // },
        // {
        //   "relation":"OR",
        //   "field":"standby1",
        //   "relationship":"=",
        //   "condition":"R"
        // },
        // {
        //   "relation":"OR",
        //   "field":"enclosure_type",
        //   "relationship":"=",
        //   "condition":"06"
        // }
      ],
      "groupby":[], // 分组，传参类似"select"
      "having":[], // 分组后的条件，传参类似"where"
      "orderby": [ // 根据字段排序
        // {
        //   "field": "id", // 某个字段
        //   "order": "ASC" // ASC|DESC
        // }
      ],
      "offset": 0,
      "limit": 0
    }
  })
}


export function updateData(data:any) {
  const target = data.map((item:any)=>{
    const {id,...remain} = item
    return {'[id]':id,...remain}
  })
  return request({
    headers,
    url:'/backend/db/enclosure',
    method: 'put',
    data:target
  })
}

export function saveData(data:any) {
  return request({
    headers,
    url:'/backend/db/enclosure',
    method: 'put',
    data
  })
}

export function deleteData(data) {
  return request({
    headers,
    url:'/backend/db/enclosure',
    method: 'delete',
    data
  })
}