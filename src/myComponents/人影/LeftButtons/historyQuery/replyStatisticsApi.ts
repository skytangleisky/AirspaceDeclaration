import request from '~/utils/request'
import moment from 'moment'
import { useUserStore } from '~/stores/user'
export function getList({currentPage,pageSize,range}:{currentPage:number,pageSize:number,range?:any}){
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
    if(range){
        where.push({
          "relation": "and",
          "field":"tmBeginApply",
          "relationship":">",
          "condition":moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
        })
        where.push({
          "relation": "and",
          "field":"tmBeginApply",
          "relationship":"<",
          "condition":moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
        })
    }
  return request({
    url:'/backend/db/default',
    method:'post',
    headers:{
      table:'zydhisdata',
    },
    data:{
      select:[
        "strZydID",
        "strName",
        "count(*) AS 申请次数",
        "SUM(bAnswerValid = 1) AS 批复次数",
        "SUM(bAnswerValid = 1 AND bAnswerAccept = 1) AS 批准次数",
        "SUM(bAnswerValid = 1 AND bAnswerAccept = 0) AS 不批准次数",
        "SUM(bAnswerValid = 0) AS 批复超时次数",
        "ROUND(SUM(bAnswerValid = 1) * 100.0 / COUNT(*), 2) AS 批复率",
        "ROUND(SUM(bAnswerValid = 1 AND bAnswerAccept = 1) * 100.0 / COUNT(*), 2) AS 批准率"
      ],
      where,
      "groupby":['strZydID','strName'],
      "orderby":['strZydID ASC'],
      "distinct": false,
      "offset": (currentPage-1)*pageSize,
      "limit": pageSize
    }
  })
}