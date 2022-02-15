<template>
	<view class="">
		<!-- 搜索框区域 -->
		<view class="head">
			<image src="../../static/index/logo.jpg" mode="widthFix"></image>
			<view class="searchview">
				<input type="text" value="" placeholder="寻找商品" @focus="getsearch" />
			</view>
		</view>
		<!-- 快速分类导航 滚动视图 -->
		<scroll-view scroll-x class="quicknav">
			<view v-for="(item,index) in quicknav" :key="index" @click="changeCate(index,item.id)">
				<text :class="index == topindex ? 'navactive' : '' "
					@click="changeIndex(index)">{{item.catename}}</text>
			</view>
		</scroll-view>
		<!-- 轮播图 -->
		<swiper indicator-dots circular autoplay interval="3000" duration="1000">
			<swiper-item v-for="(item,index) in swipers" :key="index">
				<image :src="url+item.img" mode=widthFix></image>
			</swiper-item>
		</swiper>
		<!-- 功能导航 -->
		<view class="funnav">
			<view class="funnavrow" v-for="(item,index) in funNavList" :key="index" @click="goCate(index)">
				<image :src="item.icon" mode="widthFix"></image>
				<text>{{item.name}}</text>
			</view>
		</view>
		<!-- 秒杀商品推荐区域 -->
		<view class="seckill">
			<!-- 秒杀左侧区域 -->
			<view class="leftseckill">
				<view class="title">
					<image src="../../static/index/xianshi.jpg" mode="widthFix"></image>
					<text>限时秒杀</text>
				</view>
				<view class="info">
					<text>每天零点场，好货抢不停</text>
				</view>
				<view>
					<countdown :startTime="startTime" :endTime="endTime" />
				</view>
				<image :src="skilldata.img" mode="widthFix" class="goodimg"></image>
			</view>
			<!-- 秒杀右侧区域 -->
			<view class="rightseckill">
				<view class="top">
					<view class="topinfo">
						<text>品牌上新 <text style="background: #f33182;font-size: 28rpx;color: white;">折</text></text>
						<text>每天九点，抢大牌</text>
					</view>
					<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
				</view>
				<view class="bottom">
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
					<view class="bottomgood">
						<text>每日十件</text>
						<text>只为您好选</text>
						<image src="../../static/index/goods1.jpg" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 广告图片推送区域 -->
		<view class="gg">
			<image src="../../static/index/swiper1.jpg" mode="widthFix"></image>
		</view>
		<!-- 推荐商品区域 -->
		<view class="recommendgood">
			<!-- 推荐导航 -->
			<view class="recommendnav">
				<view :class="hortActive==0?'recommendactive':''" @click="changeHortindex(0)">
					<text>热门推荐</text>
				</view>
				<view :class="hortActive==1?'recommendactive':''" @click="changeHortindex(1)">
					<text>上新推荐</text>
				</view>
				<view :class="hortActive==2?'recommendactive':''" @click="changeHortindex(2)">
					<text>所有商品</text>
				</view>
			</view>
			<view class="recommendlist">
				<view class="recommendrow" v-for="(item,index) in hortGoods" :key='index' @click="goDesc(item.id)">
					<image :src="url + item.img" mode="widthFix"></image>
					<view class="recommendrowinfo">
						<text>{{item.goodsname}}</text>
						<text>现价格： ￥{{item.price}}</text>
						<text>原价格：￥{{item.market_price}}</text>
						<text>
							立即抢购
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import countdown from "@/components/cz-countdown/cz-countdown.vue"
	let {
		format
	} = require('@/utils/tip'); //时间处理函数
	export default {
		components: {
			countdown
		},
		data() {
			return {
				url: this.$URL,
				startTime: '',

				endTime: '',
				skilldata: {},
				quicknav: [], //快速分类导航,
				topindex: 0,
				swipers: [], //轮播图
				products: [], //热销、上新、所有商品数据
				hortGoods: [], //热门推荐
				hortActive: 0, //初始化推荐下标
				funNavList: [{ //功能导航数据
						name: "限时抢购",
						icon: require("../../static/index/xiaohuoban.png")
					},
					{
						name: "积分商城",
						icon: require("../../static/index/jifentixicopy.png")
					},
					{
						name: "联系我们",
						icon: require("../../static/index/lianxiwomen.png")
					},
					{
						name: "商品分类",
						icon: require("../../static/index/-shangpinfenlei-gai.png")
					}
				],
			}
		},
		onLoad() {

			//获取首页分类导航数据
			this.getCate();
			//获取首页轮播图数据
			this.getBanner();
			//获取首页秒杀商品信息
			this.getSekill();
			//获取首页商品推荐数据
			this.getHortGoods()
		},
		methods: {
			//定义跳转到商品详情页的方法
			goDesc(id){
				uni.navigateTo({
					url:'../details/details?id='+id
				})
			},
			//跳转到商品搜索页面的方法
			getsearch(){
				uni.navigateTo({
					url:'../search/search'
				})
			},
			//定义跳转到商品列表的方法
			changeCate(index,id){
				//修改导航分类默认下标
				this.topindex = index
				//延迟跳转
				setTimeout(()=>{
					uni.navigateTo({
						url:'../product/product?id='+id+'&type=1'
					})
				},300)
			},
			changeIndex(index) {
				this.topindex = index
			},
			changeHortindex(index) {
				this.hortActive = index
				//修改默认展示的推荐数据
				this.hortGoods = this.products[index].content
			},
			//定义请求首页分类导航数据方法
			getCate() {
				this.$http({
						url: '/getcate'
					})
					.then(res => {
						this.quicknav = res.list
					})
					.catch(err => {
						console.log(err)
					})
			},
			//定义首页轮播图方法
			getBanner() {
				this.$http({
						url: '/getbanner'
					})
					.then(res => {
						this.swipers = res.list

					})
					.catch(err => {
						console.log(err)
					})
			},
			//定义首页秒杀商品数据方法
			getSekill() {
				this.$http({
						url: '/getseckill'
					})
					.then(res => {
						console.log(res)
						this.skilldata = res.list[0] //获取第一条秒杀数据即可
						this.skilldata.img = this.$URL + this.skilldata.img //处理图片路径问题
						//处理秒杀时间,以当前时间为开始时间
						this.startTime = format(new Date())
						this.endTime = format(parseInt(this.skilldata.endtime))
					})
			},
			//定义获取首页推荐商品方法
			getHortGoods() {
				new Promise((resolve, reject) => {
					uni.request({
						url: 'http://localhost:3000/api/getindexgoods',
						method: "GET",
						success: res => {
							resolve(res.data.list)
						}
					})
				})
				.then(res => {
					this.products = res
					this.hortGoods = this.products[0].content
				});

			},
			//跳转到商品分类页面
			goCate(index){
				if(index==3){
					uni.navigateTo({
						url:'../classify/classify'
					})
				}
			}

		}
	}
</script>

<style>
	@import url("../../common/css/index.css");
</style>
