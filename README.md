# Pretty Times - uniapp Vue3 微信小程序

这是一个基于 uniapp Vue3 的预约时间选择组件，适用于微信小程序。

## 项目结构

```
pretty-times-vue3/
├── src/
│   ├── main.js                 # 应用入口文件
│   ├── App.vue                 # 应用根组件
│   ├── components/             # 组件目录
│   │   ├── pretty-times.vue   # 预约时间选择组件
│   │   └── pretty-times.scss  # 组件样式
│   ├── pages/                  # 页面目录
│   │   └── index/              # 首页
│   │       └── index.vue       # 页面组件
│   └── utils/                  # 工具函数
│       └── date.js             # 日期处理工具
├── manifest.json               # uniapp 应用配置文件
├── pages.json                  # 页面路由配置
├── vite.config.js              # Vite 构建配置
├── uni.scss                    # uniapp 样式变量
└── package.json                # 项目依赖
```

## 安装依赖

```bash
npm install
```

## 开发

```bash
# 微信小程序
npm run dev:mp-weixin
```

使用 HBuilderX 或微信开发者工具打开项目即可预览。

## 构建

```bash
# 微信小程序
npm run build:mp-weixin
```

构建完成后，使用微信开发者工具打开 `dist/dev/mp-weixin` 目录即可预览。

## 组件使用

### 基础用法

```vue
<template>
  <view>
    <PrettyTimes 
      @change="handleTimeChange"
    />
  </view>
</template>

<script setup>
import PrettyTimes from '@/components/pretty-times.vue'

const handleTimeChange = (time) => {
  console.log('选择的预约时间:', time)
}
</script>
```

### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| isQuantum | Boolean | false | 是否显示时间段（如：09:00~10:00） |
| isMultiple | Boolean | false | 是否支持多选 |
| isSection | Boolean | false | 是否支持选择时间段 |
| disableText | String | "已约满" | 禁用状态显示的文本 |
| undisableText | String | "可预约" | 未禁用状态显示的文本 |
| timeInterval | Number | 1 | 时间间隔（小时为单位） |
| selectedTabColor | String | "#FB4B5C" | 日期栏选中时的颜色 |
| selectedItemColor | String | "#FB4B5C" | 时间项选中时的颜色 |
| beginTime | String | "09:00:00" | 开始时间 |
| endTime | String | "19:00:00" | 结束时间 |
| appointTime | Array | [] | 已预约的时间数组，格式：['2024-01-15 10:00:00'] |
| disableTimeSlot | Array | [] | 禁用的时间段，格式：[['2024-01-15 12:00:00', '2024-01-15 13:00:00']] |

### Events 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| change | 确认预约时触发 | 选择的时间（字符串或对象） |

### 使用示例

#### 1. 单选模式

```vue
<PrettyTimes 
  :isMultiple="false"
  :beginTime="'09:00:00'"
  :endTime="'18:00:00'"
  @change="handleTimeChange"
/>
```

#### 2. 多选模式

```vue
<PrettyTimes 
  :isMultiple="true"
  @change="handleTimeChange"
/>
```

#### 3. 时间段模式

```vue
<PrettyTimes 
  :isQuantum="true"
  @change="handleTimeChange"
/>
```

#### 4. 预约时间段模式

```vue
<PrettyTimes 
  :isSection="true"
  @change="handleTimeChange"
/>
```

#### 5. 带已预约时间

```vue
<PrettyTimes 
  :appointTime="['2024-01-15 10:00:00', '2024-01-15 14:00:00']"
  @change="handleTimeChange"
/>
```

## 注意事项

1. 组件使用 uniapp 标准标签（view、text、scroll-view、button）
2. 时间格式统一为 `YYYY-MM-DD HH:mm:ss`
3. 组件会自动禁用当前时间之前的时间点
4. 已预约的时间会自动禁用显示
5. 使用 `@/` 别名引用组件和工具函数

## 技术栈

- uniapp 3.x
- Vue 3.2.0
- Vite 4.0.0
- Sass

## 开发工具

推荐使用 HBuilderX 或 VS Code 进行开发。

### HBuilderX
1. 使用 HBuilderX 打开项目
2. 运行 -> 运行到小程序模拟器 -> 微信开发者工具

### VS Code
1. 安装 uniapp 相关插件
2. 使用命令行运行 `npm run dev:mp-weixin`
3. 使用微信开发者工具打开构建后的目录

## 许可证

MIT
# orderTime-vue3
