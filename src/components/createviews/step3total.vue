<template>
  <div>
    <center>
      层次总排序与检验
      <table class="gridtable">
        <thead>
          <tr>
            <th>指标</th>
            <th>单排序权重</th>
            <th>总排序权重</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(name,i) in thead" :key="i">
            <td>{{name}}</td>
            <td>{{WP[i]}}</td>
            <td>{{WA[i].toFixed(3)}}</td>
          </tr>
        </tbody>
      </table>
    </center>
  </div>
</template>

<script>
import "./matrixviews/index.less";
import * as math from "mathjs";
export default {
  computed: {
    WP() {
      return _.flatten(this.$store.state.WP);
    },
    WA() {
      return _.flatten(this.$store.state.WA);
    },
    calResult() {
      return this.$store.getters.calResult;
    },
    tree2map() {
      return this.$store.getters.tree2map;
    },
    matrixs() {
      return this.$store.getters.matrixs;
    },
    rootid() {
      return this.$store.getters.rootid;
    },
    tree() {
      return this.$store.getters.tree;
    },
    thead() {
      const schemeTables = this.tree.scheme; // 获取方案表格
      return schemeTables.map(e => e.name);
    },
    rowname() {
      return _.map(this.$store.getters.schemes, e => e.name);
    }
  },
  methods: {
    calOrder() {
      // 计算方案权重
      const schemeTables = this.tree.scheme; // 获取方案表格
      const schemesLength = _.get(this.$store.getters.schemes, "length");
      const WD = math.ones(schemesLength, _.get(schemeTables, "length")); // 单排矩阵
      const WA = math.ones(_.get(schemeTables, "length"), 1); // 总排序
      const WP = math.ones(_.get(schemeTables, "length"), 1); // 单排序
      _.each(schemeTables, (e, i) => {
        const key = e.id;
        const matrix = _.get(this.matrixs, key);
        const size = matrix.size();
        WD.subset(
          math.index(math.range(0, schemesLength), i),
          matrix.subset(math.index(math.range(0, size[0] - 1), size[1] - 1))
        );
        // 向上找根节点
        WA.subset(math.index(i, 0), this.calW2R(e.id));
        WP.subset(math.index(i, 0), this.calW2P(e.id));
      });
      this.$store.commit("setWD", WD.toArray());
      this.$store.commit("setWA", WA.toArray());
      this.$store.commit("setWP", WP.toArray());
    },
    // 计算到根结点的权重累积
    calW2R(key) {
      const parentKey = _.get(this.tree2map, `${key}.parent`);
      if (parentKey !== null) {
        const parentNode = _.get(this.tree2map, parentKey);
        const parentMatrix = _.get(this.matrixs, parentKey);
        const parentSize = parentMatrix.size();
        const currentPos = _.findIndex(parentNode.child, e => e === key); // 当前节点在父节点中的位置
        const WP = parentMatrix.subset(
          math.index(currentPos, parentSize[1] - 1)
        ); // 相对于父亲的权重
        return WP * this.calW2R(parentKey);
      }
      return 1;
    },
    // 计算到父节点
    calW2P(key) {
      const parentKey = _.get(this.tree2map, `${key}.parent`);
      if (parentKey !== null) {
        const parentNode = _.get(this.tree2map, parentKey);
        const parentMatrix = _.get(this.matrixs, parentKey);
        const parentSize = parentMatrix.size();
        const currentPos = _.findIndex(parentNode.child, e => e === key); // 当前节点在父节点中的位置
        const WP = parentMatrix.subset(
          math.index(currentPos, parentSize[1] - 1)
        ); // 相对于父亲的权重
        return WP;
      }
      return 1;
    }
  },
  mounted() {
    this.calOrder();
  },
  name: "step3total"
};
</script>

<style scoped>
</style>
