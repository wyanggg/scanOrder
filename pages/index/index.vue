<template>
  <view class="container">
    <view class="header">
      <view class="search-box">
        <view class="search-input" @tap="showSearch = true">
          <image src="/static/images/common/search-icon.png" class="search-icon" />
          <view>搜索</view>
        </view>
      </view>
      <view class="center">
        <view class="store">
          <view class="title">
            <image src="/static/images/common/star_normal.png" class="left-icon" />
            <view class="address" @tap="jumpTableList">
              店内就餐
              <text v-if="table_num">{{ " 桌号：" + table_num }}</text>
              <text v-else> ：点击选择桌号</text>
            </view>
            <image src="/static/images/common/black_arrow_right.png" class="right-icon" />
          </view>
          <view class="buttons"> 店内就餐 </view>
        </view>
      </view>

      <!-- 滚动公告栏 begin -->
      <view class="notices">
        <swiper class="swiper" autoplay vertical :interval="3000" :duration="1000" circular>
          <swiper-item v-for="(notice, index) in notices" :key="index" @tap="jump_notice(notice.id)">
            <view class="swiper-item">
              <image src="../../static/icon-img/notice.png" class="image"></image>
              <view class="content" v-html="notice.title"></view>
            </view>
          </swiper-item>
        </swiper>
        <view class="more"> </view>
      </view>
    </view>
    <!-- 滚动公告栏 end -->
    <view class="main">
      <!-- 左侧菜单 begin -->
      <scroll-view class="menu-bar" scroll-y scroll-with-animation>
        <view class="wrapper">
          <view class="menu-item" @tap="handleMenuSelected(category.id)"
            :class="{ active: currentCategoryId == category.id }" v-for="(category, index) in categories"
            :key="category.id">
            <image :src="category.image" class="image" mode="widthFix" />
            <view class="title">{{ category.cateName }}</view>
          </view>
        </view>
      </scroll-view>
      <!-- 左侧菜单 end -->
      <!-- 右侧商品列表 begin -->
      <scroll-view class="product-section" scroll-y scroll-with-animation :scroll-top="productsScrollTop"
        @scroll="productsScroll">
        <view class="wrapper">
          <view id="ads">
            <!-- 广告栏1 begin -->
            <swiper class="ads1" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
              <swiper-item v-for="(ad, index) in ads1" :key="index">
                <image :src="ad.image" class="image" mode="widthFix"></image>
              </swiper-item>
            </swiper>
            <!-- 广告栏1 end -->
          </view>
          <!-- 商品 begin -->
          <view class="products-list">
            <view class="products">
              <!-- 商品块 -->
              <view class="product" v-for="product in productList" :key="product.id"
                @tap="showProductDetailModal(product)">
                <image :src="product.image" mode="widthFix" class="image" />
                <view class="content">
                  <view class="name">{{ product.name }}</view>
                  <view class="description">{{ product.keyword }}</view>
                  <view class="price">
                    <view>￥{{ product.vipPrice }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <ProductModal :product="product" :visible="productModalVisible" @cancel="closeProductDetailModal"
      @add-to-cart="handleAddToCartInModal" />
    <Search :show="showSearch" :hotSearch="hotSearch" :categories="categories" @hide="showSearch = false"
      @choose="showProductDetailModal" />
  </view>
</template>

<script>
import ProductModal from "./components/product-modal/product-modal";
import Search from "./components/search/search";
// api
import { getCategory, getMsg, getSwiper, getProducts } from "@/api/index.js";

export default {
  components: {
    ProductModal,
    Search,
  },
  data() {
    return {
      hotSearch: [],
      getimg: this.$getimg,
      categories: [],
      cart: [],
      productList: [],
      product: {},

      currentCategoryId: "",

      notices: [
        { id: 1, title: "测试111" },
        { id: 2, title: "测试1112" },
      ],

      ads1: [],

      productModalVisible: false,
      productsScrollTop: 0,

      showSearch: false,
      table_num: "",
    };
  },
  computed: {
  },
  async onLoad(options) {
    this.get_category();
    this.get_swiper();
    this.get_msg();
    this.get_product();
  },
  async onShow(options) { },
  methods: {
    async get_msg() {
      let res = await getMsg();
      if (res.code == 200) {
        this.notices = res.data.list;
      }
    },
    async get_category() {
      let res = await getCategory();
      if (res.code == 200) {
        this.categories = res.data.categories;
      }
    },
    async get_swiper() {
      let res = await getSwiper();
      if (res.code == 200) {
        this.ads1 = res.data.banners;
      }
    },
    async get_product() {
      let res = await getProducts({
        cateId: this.currentCategoryId
      });
      if (res.code == 200) {
        this.productList = res.data.products;
      }
    },
    showProductDetailModal(product) {
      this.product = product;
      this.productModalVisible = true;
    },
    handleAddToCartInModal(product) { },
    closeProductDetailModal() {
      this.product = {};
      this.productModalVisible = false;
    },
    openCartDetailsPopup() { },
    clearCart() { },
    handleMenuSelected(id) {
      if (this.currentCategoryId != id) {
        this.currentCategoryId = id;
        this.get_product()
      } else {
        this.currentCategoryId = "";
        this.get_product()
      }
    },
    productsScroll({ detail }) { },
    calcSize() { },
    pay() { },
    //数据重组
    jumpTableList() {
      uni.navigateTo({
        url: "../table_list/table_list",
      });
    },
    // 获取公告
    getNoticeAll() { },
    // 点击公告跳转
    jump_notice(id) {
      uni.navigateTo({
        url: "../article/article?id=" + id,
      });
    },
  },
  onShareAppMessage() { },
};
</script>

<style lang="scss">
@import "./index.scss";

uni-page-head {
  display: none;
}
</style>
