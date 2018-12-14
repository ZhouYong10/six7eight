<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col style="text-align: right;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="getProductAndFormatForm">下 单</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="下单日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="表单内容"
                    min-width="80">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            width="500"
                            trigger="click">
                        <div v-for="(item, key) in scope.row.fields">
                            <p v-if="key.search('file') !== -1">
                                {{item.name}}: <img style="width: 100px; height: 100px;" :src="item.value" :alt="item.name"/>
                            </p>
                            <p v-else>
                                {{item.name}}: {{item.value}}
                            </p>
                        </div>
                        <el-button slot="reference">内容</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="单价"
                    min-width="66">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="totalPrice"
                    label="总价"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="startNum"
                    label="初始量"
                    min-width="70">
            </el-table-column>
            <el-table-column
                    label="执行进度"
                    min-width="60">
                <template slot-scope="scope">
                    {{scope.row.progress = countOrderProgress(scope.row)}}%
                </template>
            </el-table-column>
            <el-table-column
                    prop="executeNum"
                    label="已执行"
                    min-width="70">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 'order_wait'">待执行</span>
                    <span v-if="scope.row.status === 'order_execute'">执行中</span>
                    <span v-if="scope.row.status === 'order_finish'">已结束</span>
                    <span v-if="scope.row.status === 'order_refund'">撤销中</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="报错内容"
                    min-width="90">
                <template slot-scope="scope">
                    <el-popover
                            placement="bottom-start"
                            @show="loadErrors(scope.row)"
                            trigger="click">
                        <el-table :data="orderErrors" :max-height="260">
                            <el-table-column min-width="160" prop="createTime" label="报错日期"></el-table-column>
                            <el-table-column min-width="220" prop="content" label="报错内容"></el-table-column>
                            <el-table-column min-width="160" prop="dealTime" label="处理日期"></el-table-column>
                            <el-table-column min-width="220" prop="dealContent" label="处理内容"></el-table-column>
                        </el-table>

                        <div slot="reference" style="height: 39px;">
                            <el-badge value="new" :hidden="!scope.row.newErrorDeal" style="position: relative; bottom: -10px;">
                                <el-button size="mini">内容</el-button>
                            </el-badge>
                        </div>

                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="refundMsg"
                    label="撤单信息"
                    :show-overflow-tooltip="true"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="138">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-tooltip effect="dark" content="订单报错" placement="top-start">
                            <el-button type="warning" size="small" icon="el-icon-service" @click="openOrderError(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip v-if="scope.row.status !== 'order_finish' && scope.row.status !== 'order_refund' && scope.row.progress < 100"
                                effect="dark" content="申请撤单" placement="top-start">
                            <el-button type="danger" size="small" icon="el-icon-close" @click="orderRefund(scope.row)"></el-button>
                        </el-tooltip>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加订单报错" :visible.sync="dialogErrorVisible" top="3vh" width="30%" @closed="cancelDialogError">
            <el-form :model="dialogError" :rules="dialogErrorRules" ref="dialogError" label-width="60px">
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" :rows="3" v-model="dialogError.content" placeholder="请输入订单报错内容！"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogErrorVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="addOrderError">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="'添加订单/' + product.name" :visible.sync="dialogVisible" top="3vh" width="30%" @open="dialogOpen" @closed="cancelDialog">
            <sf-reminder title="提示">
                <span v-for="val in orderTip.split('\n')">
                    {{ val }}<br/>
                </span>
            </sf-reminder>
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="价格" prop="price">
                    ￥ <span>{{dialog.price}}</span>
                </el-form-item>
                <el-form-item
                        v-for="item in dialogItems"
                        :key="item.type"
                        :label="item.name"
                        :prop="item.type">
                    <el-upload
                            v-if="isFileField(item.type)"
                            class="avatar-uploader"
                            :action="uploadUrl()"
                            :show-file-list="false"
                            :on-success="uploadSuccess(item.type)"
                            :before-upload="beforeUpload">
                        <img v-show="dialog[item.type] !== ''" :src="dialog[item.type]" class="avatar">
                        <i v-show="dialog[item.type] === ''" class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <el-input
                            v-else-if="isCommentTaskField(item.type)"
                            type="textarea"
                            :rows="3"
                            placeholder="请输入评论内容，每行一条, 最少5条起评！"
                            v-model="dialog[item.type]">
                    </el-input>
                    <el-input
                            v-else-if="isCommentField(item.type)"
                            type="textarea"
                            :rows="3"
                            :placeholder="'请输入'+ item.name +'!'"
                            v-model="dialog[item.type]">
                    </el-input>
                    <el-input v-else v-model="dialog[item.type]" :placeholder="'请输入'+ item.name +'!'"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="num">
                    <span v-if="dialog.isCommentTask">{{dialog.num}}</span>
                    <el-input-number v-else v-model="dialog.num" :min="0" :controls="false"></el-input-number>
                </el-form-item>
                <el-form-item label="总价" prop="totalPrice">
                    ￥ <span>{{dialog.totalPrice}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="add">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost, getProductUserPrice, host, countOrderProgress} from "@/utils";
    import Vue from "vue";

    export default {
        name: "Product",
        props: ['id'],
        async created() {
            this.getTableData(this.id);
            this.registerListener(this.id);
        },
        watch: {
            id: function(val){
                this.getTableData(val);
                this.registerListener(val);
            }
        },
        data() {
            return {
                tableData: [],
                product: '',
                orderTip: '',
                orderErrors: [],
                dialogLabelWidth: '88px',
                dialogErrorVisible:false,
                dialogError: {
                    content: ''
                },
                dialogErrorRules: {
                    content: [
                        {required: true, message: '请输入订单报错内容！', trigger: 'blur'},
                        {max: 160, message: '内容不能超过160个字符！', trigger: 'blur'}
                    ]
                },
                dialogVisible: false,
                dialogItems: [],
                dialog: {
                    price: 0,
                    num: 0,
                    totalPrice: 0
                },
                dialogRules: {}
            }
        },
        methods: {
            registerListener(productId) {
                this.$options.sockets[productId + 'hasErrorDeal'] = (order) => {
                    let aim = this.tableData.find(item => {
                        return item.id === order.id;
                    });
                    aim.newErrorDeal = order.newErrorDeal;
                    aim.status = order.status;
                };
                this.$options.sockets[productId + 'executeOrder'] = (order) => {
                    let aim = this.tableData.find(item => {
                        return item.id === order.id;
                    });
                    aim.startNum = order.startNum;
                    aim.status = order.status;
                    aim.dealTime = order.dealTime;
                };
                this.$options.sockets[productId + 'refundOrder'] = (order) => {
                    let aim = this.tableData.find(item => {
                        return item.id === order.id;
                    });
                    aim.status = order.status;
                    aim.executeNum = order.executeNum;
                    aim.refundMsg = order.refundMsg;
                    aim.finishTime = order.finishTime;
                };
            },
            countOrderProgress(order) {
                return countOrderProgress(order);
            },
            async loadErrors(order) {
                this.orderErrors.splice(0);
                this.orderErrors = await axiosGet('/user/auth/order/' + order.id + '/errors');
                await axiosGet('/user/auth/see/errors/of/' + order.id);
                order.newErrorDeal = false;
            },
            openOrderError(order) {
                this.dialogError.order = order;
                this.dialogErrorVisible = true;
            },
            cancelDialogError() {
                this.$refs.dialogError.resetFields();
            },
            addOrderError() {
                this.$refs.dialogError.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/user/auth/order/add/error', {
                            orderId: this.dialogError.order.id,
                            content: this.dialogError.content
                        });
                        this.dialogErrorVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            async getTableData(productId) {
                this.tableData = await axiosGet('/user/auth/orders/' + productId);
            },
            async getProductAndFormatForm() {
                let product = this.product = await axiosGet('/user/product/' + this.id);
                if (!product.onSale) {
                    this.$message.error(product.name + ' 已经下架了！');
                } else {
                    this.orderTip = product.orderTip;
                    // 初始化数据
                    this.dialogItems = [];
                    this.dialogRules = {};
                    this.dialog = {
                        price: 0,
                        num: 0,
                        totalPrice: 0
                    };

                    for (let i = 0; i < product.attrs.length; i++) {
                        let item = product.attrs[i];
                        Vue.set(this.dialog, item.type, '');
                        this.dialogItems.push({
                            name: item.name,
                            type: item.type
                        });
                        if (this.isCommentTaskField(item.type)) {
                            this.dialog.isCommentTask = true;
                            this.dialogRules[item.type] = [
                                {required: true, message: '请输入' + item.name + '！', trigger: 'blur'},
                                {
                                    validator: async (rule, value, callback) => {
                                        let comments = value.split('\n');
                                        let num = comments.length;
                                        this.dialog.num = num;
                                        let price = this.dialog.price;
                                        this.dialog.totalPrice = parseFloat((price * num).toFixed(4));
                                        if (num < product.minNum) {
                                            callback(new Error('下单数量不能少于： ' + product.minNum));
                                        } else {
                                            if (!this.userFunds) {
                                                callback(new Error('请登录后下单！'));
                                            } else {
                                                if (this.dialog.totalPrice > this.userFunds) {
                                                    callback(new Error('账户余额不足，请充值！'));
                                                } else {
                                                    callback();
                                                }
                                            }
                                        }
                                    }, trigger: 'change'
                                }
                            ];
                        }else if(this.isAddressField(item.type)){
                            this.dialogRules[item.type] = [
                                {type: 'url', required: true, message: '请输入正确的' + item.name + '！', trigger: 'blur'}
                            ];
                        } else {
                            this.dialogRules[item.type] = [{required: true, message: '请输入' + item.name + '！', trigger: 'blur'}];
                        }
                    }
                    if (this.dialog.isCommentTask) {
                        this.dialogRules.num = [{required: true, message: '下单数量不能为空！', trigger: 'blur'}];
                    } else {
                        this.dialogRules.num = [
                            {required: true, message: '请输入订单数量！', trigger: 'blur'},
                            {
                                validator: async (rule, value, callback) => {
                                    let price = this.dialog.price;
                                    this.dialog.totalPrice = parseFloat((price * value).toFixed(4));
                                    if (value < product.minNum) {
                                        callback(new Error('下单数量不能少于： ' + product.minNum));
                                    } else {
                                        if (this.isLogin) {
                                            if (this.dialog.totalPrice > this.userFunds) {
                                                callback(new Error('账户余额不足，请充值！'));
                                            } else {
                                                callback();
                                            }
                                        } else {
                                            callback(new Error('请登录后下单！'));
                                        }
                                    }
                                }, trigger: 'blur'
                            }
                        ];
                    }

                    this.dialogVisible = true
                }
            },
            uploadUrl() {
                return host('/file/upload');
            },
            isAddressField(str) {
                let index = str.search('address');
                return index !== -1;
            },
            isFileField(str) {
                let index = str.search('file');
                return index !== -1;
            },
            isCommentField(str) {
                let index = str.search('comment');
                return index !== -1;
            },
            isCommentTaskField(str) {
                let index = str.search('commentTask');
                return index !== -1;
            },
            tableRowClassName({row}) {
                switch (row.status){
                    case 'order_wait':
                        return 'order_wait';
                    case 'order_execute':
                        return 'order_execute';
                    case 'order_finish':
                        return 'order_finish';
                    case 'order_refund':
                        return 'order_refund';
                }
            },
            uploadSuccess(type) {
                return (data) => {
                    if ((typeof data) === 'string') {
                        this.dialog[type] = data;
                    }else {
                        this.$message.error(data.msg);
                    }
                };
            },
            beforeUpload(file) {
                const isImage = file.type.search('image/') !== -1;
                const isLt2M = file.size / 1024 / 1024 < 2;
                const isLogin = this.isLogin;
                if (!isImage) {
                    this.$message.error('只能上传图片文件!');
                    return false;
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                    return false;
                }
                if (!isLogin) {
                    this.$message.error('请登录后操作!');
                    return false;
                }
                return isImage && isLt2M && isLogin;
            },
            dialogOpen() {
                this.dialog.price = getProductUserPrice(this.product, this.userRoleType);
                setTimeout(() => {
                    this.$refs.dialog.clearValidate();
                }, 1);
            },
            cancelDialog() {
                this.$refs.dialog.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        this.dialog.productId = this.product.id;
                        let order = await axiosPost('/user/auth/order/add', this.dialog);
                        if (order) {
                            this.tableData.unshift(order);
                            this.$store.commit('orderChangeUserFunds', {funds: order.user.funds, freezeFunds: order.user.freezeFunds});
                            this.dialogVisible = false;
                        }
                    } else {
                        return false;
                    }
                });
            },
            async orderRefund(order) {
                this.$confirm('您确定要申请撤销当前订单吗？', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    let updated = await axiosGet('/user/auth/refund/order/of/' + order.id);
                    if (updated) {
                        order.status = updated.status;
                        order.executeNum = updated.executeNum;
                        order.refundMsg = updated.refundMsg;
                        order.finishTime = updated.finishTime;
                        this.$store.commit('orderChangeUserFunds', {funds: updated.user.funds, freezeFunds: updated.user.freezeFunds});
                    }
                }).catch((e) => {
                    console.log(e);
                });
            }
        },
        computed: {
            userRoleType() {
                return this.$store.state.roleType;
            },
            userFunds() {
                return this.$store.state.funds;
            },
            isLogin() {
                return this.$store.state.userId;
            }
        }
    }
</script>

<style lang="scss">
    .el-table .order_execute {
        background: #F0F9EB;
    }

    .el-table .order_wait {
        background: #FDF5E6;
    }

    .el-table .order_refund {
        background: #FEF0F0;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 80px;
        height: 80px;
        line-height: 80px;
        text-align: center;
    }
    .avatar {
        width: 80px;
        height: 80px;
        display: block;
    }
</style>