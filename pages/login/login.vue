<template>
  <view class="content">
    <!-- 头部logo -->
    <view class="head">
      <image src="http://cdn.gtfy.net.cn/1inex/Head_back.png" class="back" mode="scaleToFill"
        @click="toHome('/pages/index/index')" />
      <view class="title_unactive">
        <!-- #ifndef MP-WEIXIN -->
        <navigator url="./register" open-type="navigate">注册</navigator>
        <!-- #endif -->
      </view>
    </view>

    <view class="tabClass">
      <view class="title">账号登录</view>
    </view>

    <!-- 主体表单 -->
    <view>
      <form class="main">
        <view class="view">
          <input v-model="phoneData" type="text" maxlength="11" placeholder="输入手机号" class="inputClass" />
          <input v-model="passData" type="password" maxlength="15" placeholder="输入密码" class="inputClass" />
        </view>
        <!-- 底部信息 -->
        <wButton text="登录" :rotate="isRotate" class="wbutton" @click.native="startLogin()" :cansub="canSub"></wButton>

        <view class="forget" @click="toforget('/pages/login/forget')">忘记密码？</view>
        <!-- #ifdef MP-WEIXIN -->
        <view class="forget1" @click="toforget('/pages/login/register')">注册</view>
        <!-- #endif -->
      </form>
    </view>

  </view>
</template>

<script>
var _this
import wButton from "./components/wButton.vue" //button
import { loginAPI, wxLogin } from "@/api/login"

export default {
  data() {
    return {
      logoImage: "https://srhub.oss-cn-hangzhou.aliyuncs.com/agriculture/shop/%E9%A6%96%E9%A1%B5/logo.png",
      phoneData: "", //用户/电话
      passData: "", //密码
      isRotate: false, //是否加载旋转
      showAgree: true, //协议是否选择
      buttonShow: false,
    }
  },
  components: {
    wButton,
  },
  mounted() {
    _this = this
  },
  computed: {
    canSub() {
      return (this.phoneData && this.passData && this.passData.length >= 6) || false
    },
  },
  watch: {
    passData: {
      handler(newVal, oldVal) {
        if (this.phoneData) {
          if (this.phoneData.length == 11 && newVal.length >= 6) {
            this.buttonShow = true
          } else {
            this.buttonShow = false
          }
        }
      },
      immediate: true,
    },
    phoneData: {
      handler(newVal, oldVal) {
        if (this.passData) {
          if (this.phoneData.length == 11 && this.passData.length >= 6) {
            this.buttonShow = true
          } else {
            this.buttonShow = false
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    openGxb() {
      window.open("https://beian.miit.gov.cn/")
    },
    wxLogin() {
      uni.login({
        provider: "weixin",
        onlyAuthorize: true,
        success: async (event) => {
          const { code } = event
          if (code) {
            uni.showLoading({
              title: "登录中...",
              mask: true,
            })
            let res

            try {
              res = await wxLogin({ code })
            } catch (error) { }
            if (res.code === 200) {
              uni.setStorageSync("token", res.data.token)
              uni.setStorageSync("user", res.data.user.user)
              uni.hideLoading()
              if (res.data.user.user.phone) {
                uni.switchTab({ url: "/pages/index/index" })
              } else {
                uni.navigateTo({ url: "/pages/user/bindPhone" })
              }
            }
          } else {
          }
        },
        fail: function (err) { },
      })
    },
    toHome(url) {
      uni.switchTab({ url: url })
    },
    toforget(url) {
      uni.navigateTo({ url: url })
    },
    isShowAgree() {
      //是否选择协议
      _this.showAgree = !_this.showAgree
    },
    isLogin() { },
    startLogin() {
      //登录
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false
      }

      if (this.showAgree == false) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "请先同意《协议》",
        })
        return false
      }
      if (this.phoneData.length == "") {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "用户名不能为空",
        })
        return
      }
      if (!this.passData) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "请输入密码",
        })
        return
      }
      this.isRotate = true

      const data = {
        phone: _this.phoneData,
        password: _this.passData,
      }

      loginAPI(data)
        .then((res) => {
          uni.setStorageSync("user", res.user.user)
          uni.setStorageSync("token", res.token)
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
          uni.reLaunch({
            url: "/pages/index/index",
          })
        })
        .catch(() => {
          _this.isRotate = false
        })
    },
    login_weixin() {
      //微信登录
      uni.showToast({
        icon: "none",
        position: "bottom",
        title: "暂未开放",
      })
    },
    login_weibo() {
      //微博登录
      uni.showToast({
        icon: "none",
        position: "bottom",
        title: "暂未开放",
      })
    },
    login_github() {
      //github登录
      uni.showToast({
        icon: "none",
        position: "bottom",
        title: "暂未开放",
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(15deg);
  }
}

@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }

  to {
    -moz-transform: rotate(15deg);
  }
}

@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }

  to {
    -o-transform: rotate(15deg);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(15deg);
  }
}

.code {
  width: 200rpx;
  height: 200rpx;

  position: fixed;
  bottom: calc(var(--window-bottom) + 50rpx);
  left: 275rpx;
}

.beian {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: #ffffff;

  // position: sticky;
  // bottom: 50rpx;
}

