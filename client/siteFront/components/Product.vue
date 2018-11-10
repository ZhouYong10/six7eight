<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 66px;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">下 单</el-button>
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
                    <span>{{ scope.row.registerTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="price"
                    label="单价"
                    min-width="80">
            </el-table-column>
            <el-table-column
                    prop="num"
                    label="数量"
                    min-width="50">
            </el-table-column>
            <el-table-column
                    prop="totalPrice"
                    label="总价"
                    min-width="100">
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
                    prop="status"
                    label="状态"
                    min-width="90">
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

        <el-dialog title="添加订单" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="价格" prop="price">
                    <span>{{dialog.price}}</span> ￥
                </el-form-item>
                <el-form-item
                        v-for="item in dialogItems"
                        :label="item.name"
                        :prop="item.type">
                    <el-input v-model="dialog[item.type]" :placeholder="'请输入'+ item.name +'!'"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="num">
                    <el-input v-model="dialog.num" placeholder="请输入下单数量！"></el-input>
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
    import {axiosGet, axiosPost, getProductUserPrice} from "@/utils";
    import {isNum, isInteger} from "@/validaters";

    export default {
        name: "Product",
        props: ['id'],
        async created() {
            this.product = await axiosGet('/user/product/' + this.id);
            console.log(typeof this.userRoleType, '---------------------')
            console.log(this.userRoleType, '---------------------')
            this.dialog.price = getProductUserPrice(this.product, this.userRoleType);
            for(let i = 0; i < this.product.attrs.length; i++){
                let item = this.product.attrs[i];
                this.dialog[item.type] = '';
                this.dialogItems.push({
                    name: item.name,
                    type: item.type
                });
                this.dialogRules[item.type] = [{required: true, message: '请输入' + item.name + '！', trigger: 'blur'}];
            }
        },
        data() {
            return {
                tableData: [],
                product: '',
                dialogVisible: false,
                dialogLabelWidth: '88px',
                dialogItems: [],
                dialog: {
                    price: 0,
                    num: '',
                    totalPrice: 0
                },
                dialogRules: {
                    num: [
                        { required: true, message: '请输入订单数量！', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                if (isInteger(value)) {
                                    let price = this.dialog.price;
                                    this.dialog.totalPrice = parseFloat((price * value).toFixed(4));
                                    if (!this.userFunds) {
                                        callback(new Error('请登录后下单！'));
                                    }else{
                                        if(this.dialog.totalPrice > this.userFunds){
                                            callback(new Error('账户余额不足，请充值！'));
                                        }else{
                                            callback();
                                        }
                                    }
                                }else {
                                    callback(new Error('订单数量必须为正整数！'));
                                }
                            }, trigger: 'change'}
                    ]
                }
            }
        },
        watch: {
            id: async function(val){
                this.product = await axiosGet('/user/product/' + val);
            }
        },
        methods: {
            tableRowClassName({row}) {
                switch (row.state){
                    case '正常':
                        return 'normal-row';
                    case '冻结':
                        return 'freeze-row';
                    default:
                        return 'ban-row';
                }
            },
            cancelDialog() {
                this.$refs.dialog.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let user = await axiosPost('/user/auth/lower/user/save', this.dialog);
                        this.tableData.unshift(user);
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
                console.log(user, '---------------')
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
            }
        }
    }
</script>

<style scoped>

</style>