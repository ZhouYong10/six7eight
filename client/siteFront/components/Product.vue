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
                    width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
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
                        <el-button slot="reference">表单内容</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="单价"
                    min-width="60">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="totalPrice"
                    label="总价"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    prop="startNum"
                    label="初始量"
                    min-width="70">
            </el-table-column>
            <el-table-column
                    prop="progress"
                    label="进度"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="90">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 'order_wait'">待执行</span>
                    <span v-if="scope.row.status === 'order_execute'">执行中</span>
                    <span v-if="scope.row.status === 'order_finish'">已完成</span>
                    <span v-if="scope.row.status === 'order_refund'">已退款</span>
                </template>
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="editUser(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="delUser(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                top="3vh"
                width="30%"
                :title="'添加订单/' + product.name"
                :visible.sync="dialogVisible"
                @open="dialogOpen"
                @closed="cancelDialog">
            <sf-reminder title="提示">
                <span v-for="val in orderTip.split('\n')">
                    {{ val }}<br/>
                </span>
            </sf-reminder>
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="价格" prop="price">
                    <span>{{dialog.price}}</span> ￥
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
                    <el-input v-else v-model="dialog.num" placeholder="请输入下单数量！"></el-input>
                </el-form-item>
                <el-form-item label="总价" prop="totalPrice">
                    <span>{{dialog.totalPrice}}</span> ￥
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
    import {axiosGet, axiosPost, getProductUserPrice, host} from "@/utils";
    import {isInteger, isUrl} from "@/validaters";
    import Vue from "vue";

    export default {
        name: "Product",
        props: ['id'],
        async created() {
            this.getTableData(this.id);
        },
        watch: {
            id: function(val){
                this.getTableData(val);
            }
        },
        data() {
            return {
                tableData: [],
                product: '',
                orderTip: '',
                dialogVisible: false,
                dialogLabelWidth: '88px',
                dialogItems: [],
                dialog: {
                    price: 0,
                    num: '',
                    totalPrice: 0
                },
                dialogRules: {}
            }
        },
        methods: {
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
                        num: '',
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
                                {required: true, message: '请输入' + item.name + '！', trigger: 'blur'},
                                {
                                    validator: async (rule, value, callback) => {
                                        if (isUrl(value)) {
                                            callback();
                                        }else {
                                            callback(new Error('请输入正确的订单地址！'));
                                        }
                                    }, trigger: 'blur'
                                }
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
                                    if (isInteger(value)) {
                                        let price = this.dialog.price;
                                        this.dialog.totalPrice = parseFloat((price * value).toFixed(4));
                                        if (parseInt(value) < product.minNum) {
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
                                    } else {
                                        callback(new Error('订单数量必须为正整数！'));
                                    }
                                }, trigger: 'change'
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
                        this.tableData.unshift(order);
                        this.$store.commit('orderChangeUserFunds', {funds: order.user.funds, freezeFunds: order.user.freezeFunds});
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
        },
        computed: {
            userRoleType() {
                let user = this.$store.state.user;
                if (user) {
                    return user.role.type;
                } else {
                    return undefined;
                }
            },
            userFunds() {
                let user = this.$store.state.user;
                if (user) {
                    return user.funds;
                }else{
                    return null;
                }
            },
            isLogin() {
                return this.$store.state.user;
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