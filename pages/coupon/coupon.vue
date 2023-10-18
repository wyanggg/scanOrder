<template>
  <view class="coupon">
    <view class="po">
      <None v-if="list_empty"></None>
      <view
        v-for="(item, index) of list"
        :key="index"
      >
        <view class="coupons">
          <view class="cou_t">
            <view class="cou_t_l">
              <view :class="class_name"><span>¥</span>{{ (item.reduce * 10000) / 10000 }}</view>
            </view>
            <view class="cou_t_r">
              <view
                class="cou_t_r_01"
                v-if="item.full == 0"
                >减{{ (item.reduce * 10000) / 10000 }}</view
              >
              <view
                class="cou_t_r_01"
                v-else
                >满{{ (Math.floor(item.full) * 10000) / 10000 }} 减{{ Math.floor(item.reduce) }}</view
              >
              <block v-if="!item.end_time && item.day">
                <view class="cou_t_r_02">有效期：领取起{{ item.day }}天</view>
              </block>

              <block v-else>
                <view class="cou_t_r_02">有效期：{{ item.end_time }}</view>
              </block>
            </view>
            <view
              class="cou_t_rr"
              v-if="item.uesr_status == 1 && open_type == 'all'"
            >
              <view
                class=""
                @click="lq_coupon(item.id)"
                >领取</view
              >
            </view>
            <view
              class="cou_t_rr_1"
              v-if="item.uesr_status == 0"
            >
              <view class="">已领</view>
            </view>
            <block v-if="open_type == 'my'">
              <view
                class="cou_t_rr_1"
                v-if="item.status == 1"
              >
                <view class="">已使用</view>
              </view>
              <view
                class="cou_t_rr_1"
                v-if="item.status == 3"
              >
                <view class="">已过期</view>
              </view>
              <view
                class="cou_t_rr"
                v-if="item.status == 0"
                @click="jump_buy"
              >
                <view class="">去使用</view>
              </view>
            </block>
          </view>
          <!-- <view class='cou_d' v-if="item.goods_ids == '0'">全平台优惠券</view>
					<view class='cou_d' v-else>部分商品可用</view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import usercoupon from "@/api/user_coupon.js";
import None from "../../components/none.vue";
export default {
  components: {
    None,
  },
  data() {
    return {
      coupon: [],
      c_index: 0,
      list: [],
      class_name: "cou_t_l_01",
      list_empty: true,
      open_type: "my",
    };
  },
  onLoad(options) {},
  methods: {
    jump_buy() {
      uni.reLaunch({
        url: "../home/home",
      });
    },
    //领取优惠券
    lq_coupon(id) {},
    get_all_coupon() {},
    get_my_coupon() {},
  },
};
</script>

<style lang="scss">
.coupon {
  background-color: #f8f8f8;
  min-height: 100vh;

  .po {
    z-index: 99;
    width: 100%;
    padding-top: 15px;
  }

  .tab {
    padding: 10px 10px 0;
    display: flex;
    width: 100%;
    font-size: 14px;
    background-color: #fff;
  }

  .bb {
    padding-bottom: 5px;
    text-align: center;
    width: 50%;
  }

  .xz {
    border-bottom: 2px solid red;
    padding-bottom: 5px;
    width: 50%;
    text-align: center;
  }

  .coupons {
    margin: 15px;
    background-color: #fff;
    border: 1px solid #eeeeee;
    border-radius: 5px;
    box-shadow: 2px 2px 2px #eeeeee;
    color: #9fa0a2;
    min-height: 10px;
  }

  .cou_t {
    display: flex;
    padding: 20px 10px 10px;
    justify-content: space-between;
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  .cou_t_l {
    width: 20%;
    flex-shrink: 0;
  }

  .cou_t_r {
    width: 55%;
    box-sizing: border-box;
    padding-left: 10px;
  }

  .cou_t_rr {
    width: 70px;
    background-color: #eb113e;
    color: #fff;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    text-align: center;
    margin: 15px 0 0 10px;
    border-radius: 20px;
  }

  .cou_t_rr_1 {
    width: 70px;
    background-color: #bebebe;
    color: #fff;
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    text-align: center;
    margin: 15px 0 0 10px;
    border-radius: 20px;
  }

  .cou_t_l_01 {
    color: #ff4444;
    font-size: 26px;
    padding-top: 8px;
  }

  .cou_t_l_01 span {
    font-size: 12px;
  }

  .cou_sss {
    font-size: 32px;
  }

  .cou_sss span {
    font-size: 12px;
  }

  .cou_t_r_01 {
    font-size: 18px;
    color: #323233;
    padding: 3px 0 5px;
  }

  .cou_d {
    background-color: #fafafa;
    padding: 6px 15px;
    border-top: 1px dashed #ebedf0;
    font-size: 12px;
  }

  .H50 {
    height: 50px;
  }

  .btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-top: 1px solid #eeeeee;
    z-index: 999;
    font-size: 14px;
    background-color: #fff;
  }
}
</style>
