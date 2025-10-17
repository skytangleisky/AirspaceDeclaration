import axios from 'axios'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '/' // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    config.headers['Authorization'] = localStorage.getItem('access_token')

    config.headers['database'] = JSON.stringify({"host":"10.224.91.136","port":5138,"database":"BEPK_APP_STDB","schema":"BEPK_RYB_GSYTHPT","user":"BEPK_RYB_GSYTHPT","password":"Bjryzx_2023!","type":"xugu"})//北京
    // config.headers['database'] = JSON.stringify({"host":"192.168.0.114","port":5138,"database":"BEPK_APP_STDB","schema":"BEPK_RYB_GSYTHPT","user":"BEPK_RYB_GSYTHPT","password":"Bjryzx_2023!","type":"xugu"})//北京
    // config.headers['database'] = JSON.stringify({"host":"192.168.0.135","port":5138,"database":"SYSTEM","schema":"BEPK_RYB_GSYTHPT","user":"SYSDBA","password":"SYSDBA","type":"xugu"})
    // config.headers['database'] = JSON.stringify({"host":"192.168.0.240","port":3306,"user":"root","password":"mysql","database":"ryplat_shanxi","type":"mysql"})//陕西测试
    // config.headers['database'] = JSON.stringify({"host":"10.172.20.43","port":33060,"user":"root","password":"SxryMysql#1234","database":"ryplat_shanxi","type":"mysql"})//陕西现场
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response
  },
  error => {
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
