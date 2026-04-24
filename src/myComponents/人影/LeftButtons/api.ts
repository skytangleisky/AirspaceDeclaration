import { useUserStore } from '~/stores/user'
import request from '~/utils/request'
export function 本地人影接口(){
  const user = useUserStore()
  return request({
    headers: {
      'table': 'units',
    },
    url: '/backend/db/default',
    method: 'post',
    data: {
      select: ['*'],
      where: [
        {
          "relation":"and",
          "field":"strID",
          "relationship":"=",
          "condition":user.strUnitID
        }
      ]
    }
  })
}
export async function queryRyUnitList() {
  return request({
    url:"/backend/db/default",
    method: 'POST',
    data: {
      offset: 0,
      limit: 0,
      distinct: true,
      select: ["strID", "strName"],
    },
    headers: {
      table: "units"
    }
  })
}