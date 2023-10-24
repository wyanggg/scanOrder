<template>
  <view>
    <view class="head tab-right-active">
      <view
        class="container head-bottom"
        :class="{ selectOne: tabIndex == 1, selectTow: tabIndex == 2 }"
      >
        <view
          class="tab"
          v-if="type == '店内就餐'"
        >
          <view class="t-top">
            <view class="t-top-box">
              <block>
                <text class="txt1">桌号：{{ table_num }}号桌</text>
                <i
                  style="text-align: right"
                  class="hxicon-right icon1"
                ></i>
              </block>
            </view>
          </view>
        </view>
        <view
          class="tab"
          v-else
        >
          <view
            class="t-top"
            @click="choose_address"
          >
            <view class="t-top-box">
              <block v-if="!addressData">
                <text class="txt1">暂无收货地址</text>
                <i
                  style="text-align: right"
                  class="hxicon-right icon1"
                ></i>
              </block>
              <block v-else>
                <view
                  class=""
                  style=""
                >
                  <view
                    class=""
                    style="font-weight: 800"
                  >
                    {{ addressData.name }}&nbsp;{{ addressData.mobile }}
                  </view>

                  <view
                    class=""
                    style="text-align: right"
                  >
                    <i class="hxicon-right"></i>
                  </view>
                </view>

                {{ addressData.province }}{{ addressData.city }}{{ addressData.detail }}
              </block>
            </view>
          </view>
          <view class="t-bb"></view>
        </view>
      </view>
    </view>
    <view class="b-r m-t container p12">
      <view class="store">
        <view class="name">
          <text v-if="storeData.store_name">{{ storeData.store_name }}</text>
          <text v-if="storeData.community">({{ storeData.community }})</text>
        </view>
        <view class="p-bb b-b"></view>
        <view class="goods-box">
          <block
            v-for="(goods, i) in carts"
            :key="i"
            v-if="carts"
          >
            <view class="goods-item">
              <view class="left">
                <image
                  :src="getimg + goods.good.img_id"
                  mode="aspectFit"
                ></image>
              </view>
              <view class="right">
                <view class="row1">
                  <view class="tit">
                    <text
                      class="zk"
                      v-if="goods.good.oldprice && Number(goods.good.price) < Number(goods.good.oldprice)"
                      >折</text
                    >
                    <text>{{ goods.good.name }}</text>
                  </view>
                  <view
                    class="old-price"
                    v-if="goods.good.oldprice"
                  >
                    <text class="fh">￥</text><text class="lt">{{ goods.good.oldprice }}</text>
                  </view>
                  <view class="price">
                    <text class="fh">￥</text><text>{{ goods.good.price }}</text>
                  </view>
                </view>
                <view class="row2"> </view>
                {{ goods.materials_text }}
                <view class="row3">
                  x<text>{{ goods.number }}</text>
                </view>
              </view>
            </view>
          </block>
        </view>
        <view class="p-bb b-b"></view>

        <list-cell v-if="type == '配送'">
          <view class="w-100 d-flex align-items-center justify-content-between">
            <view class="d-flex align-items-center">
              <view>配送费</view>
            </view>
            <view class="text-color-assist">{{ send_cost ? "￥" + send_cost : "免费" }}</view>
          </view>
        </list-cell>
        <list-cell
          arrow
          last
          @click="choose_coupon"
        >
          <view class="w-100 d-flex align-items-center justify-content-between">
            <view class="d-flex align-items-center">
              <view>优惠券</view>
            </view>
            <view class="text-color-assist">{{ coupon_name ? coupon_name : "有" + couponData.length + "张可用" }} </view>
          </view>
        </list-cell>
        <list-cell
          arrow
          last
        >
          <view class="w-100 d-flex align-items-center justify-content-between overflow-hidden">
            <view class="flex-shrink-0">备注</view>
            <navigator
              hover-class="none"
              class="flex-fill ml-40 text-truncate text-right"
              open-type="navigate"
              url="/pages/pay/remark"
              >{{ remark }}</navigator
            >
          </view>
        </list-cell>

        <view class="flex-rl totalbox">
          <view class="left">
            <text>优惠规则</text>
            <i class="hxicon-question"></i>
          </view>
          <view class="right">
            <view class="yh">
              <text class="txt">已优惠</text>
              <text class="fh">￥</text>
              <text class="num">{{ coupon_price + reduce }}</text>
            </view>
            <view class="total">
              <text class="txt">小计</text>
              <text class="fh">￥</text>
              <text class="num">{{ totalPrice }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="body-end"></view>

    <view class="foot">
      <view class="left">
        <view class="price">
          <text class="fh">￥</text>
          <text class="txt">{{ totalPrice }}</text>
        </view>
        <view
          class="discount"
          v-if="coupon_price"
        >
          <text>已优惠￥{{ coupon_price + reduce }}</text>
        </view>
      </view>
      <view
        class="right"
        @click="submit"
      >
        <text>提交订单</text>
      </view>
    </view>
    <uni-popup
      ref="popup"
      type="share"
    >
      <view class="coupon_box">
        <coupon
          v-for="(item, index) in couponData"
          :key="index"
          v-bind:item="item"
          types="carts"
          theme="#ff6c00"
          color="#ffffff"
          solid="#ff6c00"
          @choose_done="choose_done"
        ></coupon>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import listCell from "@/components/list-cell/list-cell.vue";
import coupon from "@/components/coolc-coupon/coolc-coupon";
export default {
  components: {
    listCell,
    coupon,
  },
  data() {
    return {
      coupon_name: "",
      msg: "",
      getimg: this.$getimg,
      scrollData: {},
      //购物车缓存 Storage 名称
      shoppingCartStorageName: "cart",
      //门店信息
      storeData: {},
      //购物车
      shopcart: [],
      //头部选项卡 参数为 0不显示选项卡,1,2
      tabIndex: 1,
      //收获地址
      addressData: null,
      //手机隐私
      ysStatus: true,

      //优惠券
      couponData: [],

      //结算价
      totalPrice: 0,
      //已优惠价
      totalYhPrice: 0,
      //商品数量
      totalNumber: 0,
      totalOldPrice: 0,

      carts: [],
      couponid: 0,
      coupon_price: 0,
      type: "",
      // 总价满足条件优惠的价格
      reduce: 0,
      // 规格
      sku: {},
      send_cost: 0,
      table_num: "",
    };
  },
  computed: {
    remark() {
      return this.$store.state.remark;
    },
  },
  onShow() {
    if (this.check_login()) {
      this.get_default_address();
    } else {
      uni.reLaunch({
        url: "../user/login/login",
      });
    }
  },
  onLoad(option) {},
  onPageScroll(e) {
    this.scrollData = e;
  },
  methods: {
    //优惠券弹出选择完成
    choose_done(e) {},
    choose_coupon() {},
    check_login() {},
    choose_address() {},
    get_default_address() {},
    privacyStatusChange(e) {},
    getSystemConfig() {},
    //提交订单
    async submit() {},
    radioChange: function (evt) {},
    reduce_money() {},
    // 计算规格
    computeSKU() {},
  },
};
</script>

<style lang="scss">
.coupon_box {
  background: $bgcolor_white;
  width: 100%;
  height: auto;
  display: table;
  padding: 6upx 26upx 26upx 26upx;
}

.pop_item {
  width: 100%;
  height: 50%;
  background-color: #ffffff;
}

.coupon_list {
  height: 40px;
}

.b-r {
  border-radius: 6px;
}

.m-t {
  margin-top: 6px;
}

.p-bb {
  margin: 16px 0;
  height: 1px;
  //background:  #E4E7ED;
}

.flex-rl {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.container {
  // margin-left: 12px;
  margin-right: 12px;
  background-color: #ffffff;
}

.p12 {
  padding: 12px;
}

.head {
  // background: linear-gradient(to bottom, #ffc107, #f1f1f1);

  padding-top: 20px;

  .tab-box {
    position: relative;
    height: 40px;
    margin: 0 12px;

    .item {
      position: absolute;
      top: 0;
      bottom: 0;
      height: 40px;
      text-align: center;
      font-size: 14px;

      width: 50%;

      .tit-box {
        position: relative;
        height: 36px;
        line-height: 36px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        background-color: rgba(#ffffff, 0.6);
        width: 100%;
      }
    }

    .item:first-child {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-end;
      left: 0;
    }

    .item:last-child {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: flex-end;
      right: 0;
    }

    .active {
      height: 40px;
      width: 51%;
      font-weight: bold;

      .tit-box {
        height: 40px;
        line-height: 40px;
        background-color: rgba(#ffffff, 1);
      }
    }

    .left .tit-box {
      margin-left: 12px;
      margin-right: -12px;
      padding-right: 12px;
    }

    .right .tit-box {
      flex-shrink: 0;
      margin-right: 12px;
      margin-left: -12px;
      padding-left: 12px;
    }

    .left.active .tit-box {
      margin: 0;
    }

    .right.active .tit-box {
      margin: 0;
    }

    .left.active .tit-box:after {
      content: "";
      position: absolute;
      right: -12px;
      bottom: 0;
      border-top: 12px solid transparent;
      border-right: 12px solid transparent;
      border-bottom: 36px solid #ffffff;
    }

    .right.active .tit-box:after {
      content: "";
      position: absolute;
      left: -12px;
      bottom: 0;
      border-top: 12px solid transparent;
      border-left: 12px solid transparent;
      border-bottom: 36px solid #ffffff;
    }
  }

  .head-bottom {
    overflow: hidden;
    background: #ffffff;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;

    .tab {
      .t-top {
        &-box {
          margin: 0;
          padding: 12px;

          .txt1 {
            font-size: 18px;
            color: #888;
          }

          .icon1 {
            margin-left: 8px;
            color: #bbb;
          }
        }

        &-box:active {
          background-color: #f5f5f5;
        }
      }

      .t-bb {
        margin: 0 12px;
        height: 0.5px;
        background-color: #e4e7ed;
      }

      .t-bottom {
        padding: 12px;

        .row1 {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          //padding: 12px 0 0;
          .left {
            font-size: 14px;
            font-weight: bold;
          }

          .right {
            font-size: 14px;
            color: #ff9800;

            i {
              margin-left: 8px;
              color: #bbb;
            }
          }
        }

        .row2 {
          margin-top: 6px;
          font-size: 12px;
          color: #ff9800;
        }
      }
    }
  }

  .head-bottom.selectOne {
    border-top-left-radius: 0;
    border-top-right-radius: px;
  }

  .head-bottom.selectTow {
    border-top-left-radius: 6px;
    border-top-right-radius: 0;
  }
}

.store {
  display: flex;
  flex-direction: column;

  .name {
    padding: 4px 0 0px;
    font-size: 14px;
  }

  .goods-box {
    .goods-item {
      margin-top: 20px;
      display: flex;
      flex-direction: row;

      .left {
        width: 60px;
        height: 60px;

        image {
          border-radius: 4px;
          overflow: hidden;
          width: 100%;
          height: 100%;
          background-color: #f1f1f1;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;
        padding-left: 14px;

        .row1 {
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          .tit {
            font-size: 14px;
            color: #333333;
            font-weight: bold;
            flex: 1;
            flex-wrap: wrap;

            .zk {
              padding: 1px 3px;
              font-size: 10px;
              margin-right: 8px;
              border-radius: 4px;
              background-color: #f9221d;
              color: #ffffff;
            }
          }

          .old-price {
            padding-left: 12px;
            font-size: 14px;
            color: #888888;
            font-weight: bold;

            .lt {
              text-decoration: line-through;
            }

            .fh {
              font-size: 10px;
            }
          }

          .price {
            font-size: 16px;
            padding-left: 12px;
            color: #333333;
            font-weight: bold;

            .fh {
              font-size: 10px;
            }
          }
        }

        .row2 {
        }

        .row3 {
          font-size: 10px;
          color: #888888;
        }
      }
    }

    .goods-item:first-child {
      margin: 0;
    }
  }

  .peisong {
    .right {
      font-size: 14px;
      font-weight: bold;
    }

    .left {
      font-size: 16px;
      font-weight: bold;

      .fh {
        font-size: 10px;
      }
    }
  }

  .zhekou-box {
    .zhekou {
      display: flex;
      flex-direction: column;
      margin-top: 12px;

      .row1 {
        align-items: center;

        .left {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 20px;
          line-height: 20px;

          i {
            font-size: 16px;
            color: #ff5722;
          }

          .tit {
            font-weight: bold;
            margin-left: 6px;
            font-size: 14px;
            color: #333;
          }
        }

        .right {
          .tag1 {
            font-weight: bold;
            font-size: 14px;
            color: #ff5722;
          }
        }
      }

      .row2 {
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #888;
      }
    }

    .zhekou:first-child {
      margin: 0;
    }
  }

  .totalbox {
    align-items: flex-end;

    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #888;

      [class*="hxicon-"] {
        color: #aaa;
        margin-left: 4px;
        font-size: 16px;
      }
    }

    .right {
      display: flex;
      flex-direction: row;
      align-items: flex-end;

      .yh {
        color: #ff5722;

        .txt {
          color: #000;
          font-size: 15px;
        }

        .fh {
          font-weight: bold;
          margin-left: 3px;
          font-size: 13px;
        }

        .num {
          font-weight: bold;
          font-size: 18px;
        }
      }

      .total {
        margin-left: 16px;
        color: #333;

        .txt {
          font-size: 15px;
        }

        .fh {
          margin-left: 3px;
          font-size: 12px;
          font-weight: bold;
        }

        .num {
          font-weight: 900;
          font-size: 22px;
        }
      }
    }
  }
}

.privacy {
  display: flex;
  flex-direction: column;

  .row1 {
    align-items: flex-end;

    .left {
      display: flex;
      flex-direction: row;
      align-items: center;

      .icon1 {
        color: #444;
        font-size: 24px;
      }

      .icon2 {
        color: #aaa;
        margin-left: 6px;
        font-size: 16px;
      }

      .txt {
        color: #333;
        margin-left: 6px;
        font-weight: bold;
        font-size: 14px;
      }
    }

    .right {
    }
  }

  .row2 {
    margin-top: 4px;
    color: #888;
    font-size: 12px;
  }

  .row3 {
    margin-top: 8px;
    font-size: 12px;
    color: #ff9800;
  }
}

.other-box {
  display: flex;
  flex-direction: column;

  .row {
    align-items: center;

    .left {
      font-size: 14px;
      color: #333;
      font-weight: bold;
      flex: 1;
    }

    .right {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      // flex-wrap: wrap;
      width: 60%;
      font-size: 14px;
      display: flex;
      flex-direction: row;
      color: #aaa;

      [class*="hxicon-"] {
        position: relative;
        top: 2px;
        font-size: 14px;
      }
    }
  }
}

.body-end {
  height: 100px;
}

.foot {
  z-index: 11;
  position: fixed;
  display: flex;
  flex-direction: row;
  border-radius: 50px;
  overflow: hidden;
  bottom: 12px;
  left: 12px;
  right: 12px;
  height: 50px;

  .left {
    padding: 0 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #222222;
    flex: 1;

    .price {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      color: #fff;
      height: 25px;
      line-height: 25px;

      .fh {
        font-weight: bold;
        font-size: 12px;
      }

      .txt {
        font-size: 22px;
        font-weight: bold;
      }
    }

    .discount {
      margin-left: 2px;
      font-size: 10px;
      color: #bbb;
    }
  }

  .right {
    display: flex;
    align-items: center;
    color: #222;
    font-weight: bold;
    font-size: 16px;
    padding-left: 15px;
    padding-right: 15px;
    transition: all 0.3s;
    background: linear-gradient(45deg, #ffeb3b, #ffc107);
  }

  .right:active {
    background: linear-gradient(45deg, #e0ce31, #e4ad06);
  }
}

.flex-start {
  display: flex;
  justify-content: flex-start;

  > view {
    height: 100%;

    &:first-child {
      width: 100rpx;
      flex-shrink: 0;
    }

    &:last-child {
      width: 100%;
    }
  }
}
</style>
