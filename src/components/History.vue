<template>
    <div class="block">
      <div class="radio">
        <br/>
        <el-radio-group v-model="reverse">
          <el-radio :label="false">正序</el-radio>
          <el-radio :label="true">倒序</el-radio>
        </el-radio-group>
      </div>
      <br/>
      <div>
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity,index) in activities"
            :key="index"
            :timestamp="activity.creationTime"
            :placement="top"
          >
            <el-card @click.native="test(activity)" shadow="hover" :style="{width:'800px'}">
              <p>{{activity.id}}</p>
              <h4>{{activity.name}}</h4>
              <p>{{activity.author}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

    </div>
</template>

<script>
    export default {
      name: "History",
      data() {
        return {
          reverse: false,
          activities: [{
            id:1,
            name:'评价项目一',
            author: '小明',
            creationTime: '2019-04-9',
          }, {
            id:2,
            name:'评价项目二',
            author: '小张',
            creationTime: '2019-04-10',
          }, {
            id:3,
            name:'评价项目三',
            author: '小李',
            creationTime: '2019-04-11',
          }]
        };
      },

      methods:{
        test(activity){
          var idx = activity.id;
          alert("测试中，待添加，id为："+idx);
        }
      }

    }
</script>

<style scoped>
  .el-card {
    cursor: pointer
  }
</style>
