<template>
	<view>
		<uniSearchBar :radius="100" bgColor="#ffff" @confirm="search" @input="input"></uniSearchBar>
		<view class="list" v-if="buffer">
			<view class="row" v-for="(item,index) in list" :key="index">
				<image :src="url+item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>
					<text>{{item.price}}</text>
					<text>3565评论</text>
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
		load,
		hideload,
		tip
	} = require('@/utils/tip.js')
	export default {
		components: {
			uniSearchBar
		},
		data() {
			return {
				url: this.$URL,
				buffer: true, //页面显示开关,
				list: []
			}
		},
		onLoad(options) {

		},

		methods: {
			input() {

			},
			search(e) {
				//获取用户搜索关键词
				let keywords = e.value
				//判断是否传入关键词
				if (keywords.trim() == '') {
					tip('请先输入关键词')
					return
				}
				//执行搜索
				this.$http({
						url: '/search',
						data: {
							keywords
						}
					})
					.then(res => {
						if (res.list == null) {
							this.buffer = false
						} else {
							this.buffer = true
							this.list = res.list
						}
					})
			},
			//定义获取商品获取方法(搜索关键词)
			getSearch() {

			}

		},

	}
</script>

<style>
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
</style>
