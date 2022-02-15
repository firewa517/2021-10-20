<script>
	let {isLogin} = require('@/utils/tip.js')
	// 项目的根组件
	export default {
		//才用小程序的全局变量定义方式
		globalData: {
			loginStatus: true, //用户登录状态
			userinfo:{}, //初始化用户基本信息
			header:{
				'content-type':'application/json',
				'authorization':''
			}
		},
		onLaunch() {
			//判断用户是否登录
			let userinfo = uni.getStorageSync('userinfo') || ''
			if (userinfo == '') {
				this.globalData.loginStatus == false
				isLogin(this)
			} else {
				//已经登录存储在全局变量
				this.globalData.userinfo = userinfo
				this.globalData.header.authorization = userinfo.token
			}
		},
	}
</script>

<style>
	/*每个页面公共css */
</style>
