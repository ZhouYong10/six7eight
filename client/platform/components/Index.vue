<template>
    <div style="height: 100%">
        <el-row>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                <el-button type="primary" size="small" icon="fa fa-refresh" @click="loadFundsAndUserInfo"> 刷新</el-button>
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                总余额: ￥{{funds}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                总冻结: ￥{{freezeFunds}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                正常用户: {{normal}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                冻结用户: {{freeze}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                封禁用户: {{ban}}
            </div></el-col>
        </el-row>
        <el-row :gutter="6">
            <el-col :sm="24" :md="12" :lg="9">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                v-model="orderDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="freshData"> 刷新</el-button>
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
            <el-col :sm="24" :md="12" :lg="6">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                v-model="platDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="freshData"> 刷新</el-button>
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
            <el-col :sm="24" :md="12" :lg="9">
                <el-card class="box-card" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                v-model="siteDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="freshData"> 刷新</el-button>
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
    import {axiosGet, today} from "@/utils";

    export default {
        name: "PlatformIndex",
        async created() {
            await this.loadFundsAndUserInfo();
            await axiosGet('/platform/auth/get/total/count/data');
        },
        data() {
            return {
                funds: '',
                freezeFunds: '',
                normal: '',
                freeze: '',
                ban: '',
                orderDate: today(),
                platDate: today(),
                siteDate: today(),
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                }
            }
        },
        methods: {
            async loadFundsAndUserInfo() {
                let result = await axiosGet('/platform/auth/get/total/funds/users/info');
                this.funds = result.funds;
                this.freezeFunds = result.freezeFunds;
                this.normal = result.normal;
                this.freeze = result.freeze;
                this.ban = result.ban;
            },
            freshData() {

            }
        }
    }
</script>

<style scoped>
    .base-info {
        line-height: 36px;

    }
</style>