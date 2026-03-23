// @ts-check
import { defineStore, acceptHMRUpdate } from "pinia"
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    lang: 'zh-cn',
    username: '',
    // strUnitID: '360112000',
    // strCode: '360112000',
    // strName: '新建区',
    // roles:new Array<string>('admin','人影'),
    // strUnitID: '360100000',
    // strCode: '360100000',
    // strName: '南昌市',
    // roles:new Array<string>('admin','人影'),
    // strUnitID: '360000000',
    // strCode: 'JXRY',
    // strName: '江西省',
    // roles:new Array<string>('admin','人影'),
    strUnitID: '510000000',
    strCode: '510000000',
    strName: '四川省',
    roles:new Array<string>('admin','人影'),
    // strUnitID: '990303000',
    // strCode: '990303000',
    // strName: '漳州空管',
    // roles:new Array<string>('admin','分区'),
    isAdmin: true,
    token: '',
    avatar: '',
    logined: false,
    defaultActive: 'a7ef7b88-5e6b-0c62-129b-00a18980cdce',
    defaultOpends:['65e99b66-e340-4d4b-6b26-629f41dc63d9'],
  }),
  persist: true,
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}