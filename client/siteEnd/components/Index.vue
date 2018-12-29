<template>
    <div style="height: 100%">
        <el-table
                style="margin-bottom: 10px;"
                :data="tableData">
            <el-table-column
                    label="发布日期"
                    :show-overflow-tooltip="true"
                    min-width="120">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="公告内容"
                    min-width="300">
            </el-table-column>
        </el-table>

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
                <el-card class="box-card" style="margin-top: 12px;">
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
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <p><span>站点成本: ￥</span><span>{{statisticsData.siteDayBaseFunds}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>站点利润: ￥</span><span>{{statisticsData.siteDayProfit}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>新增用户: </span><span>{{statisticsData.siteDayUser}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>升级账户: </span><span>{{statisticsData.siteDayUserUpRole}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>自营下单: ￥</span><span>{{statisticsData.siteDayOrderFunds}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>自营交易: ￥</span><span>{{statisticsData.siteDayOrderExecuteFunds}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>平台下单: ￥</span><span>{{statisticsData.platDayOrderFunds}}</span></p>
                        </el-col>
                        <el-col :span="12">
                            <p><span>平台交易: ￥</span><span>{{statisticsData.platDayOrderExecuteFunds}}</span></p>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :sm="24" :md="24" :lg="13">
                <el-card class="box-card" style="margin-top: 12px;">
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
                            :data="statisticsData.orderInfo"
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
    import {axiosGet, today} from "@/utils";

    export default {
        name: "Placards",
        async created() {
            this.tableData = await axiosGet('/site/auth/platform/placards');
            this.$options.sockets[this.siteId + 'addPlacardToSiteAdmin'] = (placard) => {
                this.tableData.splice(this.tableData.length - 1, 1);
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
</style>