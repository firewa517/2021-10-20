<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:{{ information.name }}</label>
				<label for="">{{ information.phone }}</label>
			</view>
			<view class="address_res">
				收货地址：<label for="">{{ information.address }}</label>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="carts">
			<view class="cartsInfo" v-for="(item,index) in orders" :key='index'>
				<!-- 70px -->
				<view class="carts_detail">
					<image :src="item.img" mode="widthFix" style="width:500rpx;"></image>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{item.goodsname}}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:不错的商品</view>
					</view>
					<view class="carts_price">
						<label for="">￥ {{item.price}}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">
						购买数量：
					</view>
					<view class="">
						<label for="" class="jian" @click="changeNum(1,index,item.id)">-</label>
						<label for="" class="num">{{item.num}}</label>
						<label for="" class="jia" @click="changeNum(2,index,item.id)">+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>
			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>

		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use">
				<label for="">使用积分</label>
			</view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分" />
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>

		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥{{jisuan.countMoney}}</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：<label for="" style="color:red">￥{{jisuan.countMoney}}</label>
		</view>

		<!-- 确认订单按钮 -->
		<view class="btn">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary" @click="addorder(jisuan.countMoney,jisuan.countNum)">提交订单</button>
		</view>
	</view>
</template>

<script>
	let {
		format,
		tip,
		load,
		hideload,
		isLogin
	} = require('@/utils/tip.js')
	let app = getApp()
	export default {
		data() {
			return {
				information: {
					name: 'YouSu',
					phone: '18240279221',
					address: '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层',

				},
				orders: [], //初始化订单数据
			}
		},
		onLoad(option) {
			//获取订单数据
			let orders = JSON.parse(option.orders)
			this.orders = orders
		},
		computed: {
			jisuan() {
				let countMoney = 0 //总支付金额
				let countNum = 0 //统计商品的单品数量
				let cartNum = 0 //购物车右上角角标
				this.orders.forEach((item) => {
					if (item.status) {
						countMoney += parseInt(item.num) * parseFloat(item.price)
						countNum += 1
					}
					cartNum += parseInt(item.num)
				})
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
			//定义订单提交事件
			addorder(countmoney, countnumber) {
				//组装data参数
				let addtime = format() 
				let params = {
					uid: app.globalData.userinfo.uid,
					username: "YouSu",
					userphone: "18240279221",
					useraddress: "北京市海淀区隐泉路清林苑6号楼中公优就业总部3层",
					countmoney,
					countnumber,
					addtime,
				}
				let idstr = ''
				this.orders.forEach((item) => {
					idstr += item.id + ','
				})
				idstr = idstr.substr(0, idstr.length - 1)
				console.log(params,idstr)
				new Promise((resolve, reject) => {
						uni.request({
							url: 'http://localhost:3000/api/orderadd',
							data: {
								params,
								idstr
							},
							method: 'POST',
							header: app.globalData.header,
							success: res => {
								resolve(res.data)
							}
						})
					})
					.then(res => {
						if (res.code==200) {
							tip('提交成功')
							//跳转到个人中心页面
							setTimeout(()=>{
								uni.reLaunch({
									url:'../mine/mine'
								})
							
							},1000)
						} else if (res.code==403) {
							isLogin(app);
							return
						} else {
							tip('请重试')
						}
					})

			},
			//定义++--操作
			changeNum(type, index, id) {
				if (type == 1) { //--操作
					if (this.orders[index].num == 1) {
						tip('请到购物车删除')
						return
					}
					--this.orders[index].num
				} else { //++操作++
					++this.orders[index].num
				}
				let {
					header
				} = app.globalData
				//对数据表进行操作
				new Promise((resolve, reject) => {
						uni.request({
							url: 'http://localhost:3000/api/cartedit',
							data: {
								id,
								type
							},
							method: 'POST',
							header,
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
		}

	}
</script>

<style>
	@import url("../../common/css/confirm.css");
</style>
