<template>
  <div>
    <center>
      评价方案结果分析
      <table class="gridtable">
        <thead>
          <tr>
            <th></th>
            <th v-for="(name,i) in thead" :key="i">{{name}}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td v-for="(w, i) in WA" :key="i">{{w.toFixed(3)}}</td>
            <td></td>
          </tr>
          <tr v-for="(name, i) in rowname" :key="i">
            <td>{{name}}</td>
            <td v-for="(w, j) in WD[i]" :key="j">{{w}}</td>
            <td>{{Re[i].toFixed(3)}}</td>
          </tr>
        </tbody>
      </table>
      <div class="chart">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>方案决策</span>
          </div>
            <chart v-bind="{height:300, width:
        300}" :label="rowname" :chartData="Re"/>
        </el-card>
      </div>
    </center>
  </div>
</template>

<script>
import _ from "lodash";
import "./matrixviews/index.less";
import * as math from "mathjs";
import chart from "./chartView";
export default {
  components: { chart },
  computed: {
    Re() {
      return _.flatten(
        math.multiply(this.$store.state.WD, this.$store.state.WA)
      );
    },
    WD() {
      return this.$store.state.WD;
    },
    WA() {
      return _.flatten(this.$store.state.WA);
    },
    thead() {
      const schemeTables = this.$store.getters.tree.scheme; // 获取方案表格
      return schemeTables.map(e => e.name);
    },
    rowname() {
      return _.map(this.$store.getters.schemes, e => e.name);
    }
  },
  name: "step4result"
};
</script>

<style scoped>
</style>
