<template>
  <view class="time-box">
    <view v-for="(item, _index) in timeArr" :key="_index" class="item">
      <view
        class="item-box"
        :class="{
          disable: item.disable,
          active: isMultiple ? item.isActive : _index == activeIndex,
        }"
        :style="{
          color: (isMultiple ? item.isActive : _index === activeIndex)
            ? selectedColor
            : '#333',
        }"
        @click="handleTimeClick(_index, item)"
      >
        <text v-if="isQuantum">{{ item.begin }}~{{ item.end }}</text>
        <text v-else>{{ item.time }}</text>
        <text class="all">{{
          item.disable ? disableText : undisableText
        }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "TimeList",
  props: {
    timeArr: {
      type: Array,
      default: () => [],
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    isQuantum: {
      type: Boolean,
      default: false,
    },
    selectedColor: {
      type: String,
      default: "#FB4B5C",
    },
    disableText: {
      type: String,
      default: "已约满",
    },
    undisableText: {
      type: String,
      default: "可预约",
    },
    activeIndex: {
      type: Number,
      default: -1,
    },
  },
  methods: {
    handleTimeClick(index, item) {
      if (item.disable) return;
      this.$emit("time-click", { index, item });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./pretty-times.scss";
</style>
