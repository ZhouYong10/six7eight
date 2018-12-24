<template>
    <div style="height: 100%">
        <el-row type="flex" justify="center">
            <el-col :sm="24" :md="12" :lg="16">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <span>卡片名称</span>
                        <el-button size="small" type="success" icon="el-icon-refresh"
                                   style="float: right;"
                                   @click="freshData">刷 新</el-button>
                    </div>
                    <p><span>今日下单: </span><span></span></p>
                    <p><span>今日撤单: </span><span></span></p>
                    <p><span>今日成本: </span><span></span></p>
                    <p><span>今日利润: </span><span></span></p>
                    <p><span>新增用户: </span><span></span></p>
                    <p><span>今日充值: </span><span></span></p>
                    <p><span>今日提现: </span><span></span></p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {axiosGet} from "@/utils";

    export default {
        name: "PlatformIndex",
        async created() {
            await axiosGet('/platform/auth/get/total/count/data');
        },
        methods: {
            freshData() {

            }
        }
    }
</script>

<style scoped>

</style>