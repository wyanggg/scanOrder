<template>
  <view class="page">
    <view class="head">
      <image src="http://cdn.gtfy.net.cn/1inex/Head_back.png" @click="back" class="back" mode="scaleToFill" />
    </view>

    <view class="content">
      <!-- 主体表单 -->
      <form v-if="formChange === 1">
        <view class="main">
          <view class="topTitle">
            <h2>验证手机号码</h2>
            <text> 请输入手机号码发送验证码进行验证 </text>
          </view>
          <input v-model="phone" type="number" maxlength="11" placeholder="手机号" class="inputClass" />
          <view class="codeClass">
            <input v-model="code" type="number" maxlength="6" placeholder="验证码" ref="runCode" class="inputClass"
              style="margin-bottom: 0rpx" />
            <view v-if="btn" class="btn_code activebtn" @click="getVerCode()">获取验证码</view>
            <view v-else class="btn_code unactivebtn">倒计时{{ daojishi }}秒</view>
          </view>
          <view v-if="code && code.length" class="btnClass active" @click="next()"> 下一步 </view>
          <view v-else class="btnClass unactive"> 下一步 </view>
        </view>
      </form>
      <!-- 确认密码 -->
      <form v-else>
        <view class="main">
          <view class="topTitle">
            <h2>确认新密码</h2>
            <text> 请输入新密码并确认即可重新登录 </text>
          </view>
          <input v-model="passData" type="password" placeholder="输入新密码" class="inputClass" />
          <view class="codeClass">
            <input v-model="passData2" type="password" placeholder="再次确认新密码" class="inputClass"
              style="margin-bottom: 0rpx" />
          </view>
          <view v-if="passData && passData2 && passData.length >= 6 && passData2.length >= 6" class="btnClass active"
            @click="modifyPwd()">
            确定
          </view>
          <view v-else class="btnClass unactive"> 确定 </view>
        </view>
      </form>
    </view>
  </view>
</template>

<script>
var _this
import wButton from "./components/wButton.vue" //button

import { resetPwdAPI, sendCodeAPI } from "@/api/login.js"

export default {
  data() {
    return {
      //logo图片 base64
      logoImage: "https://srhub.oss-cn-hangzhou.aliyuncs.com/agriculture/shop/%E9%A6%96%E9%A1%B5/logo.png",
      phoneData: "", //用户/电话
      passData: "", //密码
      passData2: "", //密码2
      isRotate: false, //是否加载旋转
      phone: "",
      code: "",

      formChange: 1, //用于判断第一步还是第二步
      btn: true, //用于判断‘获取验证码’按钮是否可用
      daojishi: 60, // 倒计时
      password: "",
      password2: "",
    }
  },
  components: {
    wButton,
  },
  mounted() {
    _this = this
  },
  methods: {
    back() {
      // 后退
      uni.navigateBack()
    },
    getVerCode() {
      //获取验证码
      if (this.phone.length != 11) {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "手机号不正确",
        })
        return false
      }
      const data = {
        phone: this.phone,
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
    next() {
      //登录
      if (this.isRotate) {
        //判断是否加载中，避免重复点击请求
        return false
      }
      if (this.phone.length == "") {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "手机号不能为空",
        })
        return
      }
      if (this.code.length == "") {
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "验证码不能为空",
        })
        return
      }
      _this.isRotate = true
      this.formChange = 2
    },
    modifyPwd() {
      uni.showLoading({
        title: "加载中",
      })
      const data = {
        userName: _this.phone,
        password: _this.passData,
        phone: _this.phone,
        code: _this.code,
      }
      if (_this.passData === _this.passData2) {
        resetPwdAPI(data).then((res) => {
          uni.setStorageSync("user", res.user)
          uni.setStorageSync("token", res.token)
          setTimeout(function () {
            uni.hideLoading()
          }, 2000)
          uni.reLaunch({
            url: "/pages/login/login",
          })
        })
      } else {
        setTimeout(function () {
          uni.hideLoading()
        }, 2000)
        uni.showToast({
          icon: "none",
          position: "bottom",
          title: "两次输入的密码不一致",
        })
      }
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
.page {
  padding-top: calc(var(--status-bar-height) + 276rpx);
  background-image: url(http://cdn.gtfy.net.cn/swiper/newMyBg.png);
  background-size: cover;
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

  .back {
    width: 40rpx;
    height: 30rpx;
    margin-right: 23rpx;
  }
}

.content {}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .topTitle {
    width: 558rpx;
    height: 140rpx;
    margin-bottom: 30rpx;
    padding-left: 20rpx;

    // line-height: 97rpx;
    h2 {
      margin-bottom: 20rpx;
      font-weight: 600;
      color: #333;
      font-size: 46rpx;
    }

    text {
      color: #60656d;
      font-size: 28rpx;
    }
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

  .codeClass {
    display: flex;
    align-items: center;
  }

  .btnClass {
    width: 558rpx;
    height: 97rpx;
    line-height: 97rpx;
    text-align: center;
    color: #ffffff;
    font-size: 34rpx;
    border-radius: 49rpx;
    margin-top: 70rpx;
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
    background: linear-gradient(-15deg, #ea6247 0%, #de5c8c 100%);
  }

  .unactive {
    background: linear-gradient(-15deg, #ea6247 0%, #de5c8c 100%);
    opacity: 0.5;
  }
}
</style>
