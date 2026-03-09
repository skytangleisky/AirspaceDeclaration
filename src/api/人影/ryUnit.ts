import request from '~/utils/request'
import {RyUnitQuery} from "~/api/type.ts"

const url = "/backend/db/default"
const tableName = 'units'

export async function add(data: any) {
    return request({
        url,
        method: 'PUT',
        data: [data],
        headers: {
            table: tableName
        }
    })
}

export async function del(data: any) {
    return request({
        url,
        method: 'DELETE',
        data: [data],
        headers: {
            table: tableName
        }
    })
}

export async function update(data: any) {
    return request({
        url,
        method: 'PUT',
        data: [data],
        headers: {
            table: tableName
        }
    })
}

//分页查询
export async function getList(data: RyUnitQuery) {
    const offset = data.currentPage * data.pageSize - data.pageSize
    return request({
        url,
        method: 'POST',
        data: {
            offset: offset,
            limit: data.pageSize,
            select: ["u1.*", "u2.strName as strMgrIDname"],
            //orderby:["strID desc"],
            where:[
                {
                    relation:"and",
                    field:"u1.strID",
                    relationship:"like",
                    condition:`%${data?.strID?data.strID:''}%`,
                },{
                    relation:"or",
                    field:"u1.strName",
                    relationship:"like",
                    condition:`%${data?.strName?data.strName:''}%`,
                },
            ]
        },
        headers: {
            table: "units u1 left join units u2 on u1.strMgrID=u2.strID"
        }
    })
}

