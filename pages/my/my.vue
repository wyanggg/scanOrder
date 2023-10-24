<template>
  <view class="container">
    <view class="img"></view>
    <view class="content">
      <view class="welcome" @tap="openLoginPopup">
        <view v-if="isLogin">
          <image v-if="isLogin" :src="userinfo.headpic" class="headpic"></image>
          <view>
            <text>{{ userinfo.nickname }}</text>
            <text>普通用户</text>
          </view>
        </view>
        <view v-else class="login">立即登录</view>
      </view>
      <view class="member-card">
        <view class="row">
          <navigator class="grid" open-type="navigate" url="/pages/integrals/scores">
            <image src="/static/images/my/jf.png"></image>
            <view class="value">{{ userinfo.points || 0 }}</view>
            <view class="title">积分</view>
          </navigator>
          <view class="grid" hover-class="opacity-6" @tap="toGoCoupon">
            <image src="/static/images/my/yhq.png"></image>
            <view class="value">{{ couponn || 0 }}</view>
            <view class="title">优惠券</view>
          </view>
          <navigator class="grid" open-type="navigate" url="/pages/my/wallet">
            <image src="/static/images/my/ye.png"></image>
            <view class="value">{{ userinfo.money || 0 }}</view>
            <view class="title">余额</view>
          </navigator>
        </view>
      </view>
    </view>

    <navigator open-type="navigate" url="../addresses/addresses">
      <list-cell hover arrow last>
        <view class="list-cell-wrapper">
          <view view="title">地址管理</view>
        </view>
      </list-cell>
    </navigator>
    <view v-for="(item, index) in articles" :key="index" @click="nav(item)">
      <list-cell hover arrow>
        <view class="list-cell-wrapper">
          <view view="title">{{ item.title }}</view>
        </view>
      </list-cell>
    </view>

    <!-- 登录popup -->
    <login-popup @auto="auto" ref="loginPopup" @getInfo="updateUserInfo"></login-popup>
  </view>
</template>

