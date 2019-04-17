<template>
  <el-select id="getselect" v-model="value" placeholder="选择">
    <el-option
      v-for="(item,index) in options"
      :key="index"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  import store from '../../../store/store'

  export default {
    name:'matrixselect',
    data() {
      return {
        options: [{
          value: 1,
          label: 1
        }, {
          value: 2,
          label: 2
        }, {
          value: 3,
          label: 3
        }, {
          value: 4,
          label: 4
        }, {
          value: 5,
          label: 5
        },{
          value: 6,
          label: 6
        }, {
          value: 7,
          label: 7
        }, {
          value: 8,
          label: 8
        }, {
          value: 9,
          label: 9
        }, {
          value: 1/2,
          label: '1/2'
        },{
          value: 1/3,
          label: '1/3'
        }, {
          value: 1/4,
          label: '1/4'
        }, {
          value: 1/5,
          label: '1/5'
        }, {
          value: 1/6,
          label: '1/6'
        }, {
          value: 1/7,
          label: '1/7'
        },{
          value: 1/8,
          label: '1/8'
        }, {
          value: 1/9,
          label: '1/9'
        }],
        value: ''
      }
    },
    computed:{
      getsel(){
        return this.value;
      }
    },
    watch:{
      value(newVal, oldVal) {
        store.state.select = newVal;
      }
    }
  }
</script>
