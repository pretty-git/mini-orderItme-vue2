<template>
  <scroll-view class="scroll-view_H b-t b-b" scroll-x="true">
    <block v-for="(item, index) in dateArr" :key="index">
      <div
        class="flex-box"
        @click="handleDateClick(index, item)"
        :class="{ borderb: index == activeIndex }"
      >
        <view
          class="date-box"
          :style="{
            color: index == activeIndex ? selectedColor : '#333',
          }"
        >
          <text class="fontw">{{ item.week }}</text>
          <text>{{ item.date }}</text>
        </view>
      </div>
    </block>
  </scroll-view>
</template>

<script>
import { initData } from "../utils/date.js";

export default {
  name: "DatePicker",
  props: {
    selectedColor: {
      type: String,
      default: "#FB4B5C",
    },
  },
  data() {
    return {
      dateArr: [],
      activeIndex: 0,
    };
  },
  created() {
    this.dateArr = initData();
  },
  methods: {
    handleDateClick(index, item) {
      this.activeIndex = index;
      this.$emit("date-change", { index, item });
    },
    setActiveIndex(index) {
      this.activeIndex = index;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./pretty-times.scss";
</style>
