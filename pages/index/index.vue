<template>
  <!-- 2021-01-13 18:03 -->
  <view class="container">
    <view class="header">
      <!-- 搜索栏 begin -->
      <view class="search-box">
        <view
          class="search-input"
          @tap="showSearch = true"
        >
          <image
            src="/static/images/common/search-icon.png"
            class="search-icon"
          ></image>
          <view>搜索</view>
        </view>
      </view>
      <!-- {{'上级码：'+sjm}}
			{{'登录用户身份码：'+sfm}} -->
      <!-- 搜索栏 end -->
      <view class="center">
        <view class="store">
          <view class="title">
            <image
              :src="Dining_type == '店内就餐' ? '/static/images/common/star_normal.png' : '/static/images/order/order_icon_address.png'"
              class="left-icon"
            />
            <!-- 为了测试方便，这里使用静态店铺数据 -->
            <view
              class="address"
              @tap="replaceAddress"
              v-if="Dining_type == '配送'"
              >{{ address ? address : "请添加收货地址" }}</view
            >
            <view
              class="address"
              @tap="jumpTableList"
              v-else
              >店内就餐<text v-if="table_num">{{ " 桌号：" + table_num }}</text> <text v-else> ：点击选择桌号</text></view
            >
            <image
              src="/static/images/common/black_arrow_right.png"
              class="right-icon"
            ></image>
          </view>
          <view class="buttons">
            {{ Dining_type }}
          </view>
        </view>
      </view>
      <!-- 滚动公告栏 begin -->
      <view class="notices">
        <swiper
          class="swiper"
          autoplay
          vertical
          :interval="3000"
          :duration="1000"
          circular
        >
          <swiper-item
            v-for="(notice, index) in notices"
            :key="index"
            @tap="jump_notice(notice.id)"
          >
            <view class="swiper-item">
              <image
                src="../../static/icon-img/notice.png"
                class="image"
              ></image>
              <view
                class="content"
                v-html="notice.title"
              ></view>
            </view>
          </swiper-item>
        </swiper>
        <view class="more">
          <!-- #ifdef H5 -->
          <!-- <button class="text-share" @tap="show_xia">分享</button> -->
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <!-- <button class="text-share" open-type="share">分享</button> -->
          <!-- #endif -->
          <!-- <image src="/static/images/common/gray_arrow_down.png" class="down-icon"></image> -->
        </view>
      </view>
    </view>
    <!-- 滚动公告栏 end -->
    <view class="main">
      <!-- 左侧菜单 begin -->
      <scroll-view
        class="menu-bar"
        scroll-y
        scroll-with-animation
      >
        <view class="wrapper">
          <view
            class="menu-item"
            @tap="handleMenuSelected(category.category_id)"
            :class="{ active: currentCategoryId == category.category_id }"
            v-for="(category, index) in categories"
            :key="index"
          >
            <image
              style="border-radius: 50%; height: 60px"
              :src="getimg + category.category_pic"
              class="image"
              mode="widthFix"
            ></image>
            <view class="title">{{ category.category_name }}</view>
          </view>
        </view>
      </scroll-view>
      <!-- 左侧菜单 end -->
      <!-- 右侧商品列表 begin -->
      <scroll-view
        class="product-section"
        scroll-y
        scroll-with-animation
        :scroll-top="productsScrollTop"
        @scroll="productsScroll"
      >
        <view class="wrapper">
          <view id="ads">
            <!-- 广告栏1 begin -->
            <swiper
              class="ads1"
              :indicator-dots="true"
              :autoplay="true"
              :interval="3000"
              :duration="1000"
              circular
            >
              <swiper-item
                v-for="(ad, index) in ads1"
                :key="index"
              >
                <image
                  :src="ad"
                  class="image"
                  mode="widthFix"
                ></image>
              </swiper-item>
            </swiper>
            <!-- 广告栏1 end -->
          </view>
          <!-- 商品 begin -->
          <view class="products-list">
            <view class="products">
              <!-- 商品块 -->
              <view
                class="product"
                v-for="(product, key) in productList"
                :key="key"
                @tap="showProductDetailModal(product)"
              >
                <image
                  :src="getimg + product.img_id"
                  mode="widthFix"
                  class="image"
                ></image>
                <view class="content">
                  <view class="name">{{ product.name }}</view>
                  <view class="labels">
                    <view
                      class="label"
                      :style="{ color: label.label_color, background: $util.hexToRgba(label.label_color, 0.2) }"
                      v-for="label in product.labels"
                      :key="label.id"
                      >{{ label.name }}</view
                    >
                  </view>
                  <view class="description">{{ product.description }}</view>
                  <view class="price">
                    <view>￥{{ product.price }}</view>
                    <actions
                      :materials-btn="!product.is_sku"
                      @materials="showProductDetailModal(product)"
                      :number="productCartNum(product)"
                      @add="handleAddToCart(product)"
                      @minus="handleMinusFromCart(product)"
                    />
                  </view>
                </view>
              </view>
              <!-- 商品块 end -->
            </view>
          </view>
          <!-- 商品 end -->
        </view>
      </scroll-view>
      <!-- 右侧商品列表 end -->
    </view>
    <!-- 商品详情 modal begin -->
    <product-modal
      :product="product"
      :visible="productModalVisible"
      @cancel="closeProductDetailModal"
      @add-to-cart="handleAddToCartInModal"
    />
    <!-- 商品详情 modal end -->
    <!-- 购物车栏 begin -->
    <cart-bar
      :cart="cart"
      :type="Dining_type"
      @add="handleAddToCart"
      @minus="handleMinusFromCart"
      @clear="clearCart"
      @pay="pay"
    />
    <!-- 购物车栏 end -->
    <search
      :show="showSearch"
      :hotSearch="hotSearch"
      :categories="categories"
      @hide="showSearch = false"
      @choose="showProductDetailModal"
    ></search>
    <view
      class="meng"
      v-if="xia"
      @tap="show_xia"
    >
      <view class="righ"><image src="@/static/icon-img/tou.png"></image></view>
      <view class="one">
        <view class="one-l">
          <view class="one-l-01">1</view>
          <view class="one-l-02">点 击 右 上 角 的</view>
          <view class="one-l-03">⋮</view>
        </view>
      </view>
      <view class="one">
        <view class="one-l">
          <view class="one-l-01">2</view>
          <view class="one-l-02">选 择 在 浏 览 器</view>
          <view class="one-l-03">
            <image src="@/static/icon-img/liu.png"></image>
          </view>
          <view class="one-l-02">中 打 </view>
          <view class="one-l-04">开 即 可 正 常 分 享</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Actions from "./components/actions/actions.vue";
