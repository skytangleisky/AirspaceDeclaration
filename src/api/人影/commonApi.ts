import request from '~/utils/request'

//获取上级单位信息
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