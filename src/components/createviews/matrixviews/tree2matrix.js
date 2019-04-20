import "./index.less";
import _ from "lodash";
import miniTable from './miniTable'
import { isValid } from './matrixutil'

export default {
  name: "tree2matrix",
  props: {
    msg: String
  },
  components: {
    miniTable
  },
  data() {
    return {
      matrixs: {},
      calResult: {},
    };
  },
  computed: {
    // 获取前面的树
    tree() {
      return this.$store.getters.tree;
    },
  },
  methods: {
    // 初始化多个矩阵
    setMatrixs() {
      if(_.isEmpty(_.keys(this.$store.getters.matrixs))){
        // 空的时候才初始化
        this.$store.commit('setMatrixs')
      }
    },
  },
  created() {
    this.setMatrixs();
  },
  render(h) {
    if (!isValid(this.tree)) return null;
    const { scheme, target } = this.tree;
    return h("div", { style: { padding: "20px" } }, [
      h("div", [
        h("h1", ["评价指标"]),
        h("mini-table", {props:{table: target}})
      ]),
      h("div", [
        h("h1", ["评价方案"]),
        h("mini-table", {props:{table: scheme}})
      ]),
    ]);
  }
};
