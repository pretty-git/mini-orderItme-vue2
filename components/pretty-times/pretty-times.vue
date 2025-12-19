<template>
  <view class="content">
    <view class="container">
      <!-- 日期选择组件 -->
      <DatePicker
        :selectedColor="selectedTabColor"
        @date-change="selectDateEvent"
        ref="datePicker"
      />

      <!-- 时间列表组件 -->
      <TimeList
        v-if="!isSection || isQuantum"
        :timeArr="timeArr"
        :isMultiple="isMultiple"
        :isQuantum="isQuantum"
        :selectedColor="selectedItemColor"
        :disableText="disableText"
        :undisableText="undisableText"
        :activeIndex="timeActive"
        @time-click="selectTimeEvent"
      />

      <!-- 时间段选择组件 -->
      <TimeSection
        v-else
        :timeArr="timeArr"
        :beginTime="timeQuanBegin"
        :endTime="timeQuanEnd"
        :selectedColor="selectedItemColor"
        :disableText="disableText"
        :undisableText="undisableText"
        @section-click="handleSection"
      />
    </view>

    <!-- 底部操作栏组件 -->
    <TimeFooter
      :orderDateTime="orderDateTime"
      :showTime="!isMultiple && !isSection && !isQuantum"
      @submit="handleSubmit"
    />
  </view>
</template>

<script>
import { currentTime } from "../utils/date.js";
import { useTimeLogic } from "./composables/useTimeLogic.js";
import DatePicker from "./DatePicker.vue";
import TimeList from "./TimeList.vue";
import TimeSection from "./TimeSection.vue";
import TimeFooter from "./TimeFooter.vue";

