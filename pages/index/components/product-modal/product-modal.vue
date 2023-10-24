<template>
  <modal :show="visible" custom padding="0" width="90%" radius="18rpx">
    <view class="header">
      <image src="/static/images/index/round_close_btn.png" @tap="$emit('cancel')"></image>
    </view>
    <swiper :duration="1000" indicator-dots class="swiper" autoplay :interval="3000">
      <swiper-item v-for="(image, index) in bannerimgs" :key="index" class="swiper-item">
        <image :src="image" class="w-100 h-100"></image>
      </swiper-item>
    </swiper>
    <scroll-view scroll-y class="content">
      <view class="wrapper">
        <view class="title">{{ productData.goods_name }}</view>
        <view class="mb-10">产品描述</view>
        <view class="mb-20">{{ productData.keyword }}</view>
      </view>
      <view class="goods-xq">商品详情</view>
      <rich-text :nodes="productData.info"></rich-text>
    </scroll-view>
    <view class="bottom" :style="{ height: !is_single ? '250rpx' : '200rpx' }">
      <view class="d-flex align-items-center">
        <view class="price-and-materials">
          <view class="price">￥{{ productData.vipPrice }}</view>
        </view>
      </view>
      <button type="primary" class="add-cart-btn" @tap="addToCart">
        加入购物车
      </button>
    </view>
  </modal>
</template>

<script>
import Modal from "@/components/modal/modal.vue";

export default {
  name: "ProductModal",
  components: {
    Modal,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    product: {
      type: Object,
    },
  },
  data() {
    return {
      getimg: this.$getimg,
      bannerimgs: [],
      is_single: true,
      productData: {},
      sku_id: -1,
    };
  },
  watch: {
    product: function (val) {
      this.productData = val;
      if (val.sliderImage) {
        this.bannerimgs = val.sliderImage.split(",");
      }
    },
  },
  methods: {
    changeMaterialSelected() {
      this.productData.number = 1;
    },

    add() {
      this.productData.number += 1;
      this.$forceUpdate();
    },
    minus() {
      if (this.productData.number == 1) {
        return;
      }
      this.productData.number -= 1;
      this.$forceUpdate();
    },
    addToCart() {
      this.$emit("add-to-cart", this.productData);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 20rpx 30rpx;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  z-index: 11;

  image {
    width: 60rpx;
    height: 60rpx;
    margin-left: 20rpx;

    &:first-child {
      margin-left: 0;
    }
  }
}

.swiper {
  height: 426rpx;
}

.content {
  // border: 2rpx solid red;
  display: flex;
  flex-direction: column;
  font-size: $font-size-sm;
  color: $text-color-assist;
  min-height: 1vh;
  padding: 30rpx 30rpx 10rpx;
  max-height: calc(100vh - 100rpx - 426rpx - 250rpx);
  overflow-y: scroll;

  .goods-xq {
    margin-bottom: 10rpx;
  }

  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    // padding: 30rpx 30rpx 20rpx;
  }

  .title {
    font-size: $font-size-extra-lg;
    color: $text-color-base;
    font-weight: bold;
    margin-bottom: 10rpx;
  }

  .labels {
    display: flex;
    font-size: 20rpx;
    margin-bottom: 10rpx;
    overflow: hidden;
    flex-wrap: wrap;

    .label {
      max-width: 40%;
      padding: 6rpx 10rpx;
      margin-right: 10rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .materials {
    width: 80%;
    margin-bottom: 20rpx;
    margin-top: 10rpx;

    .group-name {
      padding: 10rpx 0;
    }

    .values {
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;

      .value {
        background-color: #f5f5f7;
        color: $font-size-base;
        padding: 10rpx 20rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        border-radius: $border-radius-lg;

        &.selected {
          background-color: $color-primary;
          color: $bg-color-white;
        }
      }
    }
  }
}

.bottom {
  padding: 20rpx 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 1rpx solid rgba($color: $border-color, $alpha: 0.3);
  background-color: $bg-color-white;
  position: relative;
  z-index: 11;

  .price-and-materials {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-right: 10rpx;

    .price {
      color: $color-primary;
      font-size: $font-size-extra-lg;
      font-weight: bold;
    }

    .materials {
      font-size: $font-size-sm;
      color: $text-color-assist;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .add-cart-btn {
    margin-top: 20rpx;
    font-size: $font-size-lg;
    border-radius: $border-radius-base;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90rpx;
  }
}
</style>
