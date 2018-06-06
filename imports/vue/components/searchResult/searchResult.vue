<template>
    <el-row>
        <el-col :span="4">{{result.khName}}</el-col>
        <!--<el-col :span="4"></el-col>-->
        <!--<el-col :span="4"></el-col>-->
    </el-row>
</template>

<script>
    export default {
        props: {
            result: {
                type: Object,
                required: true
            }
        }
    }
</script>