export default {
  name: "TimePicker",
  components: {
    DatePicker,
    TimeList,
    TimeSection,
    TimeFooter,
  },
  model: {
    prop: "showPop",
    event: "change",
  },
  props: {
    isQuantum: {
      type: Boolean,
      default: false,
    },
    isMultiple: {
      //是否多选
      type: Boolean,
      default: false,
    },
    isSection: {
      //预约时间段
      type: Boolean,
      default: false,
    },
    disableText: {
      //禁用显示的文本
      type: String,
      default: "已约满",
    },
    undisableText: {
      //未禁用显示的文本
      type: String,
      default: "可预约",
    },
    timeInterval: {
      // 时间间隔，小时为单位
      type: Number,
      default: 1,
    },
    selectedTabColor: {
      // 日期栏选中的颜色
      type: String,
      default: "#FB4B5C",
    },
    selectedItemColor: {
      // 时间选中的颜色
      type: String,
      default: "#FB4B5C",
    },
    beginTime: {
      type: String,
      default: "09:00:00",
    },
    endTime: {
      type: String,
      default: "19:00:00",
    },
    appointTime: {
      // 预约的时间
      type: Array,
      default() {
        return [];
      },
    },
    disableTimeSlot: {
      // 预约开始和结束时间，来禁用时间段
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    appointTime: {
      handler(val) {
        if (Array.isArray(val)) {
          this.initOnload();
        }
      },
      deep: true,
    },
    disableTimeSlot: {
      handler(val) {
        if (Array.isArray(val)) {
          this.initOnload();
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      orderDateTime: "暂无选择", // 选中时间
      orderTimeArr: {}, //多选的时间
      timeArr: [], //时间数据
      nowDate: "", // 当前日期
      dateActive: 0, //选中的日期索引
      timeActive: 0, //选中的时间索引
      timeQuanBeginIndex: 0, //时间段开始的下标
      selectDate: "", //选择的日期
      timeQuanBegin: "", //时间段开始时间
      timeQuanEnd: "", //时间段结束时间
    };
  },
  created() {
    try {
      // 初始化 composable
      const timeLogic = useTimeLogic();
      this.initTimeArray = timeLogic.initTimeArray;
      this.processQuantumDisable = timeLogic.processQuantumDisable;
      this.processNormalDisable = timeLogic.processNormalDisable;

      this.selectDate = this.nowDate = currentTime().date;
      this.initOnload();
    } catch (error) {
      console.error("TimePicker initialization error:", error);
    }
  },
  methods: {
    initOnload() {
      // 初始化时间数组
      const rawTimeArr = this.initTimeArray(
        this.beginTime,
        this.endTime,
        this.timeInterval,
        this.isQuantum
      );

      // 切换日期时，重置时间段选择（包括 isSection 模式）
      // 这样可以确保切换日期后，之前选择的时间段不会保留
      this.timeQuanBegin = this.timeQuanEnd = "";
      this.timeQuanBeginIndex = 0;

      let timeArrCopy;
      let isFullTime = true;

      // 根据模式处理时间数组
      if (this.isQuantum) {
        timeArrCopy = this.processQuantumDisable(
          rawTimeArr,
          this.selectDate,
          this.nowDate,
          this.disableTimeSlot,
          this.orderTimeArr
        );
      } else {
        const result = this.processNormalDisable(
          rawTimeArr,
          this.selectDate,
          this.nowDate,
          this.appointTime,
          this.disableTimeSlot,
          this.isSection,
          this.isMultiple,
          this.orderTimeArr
        );
        timeArrCopy = result.timeArrCopy;
        isFullTime = result.isFullTime;
      }

      // 更新数组以触发响应式
      this.timeArr = timeArrCopy;

      // 如果是时间段模式，清空所有 isInclude 状态
      if (this.isSection) {
        this.timeArr = this.timeArr.map((t) => ({ ...t, isInclude: false }));
      }

      this.orderDateTime = isFullTime ? "暂无选择" : this.selectDate;
      this.timeActive = -1;
      for (let i = 0, len = this.timeArr.length; i < len; i++) {
        if (!this.timeArr[i].disable) {
          this.orderDateTime = `${this.selectDate} ${this.timeArr[i].time}`;
          this.timeActive = i;
          return;
        }
      }
    },

    // 日期选择事件
    selectDateEvent({ index, item }) {
      this.dateActive = index;
      this.selectDate = item.date;
      if (this.$refs.datePicker) {
        this.$refs.datePicker.setActiveIndex(index);
      }
      this.initOnload();
    },

    // 时间选择事件
    selectTimeEvent({ index, item }) {
      if (this.isQuantum) {
        return this.handleSelectQuantum(index, item);
      }
      if (item.disable) return;

      if (this.isMultiple) {
        // 创建新数组以触发响应式更新
        this.timeArr = this.timeArr.map((t, i) => {
          if (i === index) {
            return { ...t, isActive: !t.isActive };
          }
          return t;
        });

        this.orderTimeArr[this.selectDate] = this.timeArr.reduce(
          (prev, cur) => {
            if (cur.isActive) {
              prev.push(cur.time);
            }
            return prev;
          },
          []
        );
      } else {
        this.timeActive = index;
        this.orderDateTime = `${this.selectDate} ${item.time}`;
      }
    },

    // 选择时间段
    handleSection({ index, item }) {
      if (item.disable) return;

      const clearTime = () => {
        this.timeQuanBeginIndex = index;
        this.timeQuanBegin = item.time;
        this.timeQuanEnd = "";
      };

      if (!this.timeQuanBegin) {
        clearTime();
        return;
      }

      if (!this.timeQuanEnd && this.timeQuanBegin) {
        let isDisable = false;
        let start = this.timeQuanBeginIndex;
        let end = index;

        // 确保 start <= end
        if (start > end) {
          [start, end] = [end, start];
        }

        // 检查中间是否有禁用的时间段
        for (let i = start + 1; i < end; i++) {
          if (this.timeArr[i]?.disable) {
            isDisable = true;
            clearTime();
            return;
          }
        }

        // 更新中间项的 isInclude 状态
        if (!isDisable) {
          this.timeArr = this.timeArr.map((t, i) => {
            if (i > start && i < end) {
              return { ...t, isInclude: true };
            }
            return t;
          });
        }
        this.timeQuanEnd = item.time;
        return;
      }

      // 如果已经选择了完整时间段，重新开始选择
      if (this.timeQuanBegin && this.timeQuanEnd) {
        this.timeArr = this.timeArr.map((t) => ({ ...t, isInclude: false }));
        clearTime();
      }
    },
    handleSelectQuantum(index, item) {
      if (item.disable) return;

      if (this.isMultiple) {
        // 创建新数组以触发响应式更新
        this.timeArr = this.timeArr.map((t, i) => {
          if (i === index) {
            return { ...t, isActive: !t.isActive };
          }
          return t;
        });

        this.orderTimeArr[this.selectDate] = this.timeArr.reduce(
          (prev, cur) => {
            if (cur.isActive) {
              const cur_be_time = `${this.selectDate} ${cur.begin}:00`;
              const cur_end_time = `${this.selectDate} ${cur.end}:00`;
              prev.push([cur_be_time, cur_end_time]);
            }
            return prev;
          },
          []
        );
      } else {
        this.timeActive = index;
        this.orderDateTime = {
          begin: `${this.selectDate} ${item.begin}:00`,
          end: `${this.selectDate} ${item.end}:00`,
        };
      }
    },
    handleChange() {
      this.timeQuanBegin > this.timeQuanEnd &&
        ([this.timeQuanBegin, this.timeQuanEnd] = [
          this.timeQuanEnd,
          this.timeQuanBegin,
        ]);
    },
    handleSubmit() {
      if (this.isSection) {
        // 验证时间段是否完整
        if (!this.timeQuanBegin || !this.timeQuanEnd) {
          // 可以在这里添加提示，或者直接返回
          return;
        }
        this.handleChange();
        this.$emit("change", {
          beginTime: `${this.selectDate} ${this.timeQuanBegin}`,
          endTime: `${this.selectDate} ${this.timeQuanEnd}`,
        });
        return;
      }

      if (this.isMultiple) {
        if (this.isQuantum) {
          // 检查是否有选中的时间段
          const hasSelection = Object.keys(this.orderTimeArr).some(
            (date) =>
              this.orderTimeArr[date] && this.orderTimeArr[date].length > 0
          );
          if (hasSelection) {
            this.$emit("change", this.orderTimeArr);
          }
          return;
        }
        let time = [];
        for (let date in this.orderTimeArr) {
          if (
            this.orderTimeArr[date] &&
            Array.isArray(this.orderTimeArr[date])
          ) {
            this.orderTimeArr[date].forEach((item) => {
              time.push(`${date} ${item}`);
            });
          }
        }
        if (time.length > 0) {
          this.$emit("change", time);
        }
      } else {
        if (this.orderDateTime && this.orderDateTime !== "暂无选择") {
          this.$emit("change", this.orderDateTime);
        }
      }
    },
  },
};
</script>
<style lang="scss">
@import "./pretty-times.scss";

page {
  height: 100%;
}

.content {
  text-align: center;
  height: 100%;
}
</style>
