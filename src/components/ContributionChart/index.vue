<template>
  <div class="contribution-chart">
    <table>
      <thead class="thead">
        <tr>
          <th id="first-block"></th>
          <th v-for="item in months" :colspan="item.colspan" class="label">
            <span>
              {{ MonthMap[item.month] }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr v-for="(row, idx) in dates">
          <td class="label" :style="{ width: '30px' }">
            <!-- 只显示 星期 1，3，5 ，你也可以自行修改 -->
            <span v-if="idx % 2 !== 0">{{ WeekMap[idx] }}</span>
          </td>
          <td v-for="date in row" :data-date="date.full" :class="{ block: true, hidden: date.ignore }" :style="{ backgroundColor: dateBackgroundColor(date.full) }"></td>
        </tr>
      </tbody>
    </table>
    <div v-if="showFooter" class="tfoot">
      <div class="description">{{ description }}</div>
      <div class="colors" v-show="colors?.length">
        <span class="less-text">{{ lessText }}</span>
        <span v-for="color in colors" class="color-item" :style="[{ backgroundColor: color, marginLeft: '4px' }]"></span>
        <span class="more-text">{{ moreText }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { generateChartData, WeekMap, MonthMap } from "./core";

const props = withDefaults(
  defineProps<{
    year?: number;
    startDate?: string | number | Date;
    endDate?: string | number | Date;
    dataSources?: Record<string, { level?: number; [key: string]: any }>;
    description?: string;
    showFooter?: boolean;
    colors?: string[];
    lessText?: string;
    moreText?: string;
  }>(),
  {
    showFooter: false,
    moreText: "More",
    lessText: "Less",
    dataSources: () => ({}),
    colors: () => ["#ebedf0", "#87b5f1", "#1e80ff", "#005dd6"],
  }
);

let args: [args1?: any, args2?: any] = [];
if (props.startDate && props.endDate) {
  args = [props.startDate, props.endDate];
} else if (props.year) {
  args = [props.year];
}
const info = generateChartData(...args);
const months = info.months;
const dates = info.dates;

function dateBackgroundColor(date: string) {
  return props.colors[props.dataSources[date]?.level ?? 0];
}
</script>

<style scoped lang="less">
.contribution-chart {
  width: max-content;
  table {
    border-spacing: 3px;
  }
  th,
  td {
    box-sizing: border-box;
    background-color: transparent;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    line-height: 1;
    padding: 0;
    font-size: 12px;
  }
  th {
    text-align: left;
    color: #333;
    padding-bottom: 6px;
  }
  tr {
    font-weight: 300;
    height: 10px;
  }
  #first-block {
    width: 28px;
  }
  .block {
    border-radius: 2px;
    background-color: #efefef;
    &.hidden {
      background-color: transparent !important;
    }
  }
  .label {
    position: relative;
  }
  .tbody {
    .label span {
      position: absolute;
      top: 50%;
      transform: translate(0%, -50%);
    }
  }

  .tfoot {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
    font-size: 12px;
    color: #999;
    .colors {
      display: flex;
      align-items: center;
      .color-item {
        width: 10px;
        height: 10px;
        display: inline-block;
      }
      .color-item + .color-item {
        margin-left: 4px;
      }
      .more-text {
        margin-left: 4px;
      }
    }
  }
}
</style>
