import { Bar, mixins } from "vue-chartjs";

export default {
  mixins: [Bar, mixins.reactiveProp],
  props: ["label", "chartData"],
  mounted() {
    this.renderChart(
      {
        labels: this.label,
        datasets: [
          {
            label: "方案决策",
            backgroundColor: "#409EFF",
            data: this.chartData
          }
        ]
      },
      {
        // scaleStartValue: 0,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMin: 1
              }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false
      }
    );
  }
};
