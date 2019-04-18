import "./index.less";
import _ from "lodash";
import * as math from "mathjs";
import MatrixInfo from "./matrixInfo";
// 平均随机一致性指标R.I.表（1000次正互反矩阵计算结果） 1-15
const R_I = [
  0,
  0,
  0.5,
  0.89,
  1.12,
  1.26,
  1.36,
  1.41,
  1.46,
  1.49,
  1.52,
  1.54,
  1.56,
  1.58,
  1.59
];
export default {
  name: "tree2matrix",
  props: {
    msg: String
  },
  components: {
    MatrixInfo
  },
  data() {
    return {
      matrixs: {},
      calResult: {},
      isPassive: true
    };
  },
  computed: {
    // 获取方案
    schemes() {
      return this.$store.getters.schemes;
    },
    // 获取前面的树
    tree() {
      return this.genArray(this.$store.getters.treeData);
    },
    // 生成选项
    genOptions() {
      // const num = 9;
      // const range = new Array(num).fill(0).map((e, i) => i + 1);
      // const fractionRange = range.slice(1).map(e => `1/${e}`);
      // return range.concat(fractionRange);
      return [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "1/2",
        "1/3",
        "1/4",
        "1/5",
        "1/6",
        "1/7",
        "1/8",
        "1/9"
      ];
    }
  },
  watch: {
    tree: {
      deep: true,
      handler: function(nv, ov) {
        if (_.get(nv, "target.length")) this.setMatrixs();
      }
    }
  },
  methods: {
    // 获取所有子数组
    genArray(node) {
      if (!node) return null;
      if (_.isEmpty(node.child)) {
        node.child = [...this.schemes];
        return { scheme: node };
      }
      const children = node.child.map(e => this.genArray(e));
      return {
        scheme: _.flatten([...children.map(e => e.scheme).filter(e => e)]),
        target: _.flatten(
          [node].concat(...children.map(e => e.target).filter(e => e))
        )
      };
    },
    // 初始化多个矩阵
    setMatrixs() {
      let obj = {};
      if (!this.isValid()) return;
      const { scheme, target } = this.tree;
      [...scheme, ...target].forEach(e => {
        obj[e.name] = this.genMatrix(e.child.length);
      });
      this.$set(this, "matrixs", obj);
    },
    // 生成初始化矩阵
    genMatrix(num) {
      // 加1行 total, 加3 列 U,V,W
      return new Array(num + 1).fill(1).map(() => new Array(num + 3).fill(1));
    },
    // 判断分数
    isFraction(num) {
      return /\//g.test(num);
    },
    // 生成表头
    genThead(h, node) {
      let heads = [node.name, ...node.child.map(e => e.name)];
      let th = heads.map(e => h("th", [e]));
      let th_sub = ["U", "V", "W"].map(e => h("th", [e, h("sub", ["i"])]));
      return h("thead", [h("tr", [th, th_sub])]);
    },
    // 计算 特征向量 与 lambda
    calcMatrix(key) {
      const matrix = _.get(this.matrixs, key);
      const size = math.size(matrix);
      const row = size[0],
        col = size[1];
      for (let i = 0; i < row - 1; i++) {
        let sub = math.subset(matrix, math.index(i, math.range(0, col - 3)))[0];
        const U_i = sub.reduce(
          (sum, e) =>
            math.multiply(sum, this.isFraction(e) ? math.fraction(e) : e),
          1
        );
        //1. 计算 Ui
        this.$set(matrix[i], col - 3, math.number(U_i).toFixed(3));
        // 2. 计算Vi
        this.$set(matrix[i], col - 2, Math.pow(U_i, 1 / (col - 3)).toFixed(3));
      }
      const v_i = math.subset(
        matrix,
        math.index(math.range(0, row - 1), col - 2)
      );
      const sum = v_i.reduce((sum, e) => math.add(sum, e), 0);
      for (let j = 0; j < row - 1; j++) {
        // 计算wi
        this.$set(matrix[j], col - 1, (v_i[j] / sum).toFixed(3));
      }
      // 计算每列的和
      for (let k = 0; k < col; k++) {
        let sub_col_i = _.flatten(
          math.subset(matrix, math.index(math.range(0, row - 1), k))
        );
        let sum_col = sub_col_i.reduce(
          (sum, e) => math.add(sum, /\//g.test(e) ? math.fraction(e) : e),
          0
        );
        this.$set(matrix[row - 1], k, math.number(sum_col).toFixed(3));
      }
      // 计算 lambda
      let matrixB = math.subset(
        matrix,
        math.index(math.range(0, row - 1), math.range(0, col - 3))
      );
      const vectorW = math.subset(
        matrix,
        math.index(math.range(0, row - 1), col - 1)
      );
      // 分数字符转对象用于计算
      matrixB = matrixB.map(e =>
        this.isFraction(e) ? math.fraction(e) : math.number(e)
      );
      // 矩阵B乘向量W
      const BW = math.multiply(matrixB, vectorW);
      // 平铺 W_i 与 BW
      const flatten_W = _.flatten(vectorW);
      const flatten_BW = _.flatten(BW);
      const n = flatten_W.length; // 向量维度
      if (n > 15) {
        this.$message.error("维度太高不支持");
        return;
      }
      if (n != flatten_BW.length) {
        this.$message.error("维度不一致");
        return;
      } // 维度不一致
      // 计算得到lambda
      const lambda = (
        (1 / n) *
        flatten_BW.reduce((sum, e, i) => (sum += e / flatten_W[i]), 0)
      ).toFixed(3);
      const CI = ((lambda - n) / (n - 1)).toFixed(3);
      const RI = R_I[n - 1].toFixed(2);
      const CR = RI > 0 ? (CI / RI).toFixed(3) : "-";
      this.isPassive = RI ? CR <= 0.1 && this.isPassive : this.isPassive;
      this.$set(this.calResult, key, {
        lambda,
        n,
        CI,
        CR,
        RI
      });
    },
    // 表身
    genTbody(h, node) {
      const matrix = this.matrixs[node.name];
      if (!matrix) return null;
      const dimension = _.get(node, "child.length"); //指标维度
      let row = matrix.map((e, i) =>
        h("tr", [
          h("td", _.get(node, `child.${i}.name`, "∑")),
          e.map((e, j) =>
            h("td", [
              // 小于指标维度才做处理
              j !== i && i < dimension && j < dimension
                ? h(
                    "select",
                    {
                      props: {
                        value: e
                      },
                      domProps: {
                        value: e
                      },
                      on: {
                        input: v => {
                          const data = v.target.value;
                          this.$set(matrix[i], [j], data);
                          if (data) {
                            if (this.isFraction(data)) {
                              this.$set(matrix[j], i, data.split("/")[1]);
                            } else {
                              this.$set(
                                matrix[j],
                                i,
                                data == 1 ? 1 : `1/${data}`
                              );
                            }
                          }
                          this.$nextTick(() => {
                            this.calcMatrix(node.name);
                          });
                        }
                      }
                    },
                    [this.genOptions.map(e => h("option", [e]))]
                  )
                : e
            ])
          )
        ])
      );
      return h("tbody", [row]);
    },
    genTable(h, node) {
      return h("div", [
        h("table", { class: "gridtable" }, [
          this.genThead(h, node),
          this.genTbody(h, node)
        ]),
        h("matrix-info", { props: this.calResult[node.name] })
      ]);
    },
    isValid() {
      // 包含评价方案和评价准则才合法
      return (
        _.isArray(_.get(this.tree, "target")) &&
        _.isArray(_.get(this.tree, "scheme"))
      );
    },
    getPassive() {
      return this.isPassive; // 获取是否全部通过
    }
  },
  mounted() {
    this.setMatrixs();
    _.forIn(this.matrixs, (v, k) => {
      this.calcMatrix(k);
    });
  },
  render(h) {
    if (!this.isValid()) return null;
    const { scheme, target } = this.tree;
    return h("div", { style: { padding: "20px" } }, [
      h("div", [
        h("h1", ["评价指标"]),
        h("div", { class: ["target-section", "table-container"] }, [
          target.map(e => this.genTable(h, e))
        ])
      ]),
      h("div", [
        h("h1", ["评价方案"]),
        h("div", { class: ["target-section", "table-container"] }, [
          scheme.map(e => this.genTable(h, e))
        ])
      ])
    ]);
  }
};
