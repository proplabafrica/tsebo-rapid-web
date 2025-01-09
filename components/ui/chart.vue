<template>
  <div>
    <VueApexCharts
      v-if="charttype"
      :height="height"
      :width="width"
      :type="charttype"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
    <VueApexCharts
      v-else
      :height="height"
      :width="width"
      type="line"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
  </div>
</template>

<script>
// import { Component, Prop, Vue } from "nuxt-property-decorator";

export default {
  mounted() {
    this.chartOptions = this.xAxis;
    this.series = this.series;
    this.yAxis = this.yAxis;
    this.chartWidth
      ? (this.width = this.chartWidth)
      : (this.width = this.width);

    this.chartHeight
      ? (this.height = this.chartHeight)
      : (this.width = this.width);

    // this.type = this.chattype;
  },
  components: {
    VueApexCharts: () => import("vue-apexcharts")
  },
  data() {
    return {
      type: "bar",
      width: 400,
      height: 300,
      chartOptions: {
        chart: {
          id: "vuechart-example"
        },
        xaxis: {
          categories: []
        }
      },
      series: [
        {
          data: [5000, 10000, 15000, 20000, 30000]
        },
        {
          data: [3000, 5000, 7000, 10000, 12000]
        }
      ],

      yAxis: [
        {
          title: {
            text: "Series A"
          }
        },
        {
          opposite: true,
          title: {
            text: "Series B"
          }
        }
      ]
    };
  },
  method: {
    setaxis() {
      return (this.chartOptions.xaxis.categories = this.xAxis);
    }
  },
  props: ["xAxis", "yAxis", "series", "charttype", "chartWidth", "chartHeight"]
};
</script>
