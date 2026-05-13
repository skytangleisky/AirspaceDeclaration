import request from '~/utils/request'
const url = "/backend/db/flightPlan"
export function getList(){
  return new Promise(async(resolve,reject)=>{
    try{
      const {data:{results:tempAirspaceLogs}} = await getTempAirspaceLog()
      await Promise.all(tempAirspaceLogs.map(async(tempAirspaceLog:any)=>{
        const {data:{results:[tempAirspace]}} = await getTempAirspace(tempAirspaceLog.temp_airspace_id)
        tempAirspaceLog.tempAirspace = tempAirspace
      }))
      resolve(tempAirspaceLogs)
    }catch(err){
      reject(err)
    }
  })
}
function getTempAirspaceLog(){
  return request({
    url,
    method: 'POST',
    data: {
      select:['x.*','t.created_time as arispace_created_time'],
      offset: 0,
      limit: 0,
      where:[
        {
          relation:'and',
          field:'x.rn',
          relationship:'=',
          condition:1
        }
      ],
      orderby:[
        'arispace_created_time desc'
      ]
    },
    headers: {
      table:encodeURIComponent(`
        (
          SELECT
            t.*,
            ROW_NUMBER() OVER (
              PARTITION BY t.temp_airspace_id
              ORDER BY created_time DESC
            ) AS rn
          FROM t_temp_airspace_log t
        ) x left join t_temp_airspace t on x.temp_airspace_id = t.temp_airspace_id
      `)
    }
  })
}
function getTempAirspace(temp_airspace_id:string){
  return request({
    url,
    method: 'POST',
    data: {
      select:[`*`],
      offset: 0,
      limit: 0,
      where:[
        {
          relation:'and',
          field:'temp_airspace_id',
          relationship:'=',
          condition:temp_airspace_id
        }
      ],
    },
    headers: {
      table:'t_temp_airspace'
    }
  })
}
export function 批准(temp_airspace_id:string){
  return request({
    url:'/ry_api/api/insert/DK_temp_airspace_answer',
    method: 'POST',
    data: {
      "temp_airspace_id": temp_airspace_id,
      "operate_type": 3
    },
  })
}
export function 驳回(temp_airspace_id:string){
  return request({
    url:'/ry_api/api/insert/DK_temp_airspace_answer',
    method: 'POST',
    data: {
      "temp_airspace_id": temp_airspace_id,
      "operate_type": 4
    },
  })
}