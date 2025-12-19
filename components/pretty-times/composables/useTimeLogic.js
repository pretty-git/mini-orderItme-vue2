import { initTime, currentTime } from "../../utils/date.js";

/**
 * 时间处理逻辑 composable
 */
export function useTimeLogic() {
  /**
   * 初始化时间数组
   */
  function initTimeArray(beginTime, endTime, timeInterval, isQuantum) {
    return initTime(beginTime, endTime, timeInterval, isQuantum);
  }

  /**
   * 处理时间段模式的禁用逻辑
   */
  function processQuantumDisable(
    timeArr,
    selectDate,
    nowDate,
    disableTimeSlot,
    orderTimeArr
  ) {
    const timeArrCopy = timeArr.map((item) => ({ ...item }));

    timeArrCopy.forEach((item) => {
      const cur_be_time = `${selectDate} ${item.begin}:00`;
      const cur_end_time = `${selectDate} ${item.end}:00`;

      // 检查是否在禁用时间段内
      for (let time of disableTimeSlot) {
        const [begin_time = "", end_time = ""] = time;
        if (begin_time && end_time) {
          // 时间段重叠判断
          if (cur_be_time < end_time && cur_end_time > begin_time) {
            item.disable = true;
            break;
          }
        }
      }

      // 当前日期且开始时间已过则禁用
      if (selectDate === nowDate && currentTime().time > `${item.begin}:00`) {
        item.disable = true;
      }

      // 多选时间段的切换日期不清除
      if (orderTimeArr[selectDate]) {
        for (let items of orderTimeArr[selectDate]) {
          if (
            items[0]?.split(" ")[1] === `${item.begin}:00` &&
            items[1]?.split(" ")[1] === `${item.end}:00`
          ) {
            item.isActive = true;
            break;
          }
        }
      }
    });

    return timeArrCopy;
  }

  /**
   * 处理普通时间模式的禁用逻辑
   */
  function processNormalDisable(
    timeArr,
    selectDate,
    nowDate,
    appointTime,
    disableTimeSlot,
    isSection,
    isMultiple,
    orderTimeArr
  ) {
    const timeArrCopy = timeArr.map((item) => ({ ...item }));
    let isFullTime = true;

    timeArrCopy.forEach((item) => {
      // 判断是当前这一天，选中时间小于当前时间则禁用
      if (selectDate === nowDate && currentTime().time > item.time) {
        item.disable = true;
      }

      // 将预约的时间禁用
      if (Array.isArray(appointTime)) {
        appointTime.forEach((t) => {
          if (t && typeof t === "string") {
            const parts = t.split(" ");
            if (parts.length >= 2) {
              const [date, time] = parts;
              if (date === selectDate && item.time === time) {
                item.disable = true;
              }
            }
          }
        });
      }

      // 禁用时间段
      const cur_time = `${selectDate} ${item.time}`;
      if (Array.isArray(disableTimeSlot)) {
        for (let time of disableTimeSlot) {
          if (Array.isArray(time) && time.length >= 2) {
            const [begin_time = "", end_time = ""] = time;
            if (
              begin_time &&
              end_time &&
              begin_time <= cur_time &&
              cur_time <= end_time
            ) {
              item.disable = true;
              break;
            }
          }
        }
      }

      // 判断是否当前日期时间都被预约
      if (!item.disable) {
        isFullTime = false;
      }

      if (isSection) {
        item.isInclude = false;
      }

      // 对多选操作的已选时间的回显
      if (isMultiple && orderTimeArr[selectDate]?.includes(item.time)) {
        item.isActive = true;
      }
    });

    return { timeArrCopy, isFullTime };
  }

  return {
    initTimeArray,
    processQuantumDisable,
    processNormalDisable,
  };
}

