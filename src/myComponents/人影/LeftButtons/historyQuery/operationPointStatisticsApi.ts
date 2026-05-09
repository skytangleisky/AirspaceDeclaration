import request from '~/utils/request'
import { useUserStore } from '~/stores/user';

const url = "/backend/db/default"
const tableName = 'zydhisdata'

export function add(data: any) {
    return request({
        url,
        method: 'PUT',
        data,
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
        data,
        headers: {
            table: tableName
        }
    })
}
// SELECT strZydID, COUNT(*) AS cnt
// FROM zydHisData
// GROUP BY strZydID;
//分页查询
export function getList(data: any) {
    const user = useUserStore()
    let where:any = []
    if(user.strUnitID.startsWith('99')){
        where = [{
            relation:"and",
            field:`strATCUnitID`,
            relationship:"like",
            condition:user.strUnitID,
        }]
    }else{
        where = [
            {
                relation:"and",
                field:`strZydID`,
                relationship:"like",
                condition:user.strUnitID.substring(0,2)+'%',
            }
        ]
    }
    if(data.query){
        for(let key in data.query){
            where.push({
                relation:"and",
                field:`${tableName}.${key}`,
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
            select:[`${tableName}.strZydID`,`${tableName}.strName`,'u.strName as strUpApplyUnitName','COUNT(*) as cnt'],
            offset: offset,
            limit: data.pageSize,
            where,
            groupby:[
              "strName",
              "strZydID",
              "strUpApplyUnitName"
            ]
        },
        headers: {
            table:`${tableName} left join units u on ${tableName}.strUpApplyUnit=u.strID`
        }
    })
}

