import request from '~/utils/request'
import moment from 'moment'
export function fetchList({page,size,range}:{page:number,size:number,range:any}){
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
      where: range?[
        {
          "relation": "and",
          "field":"tmBeginApply",
          "relationship":">",
          "condition":moment(range[0]).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          "relation": "and",
          "field":"tmBeginApply",
          "relationship":"<",
          "condition":moment(range[1]).format('YYYY-MM-DD HH:mm:ss')
        }
      ]:[],
      "groupby":['strZydID','strName'],
      "orderby":['strZydID ASC'],
      "distinct": false,
      "offset": (page-1)*size,
      "limit": size
    }
  })
}