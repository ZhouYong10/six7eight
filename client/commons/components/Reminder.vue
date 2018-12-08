<template>
    <el-row class="reminder">
        <el-col :span="24">
            <div class="title">{{title}}</div>
        </el-col>
        <el-col :span="24">
            <div class="content">
                <slot></slot>
            </div>
        </el-col>
    </el-row>
</template>

<script>
    export default {
        name: "Reminder",
        props: {title:String}
    }
</script>

<style lang="scss">
    .reminder{
        border: 1px solid #F5CECD;
        width: 100%;
        letter-spacing: 1px;
        line-height: 26px;
        margin-bottom: 16px;
        .title{
            font-size: 20px;
            text-align: center;
            background-color: #FAE5E4;
            border-bottom: 1px solid #F5CECD;
            color: #DD514C;
            font-weight: bold;
            padding: 6px 0;
        }
        .content{
            padding: 8px 12px;
        }
        .tip{
            color: red;
        }
    }
</style>