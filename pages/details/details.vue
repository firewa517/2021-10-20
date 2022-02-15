<template>
	<view class="container">
		<!-- 详情图片 -->
		<view class="detailImage">
			<image :src="desc.img">
		</view>
		<!-- 详情基本信息 -->
		<view class="detailInfo">
			<view class="detailInfoName">
				<label>{{desc.goodsname}}</label>
			</view>
			<view class="detailInfoPrice">
				<label style="color: red;">￥ {{desc.price}}</label>
				<label style="font-size: 24rpx;color: #ccc;">(此价格不与套装优惠同时享受)</label>
			</view>
		</view>

		<!-- 基本信息改变 -->
		<view class="changeInfo">
			<view class="youhui">
				<view>促销：<label class="manjian">满减</label><label class="dazhe">满2件9折；3件8折</label></view>
			</view>
			<!-- 数量加减 -->
			<view class="changeNum">
				<view class="num">购买数量</view>
				<view class="action">
					<label class="jian" @click="changeNum(1)">-</label>
					<label class="zhi">{{desc.num}}</label>
					<label class="jia" @click="changeNum(2)">+</label>
				</view>
			</view>
			<!-- 商品属性 -->
			<view class="changeState">
				<view class="productStat">
					<label for="">商品属性</label>
				</view>
				<view class="productGuige">
					<label>{{desc.specsname}}</label>
					<view :class="activeIndex == index?'changethreed3i1': 'threed3i1'"
						v-for="(item,index) in desc.specsattr" :key='index' @click="changeAttr(index)">{{item}}</view>
				</view>
			</view>
		</view>
		<!-- 商品详情 -->
		<view class="productDetail">
			<view class="productDetailTitle">商品详情</view>
			<!-- 需要处理图片自适应问题 -->
			<image :src="productDetailImage.detailImage" mode="widthFix" style="width: 100%;" />
		</view>

		<view class="productEval">
			<view class="eval">商品评价</view>
			<view v-for="(item,index) in evals" :key="index">
				<label class="evalUsername">{{item.name}}</label>
				<label class="evalUsertitle">{{item.title}}</label>
				<view class="evalImage">
					<image v-for="(i,ind) in item.img" :key="ind" :src="i">
				</view>
				<label class="evalTime">{{item.time}}</label>
			</view>
		</view>
		<!-- 底部按钮 -->
		<view class="foot">
			<button class="footbtn1" @click="cartadd()">加入购物车</button>
			<button class="footbtn2">立即购买</button>
		</view>
	</view>
</template>

<script>
	//引入提示模块
	let {
		tip,
		load,
		hideload,
		isLogin
	} = require('@/utils/tip.js')
	let app = getApp()
	export default {
		data() {
			return {
				activeIndex: 0,
				desc: {}, //初始化详情数据
				productDetailImage: {
					detailImage: "../../static/detail/2.jpg"
				},
				evals: [{ //评价内容
					name: '小李白',
					title: '效果很好，物流到位，下次继续来',
					img: ["../../static/detail/pingjia1.jpg", "../../static/detail/pingjia1.jpg",
						"../../static/detail/pingjia1.jpg", "../../static/detail/pingjia1.jpg",
						"../../static/detail/pingjia2.jpg", "../../static/detail/pingjia3.jpg"
					],
					time: '2020-01-13'
				}]
			}
		},
		onLoad(options) {
			load()
			let id = options.id
			//根据商品的id获取详情数据
			this.$http({
					url: '/getgoodsinfo',
					data: {
						id
					}
				})
				.then(res => {
					//获取返回的商品详情数据
					let data = res.list[0]
					//处理图片路径
					data.img = this.$URL + data.img;
					//处理商品的属性 将字符串转换成数组
					data.specsattr = data.specsattr.split(',')
					//追加上购买数量
					data.num = 1
					//将处理好的商品详情页面赋值给页面
					this.desc = data
					hideload()
				})
				console.log(this.desc)
		},
		onShow() {

		},

		methods: {
			//添加购物车
			cartadd() {
				let {
					loginStatus,
					userinfo,
					header
				} = app.globalData
				//判断用户是否登录
				if (!loginStatus) {
					isLogin(app);return
				}
				new Promise((resolve, reject) => {
					uni.request({
						url: 'http://localhost:3000/api/cartadd',
						data: {
							uid: userinfo.uid,
							goodsid: this.desc.id,
							num: this.desc.num
						},
						method: "POST",
						header:header,
						success: res => {
							resolve(res)
						}
					})
				})
				.then(res=>{
					console.log(res.data)
					if(res.data.code ==200){
						tip('添加成功','success')
					}else if(res.data.code == 403){
						isLogin(app)
					}else{
						tip('添加失败')
					}
				})
			},
			//切换商品属性
			changeAttr(index) {
				this.activeIndex = index
			},
			//数量加减
			changeNum(type) {
				if (type == 1) {
					this.desc.num = this.desc.num <= 1 ? 1 : --this.desc.num
				} else {
					this.desc.num = this.desc.num >= 5 ? 5 : ++this.desc.num
				}
			}

		}

	}
</script>

<style>
	@import url("../../common/css/details.css");
</style>
