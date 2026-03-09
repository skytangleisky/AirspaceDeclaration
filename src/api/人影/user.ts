import request from '~/utils/request'
import {RyOperationOpintQuery} from "~/api/type.ts"

const url = "/backend/db/default"
const tableName = 'subusers'

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
        },
        headers: {
            table:tableName
        }
    })
}

