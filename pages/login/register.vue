<template>
  <view class="content">
    <!-- 头部logo -->
    <view class="head">
      <image src="http://cdn.gtfy.net.cn/1inex/Head_back.png" class="back" mode="scaleToFill"
        @click="goLogin('/pages/login/login')" />
    </view>

    <view class="tabClass">
      <view class="title">账号注册</view>
    </view>

    <view class="logo"> </view>
    <!-- 主体 -->
    <view>
      <form class="main">
        <view class="view">
          <input v-model="account" type="text" maxlength="11" placeholder="输入手机号" class="inputClass" />
          <input v-model="password" type="password" maxlength="11" placeholder="输入密码" class="inputClass" />
          <view class="codeClass">
            <input v-model="verCode" maxlength="6" placeholder="验证码" ref="runCode" class="inputClass1"
              style="margin-bottom: 0rpx" />
            <view v-if="btn" class="btn_code activebtn" @click="getVerCode()">获取验证码</view>
            <view v-else class="btn_code unactivebtn">倒计时{{ daojishi }}秒</view>
          </view>
          <input v-model="invitationCode1" type="text" placeholder="上级邀请码" class="inputClass" />
        </view>
        <!-- 底部信息 -->
        <wButton text="注册" :rotate="isRotate" class="wbutton" @click.native="startReg()" :cansub="canSub"></wButton>
      </form>
    </view>
  </view>
</template>

<script>
var _this
import wButton from "./components/wButton.vue" //button

