import moment from 'moment'
import request from '../../utils/request'
import { fromDMS } from '~/tools'
export function getDevice(){
  return request({
    url: 'backend/ry_device',
    method: 'get',
  })
}

export function getTodayRecords(){
  return request({
    url: '/ry_api/api/apply/airspace/today_list',
    method: 'post',
  })
}
export function airspaceApply(data){
  let pos = fromDMS(data.strPos)
  let targetData = {
    "zydID": data.strID,
    "workRevID": data.strMgrUnit,
    "longitude": pos[0].toString(),
    "latitude": pos[1].toString(),
    "shootRange": data.iMaxShotRange,
    "maxShootHeight": data.iMaxShotHei,
    "startShotDirention": data.iShotRangeBegin.toString(),
    "endShotDirention": data.iShotRangeEnd.toString(),
    "applyBeginTime": moment().format('YYYY-MM-DD ')+data.beginTime,
    "workTimeLen": data.duration*60,
    "workCat": data.iWeapon,//0:火箭 1:高炮 2:火箭+高炮 3:烟炉 4:火箭+烟炉 5:高炮+烟炉 6:火箭+高炮+烟炉(测试无效)
  }
  return request({
    url: '/ry_api/api/apply/airspace/',
    method: 'post',
    data:targetData
  })
}

export function airspacesApply(data){
  return request({
    url: '/ry_api/api/multi/apply/airspace/',
    method: 'post',
    data
  })
}