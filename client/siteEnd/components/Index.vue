<template>
    <div style="height: 100%; padding: 0 12px;">
        <el-row>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                <el-button type="primary" size="small" icon="fa fa-refresh" @click="loadFundsAndUserInfo"> 刷新</el-button>
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                总余额: ￥{{statisticsData.funds}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                总冻结: ￥{{statisticsData.freezeFunds}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                正常用户: {{statisticsData.normal}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                冻结用户: {{statisticsData.freeze}}
            </div></el-col>
            <el-col :xs="12" :sm="12" :md="8" :lg="4"><div class="base-info">
                封禁用户: {{statisticsData.ban}}
            </div></el-col>
        </el-row>
        <hr/>
        <el-row :gutter="6">
            <el-col :sm="24" :md="24" :lg="11">
                <el-card class="index-placards"  style="margin-top: 12px;">
                    <div slot="header">
                        <h3 class="title">通知公告</h3>
                    </div>
                    <ul class="content">
                        <li v-for="placard in tableData">
                            <span class="placard-time">{{placard.createTime}}</span>
                            &nbsp;
                            <span class="placard-content">{{placard.content}}</span>
                        </li>
                    </ul>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="24" :lg="13">
                <el-card class="index-fundsCount" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                style="max-width: 130px;"
                                v-model="siteDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                                @change="loadPlatStatisticsBaseInfo"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="loadPlatStatisticsBaseInfo"> 刷新</el-button>
                    </div>
                    <ul>
                        <li>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <p><span>站点成本: ￥</span><span>{{statisticsData.siteDayBaseFunds}}</span></p>
                                </el-col>
                                <el-col :span="12">
                                    <p><span>站点利润: ￥</span><span>{{statisticsData.siteDayProfit}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <p><span>新增用户: </span><span>{{statisticsData.siteDayUser}}</span></p>
                                </el-col>
                                <el-col :span="12">
                                    <p><span>升级账户: </span><span>{{statisticsData.siteDayUserUpRole}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <p><span>自营下单: ￥</span><span>{{statisticsData.siteDayOrderFunds}}</span></p>
                                </el-col>
                                <el-col :span="12">
                                    <p><span>自营交易: ￥</span><span>{{statisticsData.siteDayOrderExecuteFunds}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <p><span>平台下单: ￥</span><span>{{statisticsData.platDayOrderFunds}}</span></p>
                                </el-col>
                                <el-col :span="12">
                                    <p><span>平台交易: ￥</span><span>{{statisticsData.platDayOrderExecuteFunds}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                </el-card>
                <el-card class="index-orderCount" style="margin-top: 12px;">
                    <div slot="header" class="clearfix">
                        <el-date-picker
                                style="max-width: 130px;"
                                v-model="orderDate"
                                type="date"
                                size="small"
                                :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd"
                                @change="loadOrdersInfo"
                                placeholder="选择日期">
                        </el-date-picker>
                        <el-button size="small" type="success" icon="fa fa-refresh"
                                   style="float: right;"
                                   @click="loadOrdersInfo"> 刷新</el-button>
                    </div>
                    <el-table
                            header-row-class-name="table-header"
                            :data="statisticsData.orderInfo"
                            max-height="340"
                            style="width: 100%">
                        <el-table-column
                                prop="name"
                                label="业务名称"
                                min-width="180">
                        </el-table-column>
                        <el-table-column
                                prop="orderNum"
                                label="订单个数"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                prop="totalNum"
                                label="下单总数"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                prop="executeNum"
                                label="执行总数"
                                min-width="80">
                        </el-table-column>
                        <el-table-column
                                label="下单总额"
                                min-width="120">
                            <template slot-scope="scope">
                                ￥<span>{{scope.row.totalFunds}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="交易总额"
                                min-width="120">
                            <template slot-scope="scope">
                                ￥<span>{{scope.row.executeFunds}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {today} from "@/utils";
    import {axiosGet} from "@/slfaxios";

    export default {
        name: "Placards",
        async created() {
            this.$options.sockets[this.siteId + 'addPlacardToSiteAdmin'] = (placard) => {
                if (this.tableData.length >= 3) {
                    this.tableData.splice(2, 1);
                }
                this.tableData.unshift(placard);
            };
            this.$options.sockets[this.siteId + 'editPlacardToSiteAdmin'] = (placard) => {
                let aim = this.tableData.find(item => {
                    return item.id === placard.id;
                });
                if (aim) {
                    aim.content = placard.content;
                }
            };
            let data = await axiosGet('/site/auth/platform/placards');
            this.tableData = data.placards;
            this.statisticsData = data.statistics;
        },
        data() {
            return {
                tableData: [],
                statisticsData: {
                    funds: 0,
                    freezeFunds: 0,
                    normal: 0,
                    freeze: 0,
                    ban: 0,
                    orderInfo: [],
                    siteDayBaseFunds: 0,
                    siteDayProfit: 0,
                    siteDayUser: 0,
                    siteDayUserUpRole: 0,
                    siteDayOrderFunds: 0,
                    siteDayOrderExecuteFunds: 0,
                    platDayOrderFunds: 0,
                    platDayOrderExecuteFunds: 0,
                },
                orderDate: today(),
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
                let result = await axiosGet('/site/auth/get/total/funds/users/info');
                this.statisticsData.funds = result.funds;
                this.statisticsData.freezeFunds = result.freezeFunds;
                this.statisticsData.normal = result.normal;
                this.statisticsData.freeze = result.freeze;
                this.statisticsData.ban = result.ban;
            },
            async loadOrdersInfo() {
                this.statisticsData.orderInfo = await axiosGet('/site/auth/get/order/count/data/' + this.orderDate);
            },
            async loadPlatStatisticsBaseInfo() {
                let result = await axiosGet('/site/auth/load/platform/statistics/base/info/' + this.siteDate);
                this.statisticsData.siteDayBaseFunds = result.siteDayBaseFunds;
                this.statisticsData.siteDayProfit = result.siteDayProfit;
                this.statisticsData.siteDayUser = result.siteDayUser;
                this.statisticsData.siteDayUserUpRole = result.siteDayUserUpRole;
                this.statisticsData.siteDayOrderFunds = result.siteDayOrderFunds;
                this.statisticsData.siteDayOrderExecuteFunds = result.siteDayOrderExecuteFunds;
                this.statisticsData.platDayOrderFunds = result.platDayOrderFunds;
                this.statisticsData.platDayOrderExecuteFunds = result.platDayOrderExecuteFunds;
            },
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            }
        }
    }
</script>

<style lang="scss">
    .base-info {
        line-height: 36px;
    }
    .index-placards{
        box-shadow: 0 6px 12px 0 rgba(0,0,0,.4)!important;
        .el-card__header{
            background: #7decd8;
        }
        .el-card__body{
            padding: 6px;
        }
        .title {
            padding: 0;
            text-align: center;
            margin: 0;
        }
        ul {
            margin: 0;
            li {
                line-height: 23px;
                padding:12px 0;
                border-bottom: 1px solid #dbe0de;
            }
            li:nth-child(2n-1){
                list-style: square url("../../commons/images/square-red.gif");
            }
            li:nth-child(2n){
                list-style: square url("../../commons/images/square-green.gif");
            }
        }

    }
    .index-fundsCount{
        margin-top: 12px;
        box-shadow: 0 6px 12px 0 rgba(0,0,0,.4)!important;
        .el-card__header{
            padding: 14px;
            background: #ebeef5;
        }
        .el-card__body{
            padding: 6px;
        }
        ul{
            list-style: none;
            margin: 0;
            padding: 0;
            li{
                border-bottom: 1px solid #dbe0de;
                color: #004bbb;
            }
        }
    }
    .index-orderCount{
        margin-top: 16px;
        box-shadow: 0 6px 12px 0 rgba(0,0,0,.4)!important;
        .el-card__header{
            padding: 14px;
            background: #ebeef5;
        }
        .el-card__body{
            padding: 6px;
        }
        .table-header{
            color: #259ba0;
        }
    }
</style>