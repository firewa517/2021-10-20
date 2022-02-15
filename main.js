//导入vue组件
import Vue from 'vue'

// 导入根组件app
import App from './App'

// 取消生产提示
Vue.config.productionTip = false

//指定根组件类型
App.mpType = 'app'

//引入网络请求方法，挂载到原型链上
import http from 'utils/request.js'
Vue.prototype.$http = http

//引入业务域名信息
import URL from 'utils/config.js'
Vue.prototype.$URL = URL


// 实例化vue组件
const app = new Vue({
    ...App
})
// 进行挂载
app.$mount()
