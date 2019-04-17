<template>
  <div>
    <el-menu :default-active="activeIndex"
             class="navigation"
             mode="horizontal"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-menu-item index="1"><router-link :to="{name:'create'}">创建评价模型</router-link></el-menu-item>
      <el-menu-item index="2"><router-link :to="{name:'history'}">历史评价项目</router-link></el-menu-item>
      <el-menu-item index="3"><router-link :to="{name:'start'}">首页</router-link></el-menu-item>
    </el-menu>

    <router-view/>

  </div>
</template>

<script>
    export default {
      name: "Home",
    }
</script>

<style scoped>
  a{
    text-decoration:none
  }
  .el-menu-item{
    cursor: pointer
  }
</style>
