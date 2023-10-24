<template>
  <view>
    <!-- 按钮 -->
    <button
      :class="['buttonBorder', !_rotate ? 'dlbutton' : 'dlbutton_loading']"
      :style="{ background: bgColor, color: fontColor, opacity: opacity }"
    >
      <view :class="_rotate ? 'rotate_loop' : ''">
        <text v-if="_rotate" class="cuIcon cuIcon-loading1"></text>
        <text v-if="!_rotate">
          {{ text }}
        </text>
      </view>
    </button>
  </view>
</template>

<script>
export default {
  props: {
    text: String, //显示文本
    rotate: {
      //是否启动加载
      type: [Boolean, String],
      default: false,
    },
    bgColor: {
      //按钮背景颜色
      type: String,
      default: "linear-gradient(-15deg, #EA6247 0%, #DE5C8C 100%)",
    },
    fontColor: {
      //按钮字体颜色
      type: String,
      default: "#FFFFFF",
    },
    cansub: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    _rotate() {
      //处理值
      return String(this.rotate) !== "false"
    },

    opacity() {
      if (this.cansub) {
        return 1
      } else {
        return 0.5
      }
    },
  },
}
</script>

<style>
@import url("./css/icon.css");

.wubttonImg {
  width: 40rpx;
  height: 30rpx;
}
.dlbutton {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 30upx;
  width: 601upx;
  height: 100upx;

  box-shadow: 0upx 0upx 13upx 0upx rgba(164, 217, 228, 0.4);
  border-radius: 2.5rem;
  margin-top: 0upx;
}
.dlbutton_loading {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 30upx;
  width: 100upx;
  height: 100upx;
  /* background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)); */
  background: linear-gradient(-15deg, #f44236 0%, #ff5b50 100%);

  box-shadow: 0upx 0upx 13upx 0upx rgba(164, 217, 228, 0.4);
  border-radius: 2.5rem;
  margin-top: 0upx;
}
.buttonBorder {
  width: 126rpx;
  height: 126rpx;
  border: none;
  border-radius: 2.5rem;
  -webkit-box-shadow: 0 0 60upx 0 rgba(0, 0, 0, 0.2);
  box-shadow: 0 0 60upx 0 rgba(0, 0, 0, 0.2);
  -webkit-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
  -moz-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
  -ms-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
  -o-transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
  transition: all 0.4s cubic-bezier(0.57, 0.19, 0.51, 0.95);
}

/* 旋转动画 */
.rotate_loop {
  -webkit-transition-property: -webkit-transform;
  -webkit-transition-duration: 1s;
  -moz-transition-property: -moz-transform;
  -moz-transition-duration: 1s;
  -webkit-animation: rotate 1s linear infinite;
  -moz-animation: rotate 1s linear infinite;
  -o-animation: rotate 1s linear infinite;
  animation: rotate 1s linear infinite;
}
@-webkit-keyframes rotate {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes rotate {
  from {
    -moz-transform: rotate(0deg);
  }
  to {
    -moz-transform: rotate(359deg);
  }
}
@-o-keyframes rotate {
  from {
    -o-transform: rotate(0deg);
  }
  to {
    -o-transform: rotate(359deg);
  }
}
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
</style>
