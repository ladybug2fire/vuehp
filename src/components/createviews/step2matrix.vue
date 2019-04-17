<template>
  <div>
    <br/>

    <el-table :data="tableData" border>
      <template v-for="fixedrow in fixedrows">
        <el-table-column :prop="fixedrow.prop"
                         :label="fixedrow.label"
                         width="100"
        >
        </el-table-column>
      </template>
    </el-table>
    CR=<input v-model="CR"></input>
  </div>
</template>

<script>
  import matrixselect from './matrixviews/matrixselect'
  import store from "../../store/store";

  export default {
    name: "step2matrix",
    components: {
      matrixselect
    },
    data() {
      return {
        CR:0,              //CR为一致性比例，需要根据ppt中的算法计算出来，如果小于0.1，则通过检验出现下一个矩阵；如果大于0.1，则不通过检验，弹窗提示对表格重新赋值
        fixedrows: [
          {prop: "goal", label: "选择旅游目的地"},
          {prop: "indicator1", label: "费用"},
          {prop: "indicator2", label: "交通"},
          {prop: "indicator3", label: "饮食"},
          {prop:"weight",label:"权重"}               //权重需要根据表格中的数据利用特征向量法实时计算出来
        ],
        tableData: [
          {
            goal: "费用",
            indicator1: 1,
            indicator2: <matrixselect ref="mat"></matrixselect>,
            indicator3: 1,
            weight:0,     //权重默认为0
          },
          {
            goal: "交通",
            indicator1: 1,
            indicator2: 1,
            indicator3: 1,
            weight:0,     //权重默认为0
          },
          {
            goal: "饮食",
            indicator1: 1,
            indicator2: 1,
            indicator3: 1,
            weight:0,     //权重默认为0
          }
        ]
      };
    },
    watch: {
      'this.$refs.mat.value': {
        handler(newval, oldval) {
          let a = this.$refs.mat.getsel;
          console.log(a);
          this.tableData[1].indicator1 = 1 / a;
          this.$nextTick();
          return a;
        },
        deep: true
      },
      selectValues(newVal, oldVal) {
        this.tableData[1].indicator1 = '1/' + newVal;
      }
    },
    computed: {
      selectValues() {
        return store.state.select;
      }
    }
  }
</script>

<style scoped>

</style>

