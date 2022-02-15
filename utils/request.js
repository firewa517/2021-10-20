//引入业务域名信息
import URl from './config.js'

//定义并导出网络请求方法
//options:object
export default (options) => {
	let url = URl + '/api' + options.url 
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data: options.data || {},
			method: options.method || "GET",
			header: options.header || {
				"content-type":"application/json"
			},
			success:res=>{resolve(res.data)},
			fail: reject 
		})
	})
}
