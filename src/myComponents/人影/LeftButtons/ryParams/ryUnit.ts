import request from '~/utils/request'

const url = "/backend/db/default"
const tableName = 'units'

export function add(data: any) {
  return request({
    url,
    method: 'PUT',
    data: [data],
    headers: {
      table: tableName
    }
  })
}

export function del(data: any) {
  return request({
    url,
    method: 'DELETE',
    data: [data],
    headers: {
      table: tableName
    }
  })
}

export function update(data: any) {
  const {strID,strMgrIDname,...remain} = data
  return request({
    url,
    method: 'PUT',
    data: [{
      "[strID]":strID,
      ...remain,
    }],
    headers: {
      table: tableName
    }
  })
}

//分页查询
export function getList(data: any) {
  const offset = data.currentPage * data.pageSize - data.pageSize
  const where:any = []
  if(data.query){
    for(let key in data.query){
      where.push({
        relation:"and",
        field:`u1.${key}`,
        relationship:"like",
        condition:`%${data.query[key]}%`,
      })
    }
  }
  console.log(data.query)
  return request({
    url,
    method: 'POST',
    data: {
      offset: offset,
      limit: data.pageSize,
      select: ["u1.*", "u2.strName as strMgrIDname"],
      where
    },
    headers: {
      table: "units u1 left join units u2 on u1.strMgrID=u2.strID"
    }
  })
}

