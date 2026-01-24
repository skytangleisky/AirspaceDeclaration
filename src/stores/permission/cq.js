export default {
  name:'8f66c572-7d02-4050-8715-cfb59176c700',
  meta:{
    label:'江西省空域申报服务平台',
    roles:['admin']
  },
  children:[
    {
      name: 'cd8b124a-ccb9-4acc-8996-6eaf9ead3113',
      checked:true,
      meta:{
        label: '开发工具',
      }
    },
    {
      name:'9b62e3ca-1343-451c-9bc8-a791cd73c5de',
      meta:{
        label:'分区批复系统',
      },
      children:[
        {
          name:'93b9a642-3f07-419a-b8cb-9cb56608955f',
          meta:{
            label:'左侧按钮组'
          },
          children:[
            {
              name:'505dd0ac-c6e7-4408-90b4-8afd2cb3baf3',
              checked:true,
              meta:{
                label:'信息交互',
              }
            },
            {
              name: '722f756d-765b-4778-801c-02ba7433268a',
              checked:true,
              meta:{
                label: '告警控制',
              }
            },
            {
              name: '1f27715c-90ea-488b-a1b2-2d85b4f53160',
              checked:true,
              meta:{
                label: '人影参数',
              }
            },
            {
              name: '522394cc-7331-4681-9531-a812838a5148',
              checked:true,
              meta:{
                label: '辅助管理',
              }
            },
            {
              name: 'a6ad4781-2b57-4da9-9fe6-cbbf1da87944',
              checked:true,
              meta:{
                label: '历史查询统计',
              }
            },
            {
              name: '52dca185-d4be-4eb8-a51a-0d7ec9bac220',
              checked:true,
              meta:{
                label: '查询统计',
              }
            },
            {
              name: '92cf967e-0d04-42b5-b1d0-930ba129822a',
              checked:true,
              meta:{
                label: '轨迹回放',
              }
            },
            {
              name: '550fe8a1-9cc0-44c2-9604-03f4a24f07c8',
              checked:true,
              meta:{
                label: '显示设置',
              }
            },
          ]
        }
      ]
    },
    {
      name:'1f7e4b5a-974c-43fe-848d-cbe9de0e076c',
      meta:{
        label:'人影指挥中心',
      },
      children:[
        {
          name:'0a049c31-0648-4821-b598-0777dffbc34e',
          checked:true,
          meta:{
            label:'作业点列表',
          }
        },
        {
          name: '12afdacf-0255-46d9-a0ec-7d9b2fc157da',
          checked:true,
          meta:{
            label: '右上角菜单',
          }
        },
        {
          name: 'ff7bb524-5b7b-4343-b1c7-1f4e0070b436',
          checked:true,
          meta:{
            label: '左下角菜单组',
          },
          children:[
            {
              name: '04bca30f-14c9-4b4c-a93e-1155b792250e',
              checked:true,
              meta:{
                label: '当前作业进度',
              }
            },
            {
              name: '2c50aec7-971a-4dfc-b93a-384738f0c9cf',
              checked:true,
              meta:{
                label: '今日作业记录',
              }
            },
            {
              name: '1cb7188d-4da9-47b9-b694-504d73252609',
              checked:true,
              meta:{
                label: '空域流转信息',
              }
            },
            {
              name: '9ab19aac-6926-4667-a749-5dfd09869198',
              checked:true,
              meta:{
                label: '完成信息查询',
              }
            },
            {
              name: '773bffb5-1507-4e8b-a16c-bcb584882f87',
              checked:true,
              meta:{
                label: '人影飞机',
              }
            },
          ]
        },
        {
          name: '78e09c3c-bcd2-47b3-b1bc-287ba83b8d0a',
          checked:true,
          meta:{
            label: '右下角工具箱',
          }
        },
      ]
    }
  ]
}