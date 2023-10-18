<template>
  <view class="article">
    <view
      class="content"
      v-html="content"
    ></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      content: "",
    };
  },
  onLoad(option) {
    const _this = this;
    if (option.id) {
    }
  },
};
</script>

<style lang="scss" scoped>
.article {
  padding: 10rpx;
  min-height: calc(100vh - 44px);
  display: flex;

  .content {
    width: 100%;
    padding: 20rpx;
    background-color: white;
  }
}
</style>