import CartBar from "./components/cartbar/cartbar.vue";
import ProductModal from "./components/product-modal/product-modal.vue";
import cartPopup from "./components/cart-popup/cart-popup.vue";
import Search from "./components/search/search.vue";
import address from "../../api/address.js";

export default {
  components: {
    Actions,
    CartBar,
    ProductModal,
    cartPopup,
    Search,
  },
  data() {
    return {
      hotSearch: [],
      getimg: this.$getimg,
      categories: [
        {
          category_name: "推荐",
          category_id: 1001,
          level: 1,
          number: 0,
          category_pic: "uploads/images/tj.jpg",
        },
        {
          category_name: "新品",
          category_id: 1002,
          level: 1,
          number: 0,
          category_pic: "uploads/images/xp.jpg",
        },
        {
          category_name: "热销",
          category_id: 1003,
          level: 1,
          number: 0,
          category_pic: "uploads/images/rx.jpg",
        },
        {
          category_name: "满减",
          category_id: 1004,
          level: 1,
          number: 0,
          category_pic: "uploads/images/hd.jpg",
        },
      ],
      cart: [],
      productList: [],
      product: {},
      currentCategoryId: 1001,
      notices: [],
      ads1: [
        "https://go.cdn.heytea.com/storage/ad/2020/05/28/752a5519e89541bd8417614c599cf8c3.jpg",
        "https://go.cdn.heytea.com/storage/ad/2020/05/24/38b7f686cf10449c85b0f5489d5d958e.jpg",
        "https://go.cdn.heytea.com/storage/ad/2020/05/21/2315beb5105944e8b795c5c0084ec99f.jpg",
        "https://go.cdn.heytea.com/storage/ad/2020/05/21/b88c6780a73249b0b0166784917a5046.jpg",
        "https://go.cdn.heytea.com/storage/ad/2020/05/21/acfc6504f3074cf6b730f516adc558f6.jpg",
        "https://go.cdn.heytea.com/storage/ad/2020/04/26/2373600789c64752b2415293877ead40.jpg",
        "https://go.cdn.heytea.com/storage/ad/2020/04/22/515df8c726e740089ae4c55582b4ce09.jpg",
        "https://go.cdn.heytea.com/storage/ad/2020/04/14/d0e51cb22c0a437293c0e6a879b59c7d.jpg",
      ],
      productModalVisible: false,
      cartPopupShow: false,
      productsScrollTop: 0,
      showSearch: false,
      Dining_type: "配送",
      is_sku: false,
      address: "",
      Api_url: this.$getimg,
      xia: false,
      table_num: "",
      sfm: 0,
      sjm: 0,
    };
  },
  computed: {
    productCartNum() {
      //计算单个饮品添加到购物车的数量
      return (id) =>
        this.cart.reduce((acc, cur) => {
          if (cur.id === id) {
            return (acc += cur.number);
          }
          return acc;
        }, 0);
    },
  },
  async onLoad(options) {},
  async onShow(options) {},
  methods: {
    ...mapMutations(["SET_ORDER_TYPE"]),

    get_cate() {},
    get_search_recorde() {},
    async show_data() {},
    switchOrderType() {},
    handleAddToCart(product) {
      //添加到购物车
    },
    handleMinusFromCart(product) {
      //从购物车减商品
    },
    showProductDetailModal(product) {},
    handleAddToCartInModal(product) {},
    closeProductDetailModal() {},
    openCartDetailsPopup() {},
    clearCart() {},
    handleMenuSelected(id) {},
    productsScroll({ detail }) {},
    calcSize() {},
    pay() {},
    //数据重组
    reCount(res) {},
    getperductlist: function (val) {},
    // 获取广告图片
    getBannerImgs() {},
    // 更换地址
    replaceAddress() {
      uni.navigateTo({
        url: "../addresses/addresses?type=order",
      });
    },
    jumpTableList() {
      uni.navigateTo({
        url: "../table_list/table_list",
      });
    },
    // 获取公告
    getNoticeAll() {},
    // 点击公告跳转
    jump_notice(id) {
      uni.navigateTo({
        url: "../article/article?id=" + id,
      });
    },
    show_xia() {},
  },
  onShareAppMessage() {},
};
</script>

<style lang="scss">
@import "./index.scss";
uni-page-head {
  display: none;
}
</style>
