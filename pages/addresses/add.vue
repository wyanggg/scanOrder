<template>
  <view
    class="container"
    style="font-size: 15px !important"
  >
    <view class="address-form">
      <list-cell padding="30rpx">
        <view class="form-item">
          <view class="label">联系人</view>
          <input
            type="text"
            v-model="form.name"
            placeholder="请填写收货人的姓名"
            placeholder-class="placeholder"
          />
        </view>
      </list-cell>
      <list-cell padding="30rpx">
        <view class="form-item">
          <view class="label">手机号</view>
          <input
            type="text"
            maxlength="11"
            v-model="form.mobile"
            placeholder="请填写收货手机号码"
            placeholder-class="placeholder"
          />
        </view>
      </list-cell>
      <list-cell padding="30rpx">
        <view class="form-item">
          <view class="label">地区</view>
          <picker
            @change="bindPickerChange"
            :value="index"
            mode="selector"
            :range="provinces"
          >
            <view class="uni-input">{{ provinces[index] }}</view>
          </picker>
        </view>
      </list-cell>
      <list-cell padding="30rpx">
        <view class="form-item">
          <view class="label">街道</view>
          <picker
            @change="bindPickerChange1"
            mode="selector"
            :value="index1"
            :range="citys"
          >
            <view class="uni-input">{{ citys[index1] }}</view>
          </picker>
        </view>
      </list-cell>
      <list-cell padding="30rpx">
        <view class="form-item">
          <view class="label">详细地址</view>
          <input
            type="text"
            v-model="form.detail"
            placeholder="例:B座6楼606室"
            placeholder-class="placeholder"
          />
        </view>
      </list-cell>
    </view>

    <view class="save-btn">
      <button
        type="info"
        @click="save()"
      >
        保存
      </button>
    </view>
  </view>
</template>

<script>
import listCell from "@/components/list-cell/list-cell.vue";

export default {
  components: {
    listCell,
  },
  data() {
    return {
      form: {
        name: "",
        mobile: "",
        detail: "",
        is_default: 0,
        province: "",
        city: "",
      },
      index: 0,
      index1: 0,
      provinces: ["请选择"],
      citys: ["请选择"],
      address: [],
      idEdit: false,
      id: -1,
    };
  },
  watch: {
    index(val) {},
  },
  onLoad({ id }) {
    this.id = id;
  },
  methods: {
    show_data() {},
    bindPickerChange: function (e) {},
    bindPickerChange1: function (e) {},
    save() {},
  },
};
</script>

<style lang="scss" scoped>
.address-form {
  margin-top: 20rpx;

  .form-item {
    width: 100%;
    display: flex;
    align-items: center;

    .label {
      width: 160rpx;
    }

    input {
      flex: 1;
    }

    .jump-icon {
      width: 30rpx;
      height: 48rpx;
    }

    .radio {
      display: flex;
      margin-right: 50rpx;
      image {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }
    }
  }
}

.save-btn {
  padding: 0 30rpx;
  margin-top: 60rpx;

  button {
    width: 100%;
    font-size: $font-size-extra-lg;
  }
}
</style>
