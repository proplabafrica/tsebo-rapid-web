<template>
  <div class="card card-status card-height col col-12">
    <div id="sla-approval"></div>
  </div>
</template>

<script>
import ApexCharts from "apexcharts";

export default {
  methods: {
    async renderApprovalChart() {
      var approvalOptions = {
        annotations: {
          yaxis: [{
            y: 0,
          }],
          xaxis: [{
            x: 0,
          }]
        },
        chart: {
          id: "sla-approval",
          type: "line",
          height: 350,
          width: "100%",
          zoom: {
            autoScaleYaxis: true,
          },
          toolbar: {
            show: true
          },

        },
        plotOptions: {
          column: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },

        xaxis: {
          type: "category",
          labels: {
            // rotateAlways: true,
            // rotate: 45,// Rotate labels to -45 degrees
            // offsetY: 35,
            // offsetX: 30
          },
          categories: this.approvalMonths.map((m) => `${m.split(' ')[0].substring(0, 3)} ${m.split(' ')[1]}`),
        },
        yaxis: {
          title: {
            text: "Requests",
          },
          labels: {
            formatter: (val) => {
              return val;
            },
          },
        },
        tooltip: {
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            let dp1 = (series[0][dataPointIndex])
            const dp2 = (series[1][dataPointIndex])

            dp1 = parseFloat(dp1) > 0 ? (dp1 / dp2) * 100 : 0
            return (
              `
              <div style="font-size:12px;color:#868ba1; background-color: white;overflow: hidden;border-radius: 6px;width: fit-content;border: 1px solid #a5a3a3;filter:drop-shadow(-2px 5px 40px #818181)">
    <div style="background-color: rgb(221, 221, 221); padding-left: 10px; padding-top: 15px; padding-bottom: 15px;">

        ${w.globals.categoryLabels[dataPointIndex]}
    </div>

    <div style="padding: 10px;">
        <div style="display: flex; align-items: center; gap:10px">
            <div style="height: 10px; width: 10px; border-radius: 10px; background-color:rgba(0,143,251,0.85);"></div>
            <span>Sla Performance: ${dp1.toFixed(2)}%</span>
        </div>
        <div style="display: flex; align-items: center; gap:10px; margin-top: 20px;">
            <div style="height: 10px; width: 10px; border-radius: 10px; background-color:  #00e396;"></div>
            <span>Work Request: ${dp2}</span>
        </div>
    </div>
</div>
              `
            )
          }
        },
        series: [
          {
            name: "Request Completed Out of Sla",
            data: this.workOrderCompletedInSla,
            type: 'line',
            color: '#9e3a48'

          },
          {
            name: "Work Requests",
            data: this.workOrders,
            type: 'column',
            color: '#125195'


          },
        ],
      };
      var approvalChart = new ApexCharts(
        document.querySelector("#sla-approval"),
        approvalOptions
      );
      approvalChart.render();
    },
  },
  mounted() {
    this.renderApprovalChart();
  },
  props: [
    "approvalMonths",
    "workOrderCompletedInSla",
    "workOrderCompletedOutOfSla",
    "workOrders",
  ],
};
</script>