/* #ifndef MP-WEIXIN */
@media (max-width: 350px) {
  .beian {
    margin-top: 50rpx;
    position: inherit;
  }
}

/* #endif */

.content {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  background-size: cover;

  .head {
    width: 750rpx;
    box-sizing: border-box;
    padding: 0 40rpx;
    height: calc(var(--status-bar-height) + 100rpx);
    line-height: 100rpx;

    padding-top: var(--status-bar-height);
    position: fixed;
    top: 0;
    left: 0;

    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    justify-content: space-between;

    z-index: 2;

    font-size: 36rpx;
    color: #ffffff;

    .back {
      width: 40rpx;
      height: 30rpx;
      margin-right: 23rpx;
    }

    .title_unactive {
      font-size: 30rpx;
      color: #000000;
    }
  }

  .tabClass {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    /* #ifdef H5 */
    margin-top: calc(var(--status-bar-height) + 200rpx);
    /* #endif */

    .title {
      min-width: 75rpx;
      height: 60rpx;
      font-size: 36rpx;
      font-family: "钉钉进步体 Regular";
      font-weight: 800;
      color: #000000;
      text-align: center;

      // border-bottom: 4rpx solid #f44236;
      border-radius: 2rpx;
    }

    .title_unactive {
      min-width: 75rpx;
      height: 60rpx;
      font-size: 36rpx;
      font-family: "钉钉进步体 Regular";
      font-weight: 800;
      color: #999999;
    }
  }
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .view {
    width: 558rpx;
    margin: 0 auto;
    margin-top: 40rpx;

    /* #ifdef MP-WEIXIN */
    input {
      padding-left: 45rpx;
    }

    /* #endif */
  }

  .inputClass {
    width: 558rpx;
    height: 97rpx;
    line-height: 97rpx;
    background: #f8f8f8;
    border-radius: 49rpx;
    margin-bottom: 40rpx;
    text-indent: 40rpx;
  }

  .uni-input-placeholder {
    font-size: 34rpx;
    font-family: "钉钉进步体 Regular";
    color: #cecece;
  }

  .btnClass {
    width: 558rpx;
    height: 97rpx;
    line-height: 97rpx;
    text-align: center;
    color: #ffffff;
    font-size: 34rpx;
    border-radius: 49rpx;
    margin-top: 60rpx;
  }

  .btnClass:active {
    -webkit-transition-property: -webkit-transform;
    -webkit-transition-duration: 1s;
    -moz-transition-property: -moz-transform;
    -moz-transition-duration: 1s;
    -webkit-animation: rotate 1s linear infinite;
    -moz-animation: rotate 1s linear infinite;
    -o-animation: rotate 1s linear infinite;
    animation: rotate 1s linear infinite;
  }

  .forget {
    font-size: 24rpx;
    font-family: "钉钉进步体 Regular";
    font-weight: 500;
    color: #333333;
    margin-left: 20rpx;
    text-align: center;
    margin-top: 60rpx;
  }

  .forget1 {
    font-size: 28rpx;
    font-family: "钉钉进步体 Regular";
    font-weight: 500;
    color: #333333;
    margin-left: 20rpx;
    text-align: center;
    margin-top: 60rpx;
  }

  .footer {
    width: 460rpx;
    font-size: 24rpx;
    font-family: "钉钉进步体 Regular";
    font-weight: 500;
    color: #333333;
    margin-top: 0;

    .footerLinkClass {
      color: #f44236;
    }
  }
}

.wbutton {
  width: 126rpx;
  height: 126rpx;
  border-radius: 50%;
  background-color: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
  margin-top: 70rpx;

  image {
    width: 40rpx;
    height: 30rpx;
  }
}

.wbutton1 {
  width: 126rpx;
  height: 126rpx;
  border-radius: 50%;
  // background-color: #f6f6f6;
  background: linear-gradient(#ea6247, #de5c8c);

  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 auto;
  margin-top: 70rpx;

  image {
    width: 40rpx;
    height: 30rpx;
  }
}

.active {
  background: linear-gradient(-15deg, #f44236 0%, #ff5b50 100%);
}

.unactive {
  background: linear-gradient(-15deg, #f44236 0%, #ff5b50 100%);
  opacity: 0.5;
}

.other {
  min-width: 130rpx;
  height: 30rpx;
  font-size: 22rpx;
  font-family: "钉钉进步体 Regular", "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑, STHeiti, MingLiu;
  font-weight: 500;
  color: #333333;

  position: fixed;
  bottom: calc(var(--window-bottom) + 260rpx);
  left: 311rpx;
}

.other::before {
  content: " ";
  width: 21rpx;
  height: 2rpx;
  background: #999999;
  border-radius: 1rpx;

  position: absolute;
  top: 15rpx;
  left: -30rpx;
}

.other::after {
  content: " ";
  width: 21rpx;
  height: 2rpx;
  background: #999999;
  border-radius: 1rpx;

  position: absolute;
  top: 15rpx;
  right: -30rpx;
}

.login-images {
  width: 204rpx;
  height: 72rpx;

  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;

  position: fixed;
  bottom: calc(var(--window-bottom) + 151rpx);
  left: 273rpx;

  image {
    width: 72rpx;
    height: 72rpx;
  }
}
</style>
