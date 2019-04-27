import axios from 'axios'
// import qs from 'qs'
import {Promise} from 'es6-promise'
import {message} from 'antd'
import * as Utils from './utils'
//axios请求拦截器
const BaseUrl =process.env.NODE_ENV === "production" ? '/':'/'
const MyAxios = axios.create({
    baseURL:BaseUrl
})
MyAxios.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    if (config.method === "post") {
        let XCSRFToken = Utils.getCookies('csrftoken')||''
        // config.data = qs.stringify(config.data)
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        config.headers['X-CSRFToken'] = XCSRFToken
    }
    return config
}, (error) => {
    return Promise.reject(error)
})
//axios服务器响应拦截器
MyAxios.interceptors.response.use(
    response => {
        if (response.status === 200) {
           if(!response.data.success){           
                message.error(response.data.msg?response.data.msg:`${response.request.responseURL} 接口异常`)
           }
           if(response.data.code===403){
                // session_id过期需重新登录
                window.location = `/login?next=${window.location.pathname}`
           }
        }
        return response
    },
    error => {
        if(error.response.status===403){
            //没有csrftoken让用户登录
            window.location = `/login?next=${window.location.pathname}`
        }else{
            message.error(`${error.response.request.responseURL} 接口异常 code:${error.response.status}`)
        }     
        return Promise.reject(error.response.data)
})

class BaseRequest{
    get(url, params){
        return MyAxios({
            method: 'get',
            url: url,
            params: params||{}
        })
    }
    post(url,data){
        return MyAxios({
            method: 'post',
            url: url,
            data: data||{}
        })
    }
}
export default BaseRequest
