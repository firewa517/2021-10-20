<template>
	<view class="container" v-if="buffer">
		<view class="top">
			<scroll-view class="scroll-view_H" scroll-x="true" :scroll-left="item.left" v-for="(item,index) in cartlist"
				:key='index' @scroll="changeScroll($event,index)">
				<view class="cartInfo" id="demo1">
					<!-- 明日来写购物车基本信息 -->
					<view class="cartInfochild">
						<!-- 选择框 -->
						<view class="cartInfo_switch common">
							<!-- 点击当前商品 -->
							<switch type="checkbox" :checked="item.status" @change="changeOne($event,index)" />
						</view>
						<!-- 图片 -->
						<view class="cartInfo_image common">
							<image :src="item.img" mode="widthFix"></image>
						</view>

						<!-- 信息 -->
						<view class="cartInfo_info">
							<label style="font-size: 26rpx;">{{item.goodsname}}</label>
							<label style="font-size: 24rpx; color: #ccc;">规格：不错的商品</label>
							<label style="color: red;">￥{{item.price}}</label>
						</view>
						<!-- 加减数量 -->
						<view class="cartInfo_num">
							<view class="cartInfo_num_child">
								<label @click="changeNum(1,index,item.id)">-</label>
								<label>{{item.num}}</label>
								<label @click="changeNum(2,index,item.id)">+</label>
							</view>
						</view>
					</view>

				</view>
				<view class="cartDel" id="demo2" @click="cartdel(index,item.id)">
					<label for="">删除</label>
				</view>
			</scroll-view>
		</view>

		<!-- 底部 -->
		<view class="foot">
			<view class="footd1">
				<switch type="checkbox" :checked="allStatus" @change="changeAll" />
				<label>全选</label>
			</view>
			<view class="footd2">
				<view class="footd2sp1">总计：<label style="color: red;">{{jisuan.countMoney}}</label></view>
				<label class="footd2sp2">不含运费，已优惠￥0.00</label>
			</view>
			<!-- 跳到提交订单，结算页面 -->
			<view class="footd3" @click="addorder">
				<!-- 被选中的商品的个数 -->
				<label>去结算({{jisuan.countNum}}件)</label>
			</view>
		</view>

	</view>
	<view v-else>
		<image src="/static/kk.jpg" mode="widthFix"></image>
	</view>
</template>

<script>
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
				scrollLeft: 0, //默认横向滚动 0,
				buffer: true, //检测购物车是否有数据
				cartlist: [],
				allStatus: true,
				header: {}, //初始化header
				userinfo: {}, //初始化用户基本信息
			}
		},
		// 页面显示时
		onShow() {
			let {
				loginStatus,
				userinfo,
				header
			} = app.globalData
			this.header = header;
			this.userinfo = userinfo;
			if (!loginStatus) {
				isLogin(app);
				return
			}
			load()
			//获取购物车数据
			this.getCart()
		},
		//计算属性 动态计算商品的金额和数量
		computed: {
			jisuan() {
				let countMoney = 0 //总支付金额
				let countNum = 0 //统计商品的单品数量
				let cartNum = 0 //购物车右上角角标
				this.cartlist.forEach((item) => {
					if (item.status) {
						countMoney += parseInt(item.num) * parseFloat(item.price)
						countNum += 1
					}
					cartNum += parseInt(item.num)
				})
				//生成购物车右上角角标内容
				if (cartNum > 0) {
					this.buffer = true
					uni.setTabBarBadge({
						index: 1,
						text: cartNum.toString()
					})
				} else {
					this.buffer = false
					uni.removeTabBarBadge({
						index: 1
					})
				}
				return {
					countMoney,
					countNum
				}
			}
		},
		methods: {
			//定义跳转到订单确认页面的方法
			addorder(){
				//传递用户选中的购物车商品信息
				let data = []
				this.cartlist.forEach((item)=>{
					if(item.status){
						data.push(item)
					}
				})
				//跳转到订单确认页面
				uni.navigateTo({
					url:'../confirm/confirm?orders='+JSON.stringify(data)
				})
			},
			//实时监听滚动视图左滑
			changeScroll(e,index){
				console.log(e,index)
				this.cartlist[index].left = e.detail.scrollLeft
			},
			//定义删除操作
			cartdel(index, id) {
				uni.showModal({
					title: '是否要删除',
					content: '删除后不可恢复',
					success: res => {
						if (res.confirm) {
							new Promise((resolve, reject) => {
									uni.request({
										url: 'http://localhost:3000/api/cartdelete',
										data: {
											id
										},
										method: 'POST',
										header: this.header,
										success: res => {
											resolve(res.data)
										}
									})
								})
								.then(res => {
									if (res.code == 200) {
										//清除页面节点
										this.cartlist.splice(index, 1)
									} else if (res.code == 403) {
										isLogin(app);
										return
									} else {
										tip('请重试')
									}
								})
						}
					}
				})
			},
			//定义++--操作
			changeNum(type,index, id) {
				if (type == 1) { //--操作
					if (this.cartlist[index].num == 1) {
						tip('请左滑删除')
						return
					}
					--this.cartlist[index].num
				} else { //++操作++
					++this.cartlist[index].num
				}
				//对数据表进行操作
				new Promise((resolve, reject) => {
						uni.request({
							url: 'http://localhost:3000/api/cartedit',
							data: {
								id,
								type
							},
							method: 'POST',
							header: this.header,
							success: res => {
								resolve(res.data)
							}
						})
					})
					.then(res => {
						if (res.code == 200) {
							console.log(res)
						} else if (res.code == 403) {
							isLogin(app);
							return
						} else {
							tip('请重试')
						}

					})
			},
			//定义单选
			changeOne(e, index) {
				let nowStatus = e.detail.value
				//修改改数据下的status状态值
				this.cartlist[index].status = nowStatus
				//同步检测全选状态
				this.checkAll()
			},
			//全选
			changeAll(e) {
				this.allStatus = e.detail.value
				this.cartlist.forEach((item) => {
					item.status = this.allStatus
				})
			},
			//全选状态的方法
			checkAll() {
				//findindex
				let index = this.cartlist.findIndex((item) => {
					return item.status == false
				})
				if (index != -1) {
					this.allStatus = false
				} else {
					this.allStatus = true
				}
			},
			getCart() {
				new Promise((resolve, reject) => {
						uni.request({
							url: 'http://localhost:3000/api/cartlist',
							data: {
								uid: this.userinfo.uid,
							},
							header: this.header,
							success: res => {
								resolve(res.data)
							}
						})
					})
					.then(res => {
						if (res.code == 200) {
							if (res.list == null) {
								this.buffer = false
								hideload()
							} else {
								this.buffer = true
								let data = res.list
								//循环处理购物车数据
								data.forEach((item) => {
									item.img = this.$URL + item.img
									item.status = true
									item.left = 0 //追加左滑起点位置
								})
								this.cartlist = data
							}
						} else if (res.code == 403) {
							//提示登录
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
	@import url("../../common/css/cart.css");

	.cartInfo_image_img {
		width: 120rpx;
		height: 120rpx;
	}
</style>
