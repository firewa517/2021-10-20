]<template>
	<view>
		<uni-search-bar :radius="100" bgColor="#ffff" @confirm="search" @input="input" @cancel="cancel"></uni-search-bar>
		<view class="list" v-if="buffer">
			<view class="row">
				<view class="imagebox">
					<image src="../../static/classify/2.jpg" mode="widthFix" ></image>
				</view>
				<view class="info">
					<text  space="nbsp">总计1商品  </text>  
					<text>应付金额 ￥:100</text>
				</view>
			</view>
		</view>
		<view class="api" v-else>  
			没有数据亲！
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'; 
	let {
		tip,
		load,
		hideload,
		isLogin
	} = require('@/utils/tip.js')
	let app = getApp()
	export default {
		components: {uniSearchBar},
		data() {
			return {
				img:this.$URL,
				orders:[],
				buffer:true,//页面显示开关,
			}
		},
		onShow(options){
			if(!app.globalData.loginStatus){
				isLogin(app);return;
			}
			load()
			this.getOrder()
		},
		methods: {
			//定义获取订单数据的方法
			getOrder(){
				new Promise((resolve, reject) => {
						uni.request({
							url: 'http://localhost:3000/api/orderlsit',
							data: {
								uid:app.globalData.userinfo.uid	
							},
							header: app.globalData.header,
							success: res => {
								resolve(res.data)
							}
						})
					})
					.then(res=>{
						console.log(res)
						if (res.code==200) {
							if(res.list = null){
								this.buffer = false
							}else{
								this.buffer = true
								this.orders = res.list
								
							}
						} else if (res.code==403) {
							isLogin(app);
							
						} else {
							tip('请重试')
						}
						hideload()
					})
					
			}
		}
		
	}
</script>

<style>

	.row{
		position: relative;
		margin: 10rpx 20rpx;
		height: 240rpx;
		border: 1rpx solid #AAAAAA;
		border-radius: 30rpx;
	}
	
	.imagebox{
		position: absolute;
		top: 10rpx;
		left:10rpx;
		display: flex;
		align-items: center;
	}
	image{
		width: 160rpx;
		margin-left: 10rpx;
	}
	.info{
		position: absolute;
		top: 180rpx;
		right: 50rpx;
		display: flex;
		justify-content: space-between;
		font-size: 25rpx;
		width: 340rpx;
	}
	.info text:nth-of-type(2){
		color: red;
	}
	.info text:nth-of-type(3){
		font-size: 20rpx;
		color: #AAAAAA;
	}
	.api{
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>
