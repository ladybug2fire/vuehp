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
            <div v-for="(o, i) in schemeItems" :key="i" class="text item">
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
import shortid from 'shortid'
  let id = 1000;
  export default {
    name: "step1tree",
    data() {
      return {
        schemeItems: [{name:null, id:shortid.generate()}],
      }
    },
    methods: {
      addItem(){
        this.schemeItems.push({name: null, id:shortid.generate()})
      },
      delItem(i){
        this.$delete(this.schemeItems, i);
      },
      getData(){
        return this.$refs.tree.getData();
      },
      storeData(){
        if(_.isEqual(this.$store.getters.schemes, _.cloneDeep(this.schemeItems)) && 
          _.isEqual(this.$store.state.treeData, _.cloneDeep(this.getData()))
        )return;
        debugger
        this.$store.commit('setSchemes', _.cloneDeep(this.schemeItems.filter(e=>e.name)));
        this.$store.commit('setTreeData', _.cloneDeep(this.getData()));
        this.$store.commit('setMatrixs')
      }
    },
    mounted(){
      const loading = this.$loading()
      console.log(this.$store.dispatch('getData').then((res)=>{
        this.$set(this, 'schemeItems', res)
        setTimeout(() => {
          loading.close();
        }, 1500);
      }));
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

