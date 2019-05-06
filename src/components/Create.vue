<template>
  <div>
    <br>
    <el-steps :active="active" align-center finish-status="success">
      <el-step
        :title="item.title"
        :description="item.description"
        v-for="(item,index) in stepData"
        :key="index"
      ></el-step>
    </el-steps>

    <step1tree v-show="active === 0" ref="step1"></step1tree>

    <step2matrix v-if="active === 1"></step2matrix>

    <step3total v-if="active === 2"></step3total>

    <step4result v-if="active === 3"></step4result>

    <center>
      <el-button style="margin-top: 12px;" @click="last" v-show="active > 0">{{lastName}}</el-button>
      <el-button style="margin-top: 12px;" @click="next" v-show="active < 3" :disabled="!isPass && active == 1">{{nextName}}</el-button>
      <el-button style="margin-top: 12px;" type="success" @click="submit" v-show="active == 3">保存</el-button>
    </center>
  </div>
</template>

<script>
import step1tree from "./createviews/step1tree";
import step2matrix from "./createviews/step2matrix";
import step3total from "./createviews/step3total";
import step4result from "./createviews/step4result";
import { getData, addData } from "@/api.js";
import _ from 'lodash'

export default {
  name: "Create",
  components: {
    step1tree,
    step2matrix,
    step3total,
    step4result
  },
  data() {
    return {
      active: 0,
      stepData: [
        { title: "第一步", description: "建立递阶层次结构" },
        {
          title: "第二步",
          description: "构造判断矩阵并赋值及层次单排序与检验"
        },
        { title: "第三步", description: "层次总排序与检验" },
        { title: "第四步", description: "评价方案结果分析" }
      ],
      lastName: "上一步",
      nextName: "下一步",
      isPass: true,
    };
  },
  watch:{
    calResult:{
      deep: true,
      handler(nv , ov){
        let pass = true;
        _.forIn(nv, e=>{
          pass = pass && (e.CR <= 0.1 || e.CR == '-')
        })
        this.$set(this, 'isPass', pass)
      }
    }
  },
  computed: {
    calResult(){
      return this.$store.getters.calResult
    },
    schemes() {
      return this.$store.getters.schemes;
    },
    treeData() {
      return this.$store.getters.treeData;
    }
  },
  methods: {
    last() {
      this.active--;
    },
    next() {
      if (this.active === 0) {
        // NOTE: 3 手动触发第一步的结果保存
        this.$refs.step1.storeData();
      }
      this.$nextTick(() => {
          if (this.schemes.length < 2) {
            this.$message.error("方案大于1条才能评估");
            return;
          }
          if (this.treeData.child.length < 2) {
            this.$message.error("评价准则需要大于1条");
            return;
          }
          this.$nextTick(() => {
            this.active++;
          });
      });
    },
    submit() {
      // NOTE: 深度克隆，免得 matrix 对象转 array 过程修改到原对象
      const cloneMatrix = _.cloneDeep(this.$store.getters.matrixs); // math.matrix 对象json化不能解码
      let newCloneArray = {};
      _.forIn(cloneMatrix, (e, k) => {
        _.set(newCloneArray, k, e.toArray()); // 转 Array 方便后端存储
      });
      // NOTE: 保存到后端，数据都进行JSON 转换
      addData({
        modelid: this.$store.getters.rootid,
        name: this.treeData.name,
        matrix: JSON.stringify(newCloneArray),
        scheme: JSON.stringify(this.$store.getters.schemes),
        treeData: JSON.stringify(this.$store.state.treeData)
      }).then(res => {
        const data = res.data;
        if (data.code === 200) {
          this.$notify.success("保存成功");
          // NOTE: 保存成功跳转到历史页面
          setTimeout(() => {
            this.$router.replace("history");
          }, 1400);
        } else {
          this.$notify.error(data.msg);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
