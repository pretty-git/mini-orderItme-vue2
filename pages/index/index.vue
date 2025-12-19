<template>
  <view>
    <!-- 预约时间段的写法 -->
    <TimesPiker
      @change="getTime"
      :isMultiple="true"
      :timeInterval="1"
      :isQuantum="true"
      :disableTimeSlot="disableTimeSlot"
    >
    </TimesPiker>
    <!-- 多选时间的配置 -->
    <!-- <TimesPiker
      @change="getTime"
      :timeInterval="1"
      :appointTime="appointTime"
      :isMultiple="true"
      :disableTimeSlot="disableTimeSlot"
    ></TimesPiker> -->

    <!-- 单选的配置 -->
    <!-- <TimesPiker
      @change="getTime"
      :timeInterval="1"
      :appointTime="appointTime"
      :isMultiple="false"
      :disableTimeSlot="disableTimeSlot"
    ></TimesPiker> -->

    <!-- 预约时间段 -->
    <!-- <TimesPiker
      @change="getTime"
      :timeInterval="1"
      :appointTime="appointTime"
      :isSection="true"
      :disableTimeSlot="disableTimeSlot"
    ></TimesPiker> -->
  </view>
</template>

<script>
import TimesPiker from "@/components/pretty-times/pretty-times.vue";

export default {
  components: {
    TimesPiker,
  },
  data() {
    return {
      appointTime: ["2022-02-10 15:30:00"],
      disableTimeSlot: [
        ["2025-12-18 18:00:00", "2025-12-18 19:00:00"],
        ["2022-05-05 16:30:00", "2022-05-05 18:30:00"],
      ],
    };
  },
  methods: {
    getTime(e) {
      console.log(e);
    },
  },
};
</script>

<style></style>
