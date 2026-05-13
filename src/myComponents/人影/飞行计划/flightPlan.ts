import request from '~/utils/request'
const url = "/backend/db/flightPlan"
export function getList(){
  return new Promise(async(resolve,reject)=>{
    try{
      const {data:{results:uavFlightPlanLogs}} = await getUavFlightPlanLog()
      await Promise.all(uavFlightPlanLogs.map(async(uavFlightPlanLog:any)=>{
        const {data:{results:[uavFlightPlan]}} = await getUavFlightPlan(uavFlightPlanLog.plan_id)
        uavFlightPlanLog.uavFlightPlan = uavFlightPlan
        const {data:{results:[pilot]}} = await getUavPilot(uavFlightPlan.pilot_id)
        uavFlightPlan.pilot = pilot
        const {data:{results:[uav]}} = await getUav(uavFlightPlan.uav_id)
        uavFlightPlan.uav = uav
        const {data:{results:[tempAirspace]}} = await getTempAirspace(uavFlightPlan.temp_airspace_id)
        uavFlightPlan.tempAirspace = tempAirspace
      }))
      resolve(uavFlightPlanLogs)
    }catch(err){
      reject(err)
    }
  })
}
function getUavFlightPlanLog(){
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
          field:'x.rn',
          relationship:'=',
          condition:1
        }
      ],
    },
    headers: {
      table:encodeURIComponent(`(
        SELECT
          t.*,
          ROW_NUMBER() OVER (
            PARTITION BY plan_id
            ORDER BY created_time DESC
          ) AS rn
        FROM t_uav_flight_plan_log t
      ) x`)
    }
  })
}
function getUavFlightPlan(plan_id:string){
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
          field:'plan_id',
          relationship:'=',
          condition:plan_id
        }
      ],
    },
    headers: {
      table:'t_uav_flight_plan'
    }
  })
}
function getUav(uav_id:string){
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
          field:'uav_id',
          relationship:'=',
          condition:uav_id
        }
      ],
    },
    headers: {
      table:'t_uav'
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
function getUavPilot(pilot_id:string){
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
          field:'pilot_id',
          relationship:'=',
          condition:pilot_id
        }
      ],
    },
    headers: {
      table:'t_uav_pilot'
    }
  })
}
export function 批准(plan_id:string){
  return request({
    url:'/ry_api/api/insert/DK_flight_plan_answer',
    method: 'POST',
    data: {
      "plan_id": plan_id,
      "operate_type": 3
    },
  })
}
export function 驳回(plan_id:string){
  return request({
    url:'/ry_api/api/insert/DK_flight_plan_answer',
    method: 'POST',
    data: {
      "plan_id": plan_id,
      "operate_type": 4
    },
  })
}