import { registerAPI, sendCodeAPI } from "@/api/login.js"
export default {
  data() {
    return {
      //logo图片 base64
      logoImage: "https://srhub.oss-cn-hangzhou.aliyuncs.com/agriculture/shop/%E9%A6%96%E9%A1%B5/logo.png",
      userName: "",
      invitationCode1: "",
      account: "", // 用户/电话
      password: "", //密码
      verCode: "", //验证码
      showAgree: true, //协议是否选择
      isRotate: false, //是否加载旋转
      btn: true, //用于判断‘获取验证码’按钮是否可用
      daojishi: 60, // 倒计时
      payPassword: "",
    }
  },
  onLoad(e) {
    console.log("%c [ e ]-88", "font-size:13px; background:#333333; color:#f3f3f3;", e)
    // #ifdef MP-WEIXIN
    if (e.scene) {
      let scene = decodeURIComponent(e.scene)
      // 后续处理scene
      this.invitationCode1 = scene
    }
    // #endif

    // #ifndef MP-WEIXIN
    this.invitationCode1 = e.phone || ""
    // #endif
  },
  components: {
    wButton,
  },
  mounted() {
    _this = this
  },
  computed: {
    canSub() {
      return (this.account && this.password && this.verCode && this.password.length >= 6) || false
    },

    parsePayPassword() {
      if (!this.payPassword) {
        return "请输入支付密码"
      } else {
        let len = this.payPassword.length

        let str = ""

        for (let index = 0; index < len; index++) {
          str = str + "*"
        }

        return str
      }
    },
  },

  methods: {
    openGxb() {
      window.open("https://beian.miit.gov.cn/")
    },
    handlePayPassword(value) {
      this.payPassword = value
    },
    openSafeInput() {
      this.$refs.numberPad.open()
    },
    goLogin(url) {
      uni.navigateTo({ url: url })
    },
    isShowAgree() {
      //是否选择协议
      _this.showAgree = !_this.showAgree
    },
    getVerCode() {
      //获取验证码
      if (_this.account.length != 11) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "手机号不正确",
        })
        return false
      }

      const data = {
        phone: _this.account,
      }
      this.btn = false //按钮切换
      this.countDown() //开始倒计时
      sendCodeAPI(data).then((res) => {
        this.$refs.runCode.$emit("runCode")
      })
    },
    countDown() {
      this.daojishi--
      var time = setTimeout(this.countDown, 1000)
      if (this.daojishi < 1) {
        clearTimeout(time)
        this.btn = true //按钮切换 结束倒计时
        return
      }
    },
    startReg() {
      //注册
      if (this.isRotate) {
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
      if (this.account.length != 11) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "手机号不正确",
        })
        return false
      }
      if (this.password.length < 6) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "密码最小6位数",
        })
        return false
      }
      if (!this.verCode) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "请输入验证码",
        })
        return false
      }
      if (!this.invitationCode1) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "邀请码不能为空",
        })
        return false
      }
      uni.showLoading({
        title: "加载中",
      })
      const data = {
        userName: _this.account,
        phone: _this.account,
        password: _this.password,
        share: _this.invitationCode1,
        code: _this.verCode,
        // payPassword: _this.payPassword,
      }
      registerAPI(data)
        .then((res) => {
          _this.isRotate = false
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)

          uni.reLaunch({
            url: "./login",
          })
        })
        .catch(() => {
          _this.isRotate = false
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
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

.code {
  width: 200rpx;
  height: 200rpx;

  position: fixed;
  bottom: calc(var(--window-bottom) + 50rpx);
  left: 275rpx;
}

.content {
  width: 100%;
  background-size: cover;
  min-height: 100vh;

  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;

  .tabClass {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: calc(var(--status-bar-height) + 200rpx);

    .title {
      min-width: 75rpx;
      height: 60rpx;
      font-size: 36rpx;
      font-family: "钉钉进步体 Regular";
      font-weight: 800;
      // color: #f44236;
      color: #000000;
      text-align: center;

      // border-bottom: 4rpx solid #f44236;
      border-radius: 2rpx;
    }

    .title_unactive {
      width: 75rpx;
      height: 60rpx;
      font-size: 36rpx;
      font-family: "钉钉进步体 Regular";
      font-weight: 800;
      color: #999999;
    }
  }

  .beian {
    width: 100%;
    height: 50rpx;

    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    // position: fixed;
    // bottom: 50rpx;

    background-color: #ffffff;
  }
}

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

  z-index: 2;

  font-size: 36rpx;
  color: #ffffff;

  .back {
    width: 40rpx;
    height: 30rpx;
    margin-right: 23rpx;
  }
}

.logo {
  width: 180rpx;
  height: 180rpx;
  margin: 0 auto;
  background-repeat: round;

  position: absolute;
  top: 223rpx;
  left: 280rpx;
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

  .inputClass1 {
    width: 258rpx;
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

  .forget {
    font-size: 30rpx;
    font-family: "钉钉进步体 Regular";
    font-weight: 500;
    color: #365cf6;
    margin-left: 40rpx;
  }

  .btn_code {
    position: absolute;
    right: 112rpx;
    width: 193rpx;
    height: 67rpx;
    line-height: 67rpx;
    border-radius: 34rpx;
    text-align: center;
    font-size: 28rpx;
  }
}

.codeClass {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.footer {
  width: 460rpx;
  font-size: 24rpx;
  font-family: "钉钉进步体 Regular", "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑, STHeiti, MingLiu;
  font-weight: 500;
  color: #333333;

  // position: fixed;
  // bottom: calc(var(--window-bottom) + 20rpx);
  // bottom: calc(env(safe-area-inset-bottom) + 50rpx);

  // left: 50%;
  // transform: translateX(-50%);
  margin-top: 0;

  .footerLinkClass {
    color: #f44236;
    text-decoration: underline;
  }
}

.activebtn {
  background: #f44236;
  color: #ffffff;
}

.unactivebtn {
  background: #f44236;
  color: #ffffff;
  opacity: 0.5;
}

.active {
  background: linear-gradient(-15deg, #f44236 0%, #ff5b50 100%);
}

.unactive {
  background: linear-gradient(-15deg, #f44236 0%, #ff5b50 100%);
  opacity: 0.5;
}

@media (max-width: 350px) {
  .content {
    .beian {
      margin-top: 50rpx;
      position: inherit;
    }
  }
}
</style>
