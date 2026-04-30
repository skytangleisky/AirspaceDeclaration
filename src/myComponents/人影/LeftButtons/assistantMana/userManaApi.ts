import request from '~/utils/request'
import { useUserStore } from '~/stores/user';

const url = "/backend/db/default"
const tableName = 'subusers'

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
    return request({
        url,
        method: 'PUT',
        data,
        headers: {
            table: tableName
        }
    })
}

//分页查询
export function getList(data: any) {
    const user = useUserStore()
    let where:any = [{
        relation:"and",
        field:`subusers.strUnitID`,
        relationship:"like",
        condition:user.strUnitID.substring(0,2)+'%',
    }]
    if(user.strUnitID.startsWith('99')){
        where = [{
            relation:"and",
            field:`subusers.strUnitID`,
            relationship:"like",
            condition:user.strUnitID,
        }]
    }
    if(data.query){
        for(let key in data.query){
            where.push({
                relation:"and",
                field:`subusers.${key}`,
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
            where,
        },
        headers: {
            table:tableName
        }
    })
}

