<template>
    <el-row>
        <el-col :span="24">
            <sf-reminder title="提示">
                <el-row>
                    <el-col :span="12">
                        <span class="tip">方式一【扫码充值】：</span><br>
                        1、通过扫码充值，付款金额为您需要充值的金额。<br>
                        2、付款说明，转账付款时请在备注中填写充值校验码（注意：区分大小写）： <span class="tip" style="font-size: 23px;">{{rechargeCode}}</span><br>
                        3、如付款备注账号错误或未备注充值账号，会导致扫码自动充值失败，此情况请使用方式二充值。<br><br>

                        <span class="tip">方式二【交易号充值】：</span><br>
                        1、请优先使用方式一充值，如方式一充值失败，可提交交易号充值。 <br>
                        2、转账完成后，点击付款页面的“查看详情”，记录下 32 位的交易号。<br>
                        3、输入交易号，稍等 30 秒即可自动入账。<br>
                        4、如果提示交易号仍无法充值，请提交问题反馈。<br>
                        <span class="tip">注意： 此方式交易号当天有效（晚上十二点之前），第二天提交会自动过期。</span>
                    </el-col>
                    <el-col :span="12">
                        <img class="am-radius" src="./recharge_code.png" alt="扫码充值" height="280">
                    </el-col>
                </el-row>
            </sf-reminder>
        </el-col>
        <el-col :span="24">
            <el-form ref="form" :model="form" :rules="formRules" label-width="110px">
                <el-form-item label="支付宝交易号" prop="alipayId">
                    <el-input v-model="form.alipayId"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">立即充值</el-button>
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
        name: "Recharge",
        async created() {
            this.rechargeCode = await axiosGet('/user/auth/recharge/code');
        },
        data() {
            let alipayIdIsNum = async function (rule, value, callback) {
                if (value.length !== 32 || !isNum(value)) {
                    callback(new Error('请输入32位数字支付宝充值交易号！'));
                } else if(value.substr(0, 8) < moment().format('YYYYMMDD')) {
                    callback(new Error('该交易号已经过期！'));
                }else {
                    let recharge = await axiosPost('/user/auth/alipayId/exist', {alipayId: value});
                    if (recharge) {
                        callback(new Error('该交易号已提交，请勿重复提交！'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                rechargeCode: '',
                form: {
                    alipayId: ''
                },
                formRules: {
                    alipayId: [
                        {required: true, message: '请输入支付宝充值交易号！', trigger: 'blur'},
                        {validator: alipayIdIsNum, trigger: 'blur'},
                    ]
                }
            }
        },
        methods:{
            submit() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        axiosPost('/user/auth/recharge/add', this.form)
                            .then((data) => {
                                this.$router.push('/recharge/record');
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