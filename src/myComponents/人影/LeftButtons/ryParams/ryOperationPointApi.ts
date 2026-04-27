import request from '~/utils/request'

const url = "/backend/db/default"
const tableName = 'zydpara'

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
        data,
        headers: {
            table: tableName
        }
    })
}

export function update(data: any) {
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
export function getList(data: any) {
    const where:any = []
    if(data.query){
        for(let key in data.query){
            where.push({
                relation:"and",
                field:`zydpara.${key}`,
                relationship:"like",
                condition:`%${data.query[key]}%`,
            })
        }
    }
    const offset = data.currentPage * data.pageSize - data.pageSize
    return request({
        url,
        method: 'POST',
        data: {
            offset: offset,
            limit: data.pageSize,
            //orderby:["strID desc"],
            where,
        },
        headers: {
            table:tableName
        }
    })
}

