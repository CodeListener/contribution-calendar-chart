<script setup lang="ts">
import { generateChartData, DateItem } from "./components/ContributionChart/core";
import Chart from "./components/ContributionChart/index.vue";
const year = 2021;
const startDate = "2021-09-29";
const endDate = "2022-05-29";

const mockData = generateChartData("2021-01-01", "2025-12-31")
  .dates.flat()
  .reduce<Record<string, DateItem & { level?: number }>>((prev, item) => {
    return { ...prev, [item.full]: { ...item, level: Math.round(Math.random() * 3) } };
  }, {});
</script>

<template>
  <h1>ContributionChart</h1>

  <h3>DEFAULT</h3>
  <Chart :dataSources="mockData" show-footer :description="'Description: Contribution-Chart'" />

  <h3>YEAR: 2021</h3>
  <Chart :data-sources="mockData" :year="year" />
  <h3>{{ startDate }} - {{ endDate }}</h3>
  <Chart :data-sources="mockData" :start-date="startDate" :end-date="endDate" />
</template>

<style scoped>
h1 {
  padding: 8px 12px;
  background-color: #0058f9;
  color: #fff;
  border-radius: 8px;
  font-size: 18px;
}
h3 {
  color: #333;
  font-size: 14px;
}
</style>
