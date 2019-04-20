import { genOptions, genThead, isValid, R_I} from "./matrixutil";
import "./index.less";
import * as math from 'mathjs'
import MatrixInfo from "./matrixInfo";
const OPTIONS = genOptions();
export default {
  name: 'mini-table',
  props: ["matrix", "table"],
  components: {
    MatrixInfo,
  },
  computed: {
    matrixs() {
      return this.$store.getters.matrixs;
    },
    calResult() {
      return this.$store.state.calResult;
    }
  },
  methods: {
    genTbody(h, node) {
      const matrix = this.matrixs[node.id];
      if (!matrix) return null;
      const dimension = _.get(node, "child.length"); //指标维度
      const size = matrix.size();
      let row = matrix.toArray().map((e, i) =>
        h("tr", [
          h("td", _.get(node, `child.${i}.name`, "∑")),
          e.map((e, j) =>{
            return h("td", [
              // 小于指标维度才做处理
              i < j && j !== i && i < dimension && j < dimension
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
                          const data = math.fraction(v.target.value);
                          let matrix = _.cloneDeep(_.get(this.matrixs, node.id));
                          matrix.subset(math.index(i, j), data)
                          matrix.subset(math.index(j, i), math.divide(1, data))
                          this.$store.commit('setMatrix', {
                              key:node.id, matrix
                          })
                          this.$nextTick(() => {
                            this.calcMatrix(node.id);
                          });
                        }
                      }
                    },
                    [
                      OPTIONS.map(e =>
                        h("option", { domProps: { value: e.value } }, [e.label])
                      )
                    ]
                  )
                : (_.hasIn(e, 'toFraction') ? e.toFraction() : e)
            ])
           })
        ])
      );
      return h("tbody", [row]);
    },
    genTable(h, node) {
      return h("div", [
        h("table", { class: "gridtable" }, [
          genThead(h, node),
          this.genTbody(h, node)
        ]),
        h("matrix-info", { props: this.calResult[node.id] })
      ]);
    },
    // 计算 特征向量 与 lambda
    calcMatrix(key) {
      const matrix = _.cloneDeep(_.get(this.matrixs, key));
      if(!matrix)return;
      const size = matrix.size();
      const row = size[0],
        col = size[1];
      for (let i = 0; i < row - 1; i++) {
        let sub = matrix.subset(math.index(i, math.range(0, col - 3))).toArray();
        const U_i = _.get(sub, '0').reduce(
          (sum, e) =>
            math.multiply(sum, e),
          1
        );
        //1. 计算 Ui
        matrix.subset(math.index(i,col - 3),math.number(U_i).toFixed(3))
        // 2. 计算Vi
        matrix.subset(math.index(i,col - 2),Math.pow(U_i, 1 / (col - 3)).toFixed(3))
      }
      const v_i = math.subset(
        matrix,
        math.index(math.range(0, row - 1), col - 2)
      ).toArray();
      const sum = _.flatten(v_i).reduce((sum, e) => math.add(sum, e), 0);
      for (let j = 0; j < row - 1; j++) {
      // 计算wi
        matrix.subset(math.index(j, col-1), (v_i[j] / sum).toFixed(3))
      }
      // 计算每列的和
      for (let k = 0; k < col; k++) {
        let sub_col_i = _.flatten(
            matrix.subset(math.index(math.range(0, row - 1), k)).toArray()
        );
        let sum_col = sub_col_i.reduce(
          (sum, e) => math.add(sum, e),
          0
        );
        matrix.subset(math.index(row-1, k), math.number(sum_col).toFixed(3))
      }
      // 计算 lambda
      let matrixB = math.subset(
        matrix,
        math.index(math.range(0, row - 1), math.range(0, col - 3))
      ).toArray();
      let vectorW = math.subset(
        matrix,
        math.index(math.range(0, row - 1), col - 1)
      ).toArray();
      // 矩阵B乘向量W
      vectorW = vectorW.map(e=>math.fraction(e))
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
      this.$store.commit('setMatrix', {
        key, matrix
      })
      this.$store.commit("setCalResult", {
        key,
        value: {
          lambda,
          n,
          CI,
          CR,
          RI
        }
      });
    }
  },
  mounted() {
    this.table.map(e => {
        return this.calcMatrix(e.id)
    }) 
  },
  render(h) {
    return h("div", { class: ["target-section", "table-container"] }, [
      this.table.map(e => {
          return this.genTable(h, e)
        })
    ]);
  }
};
