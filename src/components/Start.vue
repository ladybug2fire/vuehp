<template>
    <div>
      <el-container>
        <el-main>基于层次分析法的评价选优系统</el-main>
      </el-container>
      <el-row>
        <el-button type="text" style="display:block;margin:0 auto" @click="create">创建评价模型</el-button>
      </el-row>
      <el-row>
        <el-button type="text" style="display:block;margin:0 auto" @click="history">历史评价项目</el-button>
      </el-row>
    </div>
</template>

<script>
    export default {
      name: "Start",
      methods:{
        create(){
          this.$router.push('/home/create')
        },
        history(){
          this.$router.push('/home/history')
        }
      }
    }
</script>

<style scoped>
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    font-family: "Microsoft YaHei";
    font: 40px Extra large;
    text-align: center;
    line-height: 100px;
  }
</style>
