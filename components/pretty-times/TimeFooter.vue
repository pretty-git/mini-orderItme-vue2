<template>
  <view class="bottom">
    <view class="show-time" v-if="showTime">
      预约时间：{{ orderDateTime }}
    </view>
    <div class="submit-btn" @click="handleSubmit">确认预约</div>
  </view>
</template>

<script>
export default {
  name: "TimeFooter",
  props: {
    orderDateTime: {
      type: [String, Object],
      default: "暂无选择",
    },
    showTime: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleSubmit() {
      this.$emit("submit");
    },
  },
};
</script>

<style lang="scss">
.bottom {
  display: flex;
  flex-direction: row;
  position: fixed;
  /* 兼容ios<11.2 */
  bottom: constant(safe-area-inset-bottom);
  /* 底部安全区域812 - 778 = 34*/
  /* 兼容ios>11.2 */
  bottom: env(safe-area-inset-bottom);
  /* env() 跟 constant() 需要同时存在，而且顺序不能换 */

  top: auto;
  left: 0rpx;
  width: 100%;
  background-color: #fff;
}

.show-time {
  width: 70%;
  color: #505050;
  background-color: rgba(255, 255, 255, 1);
  font-size: 15px;
  text-align: center;
}

.submit-btn {
  width: 25%;
  height: 80rpx;
  color: white;
  background-color: #ca89ff;
  font-size: 30rpx;
  line-height: 80rpx;
  text-align: center;
  margin: auto;
  padding: 10rpx 20rpx;
  margin-top: 40rpx;
  border-radius: 12rpx;
}
</style>
