<template>
    <el-row>
        <el-col :span="24">
            <sf-reminder title="提示">
                1、提现金额不能小于10元。<br>
                2、平台用户提现支付宝必须和充值支付宝一致，否则平台不受理（投手提现不受此限制）。<br>
                3、提现支付宝昵称请填实名（个别支付宝用户需要实名验证，敬请谅解），否则支付宝无法转账。<br>
                <span class="tip">注: 提现将在1至2个工作日内到账。</span>
            </sf-reminder>
        </el-col>
        <el-col :span="24">
            <el-form ref="form" :model="form" :rules="formRules" label-width="110px">
                <el-form-item label="支付宝账户" prop="alipayCount">
                    <el-input v-model="form.alipayCount" placeholder="请务必核对准确"></el-input>
                </el-form-item>
                <el-form-item label="支付宝实名" prop="alipayName">
                    <el-input v-model="form.alipayName" placeholder="请务必核对准确"></el-input>
                </el-form-item>
                <el-form-item label="提现金额" prop="funds">
                    <el-input v-model="form.funds" placeholder="最少10元起提"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="reset">重置</el-button>
                    <el-button type="primary" @click="submit">确认提现</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";
    import {isNum} from "@/validaters";
    import * as moment from "moment";

    export default {
        name: "Withdraw",
        data() {
            return {
                userFunds: '',
                form: {
                    alipayCount: '',
                    alipayName: '',
                    funds: ''
                },
                formRules: {
                    alipayCount: [
                        {required: true, message: '请输入支付宝账户！', trigger: 'blur'}
                    ],
                    alipayName: [
                        {required: true, message: '请输入支付宝账户实名！', trigger: 'blur'}
                    ],
                    funds: [
                        {required: true, message: '请输入提现金额！', trigger: 'blur'},
                        {validator: async (rule, value, callback) => {
                                if (!isNum(value)) {
                                    callback(new Error('提现金额必须为数字！'));
                                }else if (parseFloat(value) < 10) {
                                    callback(new Error('最少10元起提！'))
                                }else {
                                    if (!this.userFunds) {
                                        this.userFunds = await axiosGet('/user/auth/user/funds');
                                    }
                                    if (parseFloat(value) > parseFloat(this.userFunds)) {
                                        callback(new Error('账户可提现金额不足，当前可提现金额为：' + this.userFunds + '元！'));
                                    } else {
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'},
                    ],
                }
            }
        },
        methods:{
            reset() {
                this.$refs.form.resetFields();
            },
            submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        axiosPost('/user/auth/withdraw/add', this.form)
                            .then((data) => {
                                this.$router.push('/withdraw/record');
                            });
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    .reminder .tip{
        color: red;
    }
</style>