import request from '~/utils/request'
import {RyOperationOpintQuery} from "~/api/type.ts"

const url = "/backend/db/default"
const tableName = 'zydpara'

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
export async function getList(data: RyOperationOpintQuery) {
    const offset = data.currentPage * data.pageSize - data.pageSize
    return request({
        url,
        method: 'POST',
        data: {
            offset: offset,
            limit: data.pageSize,
            //orderby:["strID desc"],
            where:[
                {
                    relation:"and",
                    field:"u1.strCode",
                    relationship:"like",
                    condition:`%${data?.strCode?data.strCode:''}%`,
                },{
                    relation:"or",
                    field:"u1.strName",
                    relationship:"like",
                    condition:`%${data?.strName?data.strName:''}%`,
                },
            ]
        },
        headers: {
            table:tableName
        }
    })
}

//获取上级单位信息
export async function getSuperiorUnit() {
    return request({
        url,
        method: 'POST',
        data: {
            offset: 0,
            limit: 0,
            distinct: true,
            select: ["strID", "strName"],
        },
        headers: {
            table: tableName
        }
    })
}
