<template>
    <div class="matrix-info">
        <div><span>&lambda;<sub>max</sub>:</span><span>{{lambda}}</span></div>
        <div><span>CI:</span><span>{{CI}}</span></div>
        <div><span>RI:</span><span>{{RI}}</span></div>
        <div><span>CR:</span><span>{{(CR)}}</span></div>
        <div v-if="CR <= 0.1 || CR == '-'">
            <el-alert
                :closable="false"
                title="一致性检验通过"
                type="success">
            </el-alert>
        </div>
        <div v-else>
            <el-alert
                :closable="false"
                title="一致性检验不通过,修改表格数据"
                type="error">
            </el-alert>
        </div>
    </div>
</template>

<script>
    export default {
        props:['CI','CR','n','lambda','RI']
    }
</script>

<style lang="scss" scoped>
.matrix-info{
    width: 90%;
}
</style>