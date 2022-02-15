<template>
	<view class="container">
		<!-- left左侧一级分类列表 -->
		<scroll-view scroll-y class="left">
			<!-- 循环遍历的 -->
			<view class="left_list" :class="activeIndex == ind ? 'activeList' : ''" v-for="(item,ind) in cateData" :key="ind" @click="changeIndex(ind)">
				<label for="">{{ item.catename }}</label>
			</view>
		</scroll-view>
		<!-- right右侧二级分类详情 -->
		<scroll-view scroll-y class="right">
			<view class="row">
				<view class="row_list" v-for="(item,index) in classify" :key="index" @click="goList(item.id)">
					<image :src="url + item.img" mode="widthFix"></image>
					<text>{{item.catename}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	//引入提示模块
	let {load,hideload} = require('@/utils/tip.js');
	export default {
		data(){
			return {
				url:this.$URL,
				activeIndex:0,
				cateData:[],//左侧一级分类数据
				classify:[]//右侧二级分类详情	
			}
		},
		onLoad() {
			load()
			//获取商品分类数据
			this.getCates()
			
		},
		methods:{
			//跳转到商品列表页面
			goList(id){
				uni.navigateTo({
					url:'../product/product?id='+id+'&type=2'
				})
			},
			//定义获取全部商品分类数据的方法
			getCates(){
				this.$http({
					url:'/getcates'
				})
				.then(res=>{
					this.cateData = res.list
					this.classify = this.cateData[0].children;
					hideload()
				})
			},
			//切换一级商品分类
			changeIndex(index){
				this.activeIndex = index
				this.classify = this.cateData[index].children;
			}
		},
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");
	
	/* 点击左侧导航，显示动态样式 */
	.activeList{
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}
</style>
