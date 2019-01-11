<template>
    <div style="height: 100%; padding: 0 12px;">
        <el-row :gutter="12">
            <el-col :sm="24" :md="24" :lg="isLogin ? 11 : 24">
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
            <el-col :sm="24" :md="24" :lg="13" v-if="isLogin">
                <el-card class="index-fundsCount">
                    <div slot="header">
                        <el-date-picker
                                style="max-width: 130px;"
                                v-model="userDate"
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
                                    <p><span>充值: ￥</span><span>{{statisticsData.recharge}}</span></p>
                                </el-col>
                                <el-col :span="12">
                                    <p><span>提现: ￥</span><span>{{statisticsData.withdraw}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <p><span>消费: ￥</span><span>{{statisticsData.consume}}</span></p>
                                </el-col>
                                <el-col :span="12">
                                    <p><span>退款: ￥</span><span>{{statisticsData.refund}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                        <li>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <p><span>返利: ￥</span><span>{{statisticsData.profit}}</span></p>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                </el-card>
                <el-card class="index-orderCount">
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
                            max-height="320">
                        <el-table-column
                                prop="name"
                                label="业务名称"
                                min-width="160">
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
                                min-width="100">
                            <template slot-scope="scope">
                                ￥<span>{{scope.row.totalFunds}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="交易总额"
                                min-width="100">
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
            this.tableData = await axiosGet('/user/all/placards');
            if(this.isLogin){
                this.statisticsData = await axiosGet('/user/auth/get/total/count/data')
            }

            this.$options.sockets[this.siteId + 'addPlacardToFrontUser'] = (placard) => {
                if (this.tableData.length >= 6) {
                    if ('userSee' in placard) {
                        this.tableData.splice(2, 1);
                        this.tableData.unshift(placard);
                    }else{
                        this.tableData.splice(5, 1);
                        this.tableData.splice(3, 0, placard);
                    }
                }else{
                    this.tableData.unshift(placard);
                }
            };
            this.$options.sockets[this.siteId + 'editPlacardToFrontUser'] = (placard) => {
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
                    orderInfo: [],
                    recharge: 0,
                    withdraw: 0,
                    consume: 0,
                    refund: 0,
                    profit: 0,
                },
                orderDate: today(),
                userDate: today(),
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                }
            }
        },
        methods: {
            async loadOrdersInfo() {
                this.statisticsData.orderInfo = await axiosGet('/user/auth/get/order/count/data/' + this.orderDate);
            },
            async loadPlatStatisticsBaseInfo() {
                let result = await axiosGet('/user/auth/load/platform/statistics/base/info/' + this.userDate);
                this.statisticsData.recharge = result.recharge;
                this.statisticsData.withdraw = result.withdraw;
                this.statisticsData.consume = result.consume;
                this.statisticsData.refund = result.refund;
                this.statisticsData.profit = result.profit;
            },
        },
        computed: {
            siteId() {
                return this.$store.state.siteId;
            },
            isLogin() {
                return this.$store.state.userId;
            }
        }
    }
</script>

<style lang="scss">
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