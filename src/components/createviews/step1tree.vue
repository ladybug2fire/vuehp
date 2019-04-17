<template>
  <div class="block">
      <el-row>
        <el-col :span="12" :offset="1">
          <ly-tree ref="tree"></ly-tree>
        </el-col>
        <el-col :span="8" :offset="1">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>评价方案</span>
            </div>
            <div v-for="(o, i) in schemes" :key="i" class="text item">
              <el-input v-model="o.name" size="mini"  class="custom-input" placeholder="请输入评价方案"></el-input><el-button size="mini"  @click="delItem(i)"  type="danger">删除</el-button>
            </div>
            <el-button @click="addItem" size="mini" type="primary">添加</el-button>
          </el-card>
        </el-col>
      </el-row>
  </div>
</template>

<script>
import _ from 'lodash'
  let id = 1000;
  export default {
    name: "step1tree",
    data() {
      return {
        schemes: [{name:null}],
      }
    },

    methods: {
      addItem(){
        this.schemes.push({name: null})
      },
      delItem(i){
        this.$delete(this.schemes, i);
      },
      getData(){
        return this.$refs.tree.getData();
      },
      storeData(){
        this.$store.commit('setSchemes', _.cloneDeep(this.schemes));
        this.$store.commit('setTreeData', _.cloneDeep(this.getData()));
      }
    }
  }
</script>

<style scoped>
  .custom-input{
    width: 200px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
</style>