<script>
import listCell from "@/components/list-cell/list-cell.vue";
import loginPopup from "./components/login-popup.vue";
import { getUserInfo } from "@/api"
export default {
  components: {
    listCell,
    loginPopup,
  },
  data() {
    return {
      boardcast: [],
      userinfo: {},
      isLogin: false,
      couponn: 0,
      coupon: [],
      shopAddress: "",
      shopTel: "",
      articles: [],
      // 显示授权登录
      is_show_auth: false,
    };
  },
  watch: {},
  onLoad() { },
  onShow() {
    this.getData()
  },
  methods: {
    async getData() {
      let res = await getUserInfo()
      if (res.code == 200) {
        console.log('res', res)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
page {
  height: auto;
  min-height: 100%;
}

/* #endif */
.info22 {
  position: fixed;
  text-align: center;
  width: 100%;
  color: #777;
  /* #ifdef H5 */
  bottom: 90px;
  /* #endif */
  /* #ifdef MP-WEIXIN */
  bottom: 10px;
  /* #endif */
}

.img {
  width: 750rpx;
  height: 450rpx;
  background-image: url(https://go.cdn.heytea.com/storage/products/2019/12/18/01954797f3fb470cb6ba1606476c658c.png);
  background-position: 0 0;
  background-size: 750rpx 750rpx;
}

.content {
  padding: 0 30rpx;
}

.headpic {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
}

.welcome {
  position: relative;
  margin-top: -190rpx;
  display: flex;
  flex-direction: column;
  font-size: $font-size-lg;
  color: $text-color-warning;

  .login {
    margin: 0 auto;
    width: 450rpx;
    height: 100rpx;
    line-height: 120rpx;
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-top: 0;
    color: #ffffff;
    font-weight: 800;
    text-shadow: 5rpx 5rpx 10rpx #333333;

    background-color: rgba($color: #ffffff, $alpha: 0.8);
    border-radius: 50rpx;

    box-shadow: 0 0 10rpx 2rpx #ccc;
    padding: 0;
  }

  >view {
    padding-left: 50rpx;
    display: flex;

    >view {
      margin-left: 30rpx;
      display: flex;
      flex-direction: column;

      >text {
        &:last-child {
          color: #777;
          font-size: 0.8rem;
          margin-top: 10rpx;
        }
      }
    }
  }
}

.info {
  position: fixed;
  bottom: 240rpx;
  left: 0;
  width: 100%;
  text-align: center;
  margin-top: 80rpx;
  color: #777;
  font-size: 12px;

  >view {
    &:first-child {
      margin-bottom: 10rpx;
    }
  }
}

/* #ifdef MP-WEIXIN */
.info {
  position: fixed;
  bottom: 170rpx;
  left: 0;
  width: 100%;
  text-align: center;
  margin-top: 80rpx;
  color: #777;
  font-size: 0.9rem;

  >view {
    &:first-child {
      margin-bottom: 10rpx;
    }
  }
}

.member-card {
  background-color: $bg-color-white;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  border-radius: $border-radius-base;
  margin-bottom: 40rpx;
  margin-top: 30rpx;

  .info {
    position: relative;
    margin-top: -50rpx;
    display: flex;
    align-items: center;
    position: relative;
    padding: 20rpx 0;
    border-bottom: 1rpx solid rgba($color: $border-color, $alpha: 0.3);
    font-size: 12px;

    .title {
      flex: 1;
      font-size: 12px;
      color: $text-color-base;
      display: flex;
      align-items: center;

      .tips {
        margin-left: 10rpx;
        font-size: $font-size-sm;
        color: $text-color-assist;
        background-color: #e9e9e9;
        padding: 10rpx 30rpx;
        border-radius: 50rem !important;
        display: flex;
        align-items: center;

        image {
          width: 20rpx;
          height: 20rpx;
        }
      }
    }

    .avatar {
      width: 150rpx;
      height: 150rpx;
      border-radius: 100%;
    }

    .badage {
      font-family: "neutra";
      position: absolute;
      bottom: 20rpx;
      left: 0;
      border: 2rpx solid $text-color-base;
      padding: 2rpx 20rpx;
      border-radius: $border-radius-lg;
      font-size: $font-size-base;
    }
  }

  .row {
    margin-top: $spacing-row-base;
    width: 100%;
    display: flex;
    align-items: center;

    .grid {
      flex: 1;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;

      // image {
      // 	width: 100rpx;
      // 	height: 100rpx;
      // }

      .value {
        font-family: "neutra";
        margin-bottom: $spacing-col-sm;
        font-size: $font-size-lg;
      }

      .title {
        font-size: $font-size-sm;
        color: $text-color-grey;
      }

      image {
        width: 30px;
        height: 30px;
        margin-bottom: 10px;
      }
    }
  }
}

.xinqiubobao {
  width: 100%;
  position: relative;

  .title {
    margin: 10rpx 0;
    font-size: $font-size-lg;
    font-weight: 500;
  }

  .swiper {
    height: 200rpx;
    margin-bottom: 10rpx;

    .swiper-item {
      .swiper-item-wrapper {
        display: flex;
        background-color: $bg-color-white;
        padding: 40rpx 60rpx;
        border-radius: $border-radius-base;
        align-items: center;
        margin-right: 40rpx;

        image {
          width: 100rpx;
          height: 100rpx;
          border-radius: 100%;
          margin-right: 20rpx;
        }

        .desc {
          display: flex;
          flex-direction: column;

          .title {
            font-size: $font-size-medium;
            font-weight: 500;
            margin-bottom: 10rpx;
          }

          .desc {
            font-size: $font-size-sm;
            color: $text-color-grey;
          }
        }
      }
    }
  }
}

.task-center {
  margin: 40rpx 0;
  background-color: $bg-color-white;
  padding: 10rpx 0;
  display: flex;
  align-items: center;
  border-radius: $border-radius-lg;

  .intro {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      font-size: $font-size-lg;
      color: $text-color-base;
    }

    .subtitle {
      font-family: "neutra";
      font-size: $font-size-sm;
    }
  }

  .image-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    image {
      width: 200rpx;
      height: 200rpx;
    }
  }
}

.open-gift {
  width: 100%;
  background-color: $bg-color-white;
  padding: 30rpx 40rpx;
  margin-bottom: 20rpx;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .title {
      font-size: $font-size-lg;
      font-weight: 500;
    }

    .subtitle {
      font-size: $font-size-base;
      color: $text-color-grey;
    }
  }

  .row {
    display: flex;
    flex-wrap: wrap;

    .grid {
      width: 33.3333%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;

      image {
        width: 70rpx;
        height: 70rpx;
        margin-bottom: $spacing-row-base;
      }

      .title {
        font-size: $font-size-base;
        color: $text-color-base;
        display: flex;
        align-items: baseline;

        .number {
          margin-left: 5rpx;
          font-family: "neutra";
          color: $color-warning;
        }
      }
    }
  }
}

.list-cell-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: $font-size-lg;
  }

  .subtitle {
    font-size: $font-size-sm;
    color: $text-color-assist;
  }
}
</style>
