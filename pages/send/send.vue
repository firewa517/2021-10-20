<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" v-model="phone" maxlength="11" />
		</view>
		<view class="row">
			<view class="send">
				<text>验证码</text>
				<text @click="getcode()">{{str}}</text>
			</view>
			<input type="text" placeholder="- - - -" maxlength="4" v-model="code" />
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<button type="primary" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;"
				@click="login()">登录</button>
		</view>
		<view class="row">
			<text style="color: #006699;text-align: center;">通过微信授权登录</text>
		</view>
	</view>
</template>

<script>
	let {
		tip
	} = require('@/utils/tip.js')
	let app = getApp()
	export default {
		data() {
			return {
				phone: '', //初始化手机号
				code: '', //初始化手机验证码
				str: '获取验证码',
				buffer: true
			}

		},
		onLoad() {},
		methods: {
			//登录事件
			login() {
				//获取用户手机号和验证码
				let phone = this.phone
				//判断手机号是否合法
				if (!/^1[3456789]\d{9}/.test(phone)) {
					tip('手机号格式错误！');
					return
				}
				let {value,time} = uni.getStorageSync('code')
				if (new Date().getTime() - time > 5000000) {
					tip('验证码已经过期')
					return
				}
				if (value != this.code) {
					tip('验证码输入有误')
					return
				}
				new Promise((resolve, reject) => {
					uni.request({
						url: 'http://localhost:3000/api/wxlogin',
						data:{phone},
						method: "GET",
						success: res => {
							resolve(res)
						}
					})
				})
				.then(res=>{
					//将服务端返回的用户信息储存到缓存中
					uni.setStorageSync('userinfo',res.data.list)
					//将全局的登录状态设置为true
					app.globalData.loginStatus = true
					//将用户信息存储在全局变量中 
					app.globalData.userinfo = res.data.list
					//将token赋值给globaldata。header
					app.globalData.header.authorization = res.data.list.token
					//跳转到用户页面
					tip('登陆成功','success')
					setTimeout(()=>{
						uni.reLaunch({
							url:'../mine/mine'
						})
					},1000)
				})
				
			},
			//定义获取验证码的方法
			getcode() {
				if (this.buffer) {
					let phone = this.phone
					//判断手机号是否合法
					if (!/^1[3456789]\d{9}/.test(phone)) {
						tip('手机号格式错误！');
						return
					}
					//执行获取短信验证码
					this.$http({
							url: '/sms',
							data: {
								phone
							}
						})
						.then(res => {
							if (res.code == 200) {
								this.buffer = false
								//将后端返回的验证码存再本地缓存中
								uni.setStorageSync('code', {
									value: res.list.code,
									time: new Date().getTime()
								})
								//实现倒计时效果
								let time = 60
								let t = setInterval(() => {
									this.str = time + 's后发送'
									time--
									if (time == 0) {
										clearInterval(t)
										time = 60
										this.str = '获取验证码'
										this.buffer = true
									}
								}, 1000)
							} else {
								tip('发送失败请重试')
							}

						})
				} else {
					tip('请稍后发送')
				}

			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	/* @import url("../../common/css/index.css"); */
	.box {
		position: relative;
	}

	.row {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}

	.send {
		display: flex;
		justify-content: space-between;
	}

	.send text:nth-of-type(2) {
		color: #00BB00;
	}

	text {
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}

	input {
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}
</style>
