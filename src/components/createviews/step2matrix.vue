<template>
  <div>
    <tree2matrix />
  </div>
</template>

<script>
  import tree2matrix from './matrixviews/tree2matrix'

  export default {
    name: "step2matrix",
    components: {
      tree2matrix
    },
    computed:{
      
    },
    data() {
      return {
        CR:0,              //CR为一致性比例，需要根据ppt中的算法计算出来，如果小于0.1，则通过检验出现下一个矩阵；如果大于0.1，则不通过检验，弹窗提示对表格重新赋值
      };
    },
  }
</script>

<style scoped>

</style>

