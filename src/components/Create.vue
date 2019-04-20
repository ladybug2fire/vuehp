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

    <keep-alive>
      <step1tree v-show="active === 0" ref="step1"></step1tree>
    </keep-alive>

    <step2matrix v-if="active === 1"></step2matrix>

    <step3total v-if="active === 2"></step3total>

    <step4result v-if="active === 3"></step4result>

    <center>
      <el-button style="margin-top: 12px;" @click="last" v-show="active > 0">{{lastName}}</el-button>
      <el-button style="margin-top: 12px;" @click="next" v-show="active < 3">{{nextName}}</el-button>
      <el-button style="margin-top: 12px;" type="success" @click="submit" v-show="active == 3">完成</el-button>
    </center>
  </div>
</template>

<script>
import step1tree from "./createviews/step1tree";
import step2matrix from "./createviews/step2matrix";
import step3total from "./createviews/step3total";
import step4result from "./createviews/step4result";

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
      nextName: "下一步"
    };
  },
  methods: {
    last() {
      this.active--;
    },
    next() {
      if (this.active === 0) {
        this.$refs.step1.storeData();
      }
      this.$nextTick(() => {
        this.active++;
      });
    },
    submit(){
      this.$notify.success('提交成功')
    }
  }
};
</script>

<style scoped>
</style>
