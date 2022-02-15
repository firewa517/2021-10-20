<template>
	<view>
		<view class="search">
			<icon type="search" color="white" size="10"></icon>
			<input type="text" value="" placeholder="搜索商品" placeholder-class="placeholder" />
		</view>
		<view class="list">
			<view class="row" v-for="(item,index) in list" :key='index' @click="goDesc(item.id)">
				<image :src="imageurl+item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>
					<text>{{item.price}}</text>
					<text>3565评论</text>
				</view>
			</view>
		</view>
		<view class="api" v-if="dataBuffer">
			暂无商品数据！
		</view>
		<view class="to_top" v-if="topBuffer" @click="toTop">
			<image src="../../static/totop.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	let {
		load,
		hideload
	} = require('@/utils/tip.js');
	export default {
		data() {
			return {
				imageurl: this.$URL,
				type: 1, //初始化分类类型 1一级分类 2二级分类
				list: [], //初始化列表数据
				totalPages: 0, //初始化总页码数
				url: '',
				cateId: '', //初始化分类id
				page: 1, //初始化页码
				size: 6, //分页迁移量
				dataBuffer: false,
				topBuffer: false
			}
		},
		onLoad(options) {
			load();
			//获取页面跳转参数
			let {
				id,
				type
			} = options;
			this.cateId = id;
			this.type = type;
			if (type == 1) { //根据一级分类查询
				this.url = '/getcategoodPage'
			} else { //根据二级分类查询
				this.url = '/getsecondcategoodPage'
			}
			//获取商品列表数据
			this.getList()
		},
		//设置页面滚吨
		onPageScroll(info) {
			let top = info.scrollTop
			if (top > 150) {
				this.topBuffer = true
			} else {
				this.topBuffer = false
			}
		},
		//设置上拉事件
		onReachBottom() {
			if (this.page < this.totalPages) {
				//提示加载中
				load();
				this.page++
				this.getList()
			} else {
				//提示用户不能上拉了
				uni.showToast({
					title: '已经到底了',
					icon: 'none'
				})
			}
		},
		//设置监听下拉更新
		onPullDownRefresh() {
			//提示用户
			load('数据更新中')
			this.list = []
			this.page = 1
			setTimeout(() => {
				this.getList()
			}, 500)
			hideload()
		},
		methods: {
			//定义跳转到商品详情页的方法
			goDesc(id){
				uni.navigateTo({
					url:'../details/details?id='+id
				})
			},
			//快速回到顶部
			toTop(){
				uni.pageScrollTo({
					scrollTop:0,
					duration:200
				})
			},
			//根据分类ID获取商品列表方法
			getList() {
				let data = {};
				if (this.type == 1) {
					data = {
						fid: this.cateId,
						page: this.page,
						size: this.size
					}
				} else {
					data = {
						sid: this.cateId,
						page: this.page,
						size: this.size
					}
				}
				new Promise((resolve, reject) => {
						uni.request({
							url: 'http://localhost:3000/api' + this.url,
							data,
							success: res => {
								resolve(res.data.list)
							}
						})
					})
					.then(res => {
						if (res[0] == 0) {
							this.dataBuffer = true
							setTimeout(() => {
								hideload()
							}, 300)

						} else {
							this.dataBuffer = false
							console.log(res)
							this.list = this.list.concat(res[1])
							this.totalPages = res[0]
							setTimeout(() => {
								hideload()
							}, 300)
							uni.stopPullDownRefresh()
						}
					});
			}
		}

	}
</script>

<style>
	.search {
		margin: 65rpx;
		height: 75rpx;
		background-color: #f26b11;
		border-radius: 80rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	icon {
		margin: 0 10rpx 0 250rpx;
	}

	.placeholder {
		color: white;
		font-size: 25rpx;
	}

	.row {
		position: relative;
		margin: 10rpx 20rpx;
		height: 190rpx;
		border-bottom: 1rpx solid #AAAAAA;
	}

	image {
		position: absolute;
		top: 0;
		left: 10rpx;
		width: 160rpx;
	}

	.info {
		height: 85%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 200rpx;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		font-size: 25rpx;
	}

	.info text:nth-of-type(2) {
		color: red;
	}

	.info text:nth-of-type(3) {
		font-size: 20rpx;
		color: #AAAAAA;
	}

	.api {
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}

	.to_top{
		width:100rpx;
		line-height: 120rpx;
		height: 100rpx;
		text-align: center;
		background-color: #DDD;
		border-radius: 100%;
		position: fixed;
		right: 50rpx;
		bottom: 200rpx;
	}
	.to_top image{
		width: 50rpx;
		padding-left:15rpx ;
		padding-top:15rpx ;
	}
</style>
