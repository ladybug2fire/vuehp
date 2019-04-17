import "./index.less";
import _ from 'lodash'
export default {
  name: "tree2matrix",
  props: {
    msg: String
  },
  data() {
    return {
      matrixs: {}
    };
  },
  computed: {
    schemes(){
      return this.$store.getters.schemes;
    },
    tree() {
      return this.genArray(this.$store.getters.treeData);
    },
    genOptions(){
      // const num = 9;
      // const range = new Array(num).fill(0).map((e, i) => i + 1);
      // const fractionRange = range.slice(1).map(e => `1/${e}`);
      // return range.concat(fractionRange);
      return [1,2,3,4,5,6,7,8,9,'1/2','1/3','1/4','1/5','1/6','1/7','1/8','1/9']
    }
  },
  watch: {
    tree:{
      deep:true,
      handler: function(nv,ov){
        if(_.get(nv, 'target.length'))this.setMatrixs();
      }
    }
  },
  methods: {
    // 获取所有子数组
    genArray(node) {
      if(!node)return null;
      if (_.isEmpty(node.child)) {
        node.child = [...this.schemes];
        return {scheme: node};
      }
      const children = node.child.map(e => this.genArray(e));
      return ({
        scheme: _.flatten([...children.map(e=>e.scheme).filter(e=>e)]),
        target: _.flatten([node].concat(...children.map(e=>e.target).filter(e=>e)))
      });
    },
    // 初始化多个矩阵
    setMatrixs() {
      let obj = {};
      if(!this.isValid())return;
      const {scheme, target} = this.tree;
      [...scheme, ...target].forEach(e => {
        obj[e.name] = this.genMatrix(e.child.length);
      });
      this.$set(this, "matrixs", obj);
    },
    // 生成初始化矩阵
    genMatrix(num) {
      return new Array(num).fill(1).map(() => new Array(num).fill(1));
    },
    // 判断分数
    isFraction(num) {
      return num.length > 0 && num.match("/");
    },
    // 生成表头
    genThead(h, node) {
      let heads = [node.name, ...node.child.map(e => e.name)];
      let th = heads.map(e => h("th", [e]));
      return h("thead", [h("tr", [th])]);
    },
    // 表身
    genTbody(h, node) {
      const matrix = this.matrixs[node.name];
      if (!matrix) return null;
      let row = matrix.map((e, i) =>
        h("tr", [
          h("td", node.child[i].name),
          e.map((e, j) =>
            h("td", [
              j !== i
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
                          console.log(v);
                          this.$set(matrix[i], [j], data);
                          if (data) {
                            if (this.isFraction(data)) {
                              this.$set(matrix[j], i, data.split("/")[1]);
                            } else {
                              this.$set(matrix[j], i, `1/${data}`);
                            }
                          }
                        }
                      }
                    },
                    [
                      this.genOptions.map(
                        e => h("option", [e])
                      )
                    ]
                  )
                : e
            ])
          )
        ])
      );
      return h("tbody", [row]);
    },
    genTable(h, node) {
      return h("table", { class: "gridtable" }, [
        this.genThead(h, node),
        this.genTbody(h, node)
      ]);
    },
    isValid(){
      // 包含评价方案和评价准则才合法
      return _.isArray(_.get(this.tree, 'target')) && _.isArray(_.get(this.tree, 'scheme'))
    }
  },
  mounted() {
    this.setMatrixs();
  },
  render(h) {
    if(!this.isValid())return null;
    const {scheme, target} = this.tree;
    return h("div",{style:{'padding': '20px'}},[
      h('div', [h('h1',['评价指标']),h('div', {class:['target-section','table-container']},[target.map(e => this.genTable(h, e))])]),
      h('div', [h('h1',['评价方案']),h('div', {class:['target-section','table-container']},[scheme.map(e => this.genTable(h, e))])])
    ]);
  }
};
