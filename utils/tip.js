// 提示是否登录方法
const login = () => {
	uni.showModal({
		title: '登录过期提示',
		content: "是否要登录",
		success: res => {
			if (!res.cancel) {
				uni.navigateTo({
					url: '../login/login'
				})
			}
		}
	})
}
const cartlogin = () => {
	uni.showModal({
		title: '登录过期提示',
		content: "是否要登录",
		success: res => {
			if (res.cancel) {
				uni.switchTab({
					url: '../index/index'
				})
			} else {
				uni.navigateTo({
					url: '../login/login'
				})
			}
		}
	})
}

const format = (shijian = new Date().getTime()) => {
	let date = new Date(shijian)
	var y = date.getFullYear(shijian);
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	h = h < 10 ? ('0' + h) : h;
	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	var second = date.getSeconds();
	second = second < 10 ? ('0' + second) : second;
	return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

//封装数据加载提示的方法
const load = (title = '数据加载中') => {
	uni.showLoading({
		title,
	})
	uni.showNavigationBarLoading()
}
//封装关闭数据提示的方法
const hideload = (title = '数据加载中') => {
	uni.hideLoading()
	uni.hideNavigationBarLoading()
}
//定义弹窗提示方法
const tip = (title="温馨提示",icon='none')=>{
	uni.showToast({
		title,
		icon
	})
}

//定义提示用户登录的方法
const isLogin = (app)=>{
	uni.showModal({
		title:'登录提示',
		content:'没有登陆，请先登录!',
		success:res=>{
			app.globalData.loginStatus = false
			//修改我的tabbar选项卡上的文字
			uni.setTabBarItem({
				index:2,
				text:'未登录'
			})
			if(res.confirm){
				//跳转到登录页面
				uni.navigateTo({
					url:'../login/login'
				})
			}else{
				//取消登录暂不处理
				//如果当前用户访问的是购物车页面我们就帮助用户定向到首页
				//怎么判断当前页面是否是购物车页面
				//通过页面栈函数获取当前页面访问记录
				let pageInfo = getCurrentPages()
				let nowPage = pageInfo[pageInfo.length-1].route
				if(nowPage == 'pages/cart/cart'){
					//跳转到首页
					uni.reLaunch({
						url:'../index/index'
					})
				}
			}
		}
	})
}

module.exports = {
	login,
	cartlogin,
	format,
	load,
	hideload,
	tip,
	isLogin
}
