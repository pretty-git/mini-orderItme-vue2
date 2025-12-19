<template>
  <view class="time-box">
    <view v-for="(item, _index) in timeArr" :key="_index" class="item">
      <view
        class="item-box"
        :class="{
          disable: item.disable || item.isInclude,
          active: item.time == beginTime || item.time == endTime,
        }"
        :style="{
          color:
            item.time === beginTime || item.time === endTime
              ? selectedColor
              : '#333',
        }"
        @click="handleSectionClick(_index, item)"
      >
        <text>{{ item.time }}</text>
        <text class="all">{{
          item.disable ? disableText : undisableText
        }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "TimeSection",
  props: {
    timeArr: {
      type: Array,
      default: () => [],
    },
    beginTime: {
      type: String,
      default: "",
    },
    endTime: {
      type: String,
      default: "",
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
  },
  methods: {
    handleSectionClick(index, item) {
      if (item.disable) return;
      this.$emit("section-click", { index, item });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./pretty-times.scss";
</style>
