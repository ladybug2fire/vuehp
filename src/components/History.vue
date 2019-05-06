<template>
  <div class="block">
    <div class="radio">
      <br>
      <el-radio-group v-model="reverse">
        <el-radio :label="false">正序</el-radio>
        <el-radio :label="true">倒序</el-radio>
      </el-radio-group>
    </div>
    <br>
    <div>
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity,index) in activities"
          :key="index"
          :timestamp="new Date(activity.createTime).toLocaleString()"
          placement="top"
        >
          <el-card @click.native="test(activity)" shadow="hover" :style="{width:'800px'}">
            <h4>{{activity.name}}</h4>
            <el-button size="mini" @click.stop="delData(activity)">
              删除
            </el-button>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import { getData, delData } from "@/api.js";
import _ from 'lodash'
export default {
  name: "History",
  data() {
    return {
      reverse: false,
      activities: [
      ]
    };
  },

  methods: {
    test(activity) {
      var idx = activity.modelid;
      this.$router.push({
        path: 'create',
        query: {
          id: idx
        }
      })
    },
    delData(activity){
      delData({
        params:{
          id: activity.modelid
        }
      }).then(res=>{
        if(_.get(res,'data.code')==200){
          this.$message.success('删除成功')
          this.getData();
        }else{
          this.$message.error('删除失败') 
        }
      })
    },
    getData(){
      getData().then(res=>{
        this.$set(this, 'activities', _.get(res, 'data.data'))
      })
    }
  },
  mounted() {
    // NOTE: 请求获取列表
    this.getData();
  }
};
</script>

<style scoped>
.el-card {
  cursor: pointer;
}
</style>
