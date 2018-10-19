<template>
    <el-row type="flex" justify="center" :gutter="20">
        <el-col>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>账户信息</span>
                    <el-button style="float: right; padding: 3px 0" type="text" v-if="notEdit" @click="notEdit = false">编 辑</el-button>
                    <el-button style="float: right; padding: 3px 0" type="text" v-if="!notEdit" @click="save">保 存</el-button>
                </div>
                <el-form ref="form" :model="site" label-width="120px">
                    <el-form-item label="域名">
                        <el-input v-model="site.address" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="名称">
                        <el-input v-model="site.name" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="site.phone" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="微信">
                        <el-input v-model="site.weixin" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ">
                        <el-input v-model="site.qq" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="Email">
                        <el-input v-model="site.email" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="SEO关键字">
                        <el-input v-model="site.seoKey" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="站点描述">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows:3, maxRows:10}"
                                placeholder="请输入站点！"
                                v-model="site.description"
                                :disabled="notEdit">
                        </el-input>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
        <el-col>
            <el-card class="box-card">
                <el-form ref="form" :model="site" label-width="120px">
                    <el-form-item label="开站时间">
                        {{site.createTime}}
                    </el-form-item>
                    <el-form-item label="可用资金">
                        {{site.funds}}
                    </el-form-item>
                    <el-form-item label="冻结资金">
                        {{site.freezeFunds}}
                    </el-form-item>
                    <el-form-item label="返利金额">
                        {{site.profit}}
                    </el-form-item>
                    <el-form-item label="当前返利金额">
                        {{site.profitNow}}
                    </el-form-item>
                    <el-form-item label="用户可用总资金">
                        {{site.userFunds}}
                    </el-form-item>
                    <el-form-item label="用户冻结总资金">
                        {{site.userFreezeFunds}}
                    </el-form-item>
                    <el-form-item label="用户/人">
                        {{site.usersNum}}
                    </el-form-item>
                    <el-form-item label="管理员/人">
                        {{site.adminsNum}}
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>

        <el-dialog title="重置密码" :visible.sync="dialogVisible" width="30%" @closed="cancelDialog">
            <el-form :model="form" :rules="formRules" ref="rePassForm" label-width="100px">
                <el-form-item label="原密码" prop="pass">
                    <el-input type="password" v-model="form.pass"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPass">
                    <el-input type="password" v-model="form.newPass"></el-input>
                </el-form-item>
                <el-form-item label="重复新密码" prop="rePass">
                    <el-input type="password" v-model="form.rePass"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="changePass">确 定</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "AdminInfo",
        async created() {
            this.site = await axiosGet('/site/auth/site/info');
            console.log(this.site,'=========================')
        },
        data() {
            return {
                site: {role:{}},
                notEdit: true,
                dialogVisible: false,
                form: {
                    pass: '',
                    newPass: '',
                    rePass: ''
                },
                formRules: {
                    pass: [
                        {required: true, message: '请输入原密码！', trigger: 'blur'},
                        {validator: async (rule, value, callback) =>{
                                if(await axiosPost('/site/auth/compare/pass', {password: value})){
                                    callback();
                                }else{
                                    callback(new Error('原密码错误！'));
                                }
                            }, trigger: 'blur'}
                    ],
                    newPass: [
                        {required: true, message: '请输入新密码！', trigger: 'blur'},
                        {validator: (rule, value, callback) =>{
                                if(value === this.form.pass){
                                    callback(new Error('新密码不能和原密码相同！'));
                                }
                                callback();
                            }, trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (this.form.rePass !== '') {
                                    this.$refs.rePassForm.validateField('rePass');
                                }
                                callback();
                            }, trigger: 'change'}
                    ],
                    rePass: [
                        {required: true, message: '请重复新密码！', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (value !== this.form.newPass) {
                                    callback(new Error('两次输入的密码不一致！'));
                                }
                                callback();
                            }, trigger: 'change'}
                    ]
                }
            };
        },
        methods: {
            async save() {
                this.notEdit = true;
                await axiosPost('/site/auth/site/update', {
                    id: this.site.id,
                    username: this.site.username,
                    phone: this.site.phone,
                    weixin: this.site.weixin,
                    qq: this.site.qq,
                    email: this.site.email
                });
                this.$store.commit('updateUsername', this.site.username);
            },
            cancelDialog() {
                this.$refs.rePassForm.resetFields();
            },
            changePass() {
                this.$refs.rePassForm.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/site/auth/change/pass', {pass: this.form.newPass});
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            userId() {
                return this.$store.state.info.site.id;
            }
        }
    }
</script>

<style lang="scss">

</style>