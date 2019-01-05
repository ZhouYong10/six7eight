<template>
    <el-row type="flex" justify="center">
        <el-col :lg="16" :md="20" :sm="24">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>账户信息</span>
                    <el-button style="float: right;" v-if="notEdit && canEdit"
                               type="primary" size="small"
                               @click="siteEdit">编 辑</el-button>
                    <div style="float: right;" v-if="!notEdit">
                        <el-button size="small" @click="cancelEdit">取 消</el-button>
                        <el-button type="primary" size="small" @click="save">保 存</el-button>
                    </div>
                </div>
                <el-form ref="form" :model="site" :rules="siteRules" label-width="160px">
                    <el-form-item label="开站时间">
                        {{site.createTime}}
                    </el-form-item>
                    <el-form-item label="域名">
                        {{site.address}}
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model.trim="site.name" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="开放注册">
                        <el-switch
                                v-model="site.canRegister"
                                inactive-text="关闭注册"
                                active-text="开放注册"
                                :disabled="notEdit">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="代理三级升二级价格">
                        <el-input-number v-model="site.goldUpPrice" :min="0" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="代理二级升一级价格">
                        <el-input-number v-model="site.superUpPrice" :min="0" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="用户升级上级返利比例">
                        <el-input-number v-model="site.upperRatio" :min="0" :max="1" :controls="false" :disabled="notEdit"></el-input-number>
                    </el-form-item>
                    <el-form-item label="电话" prop="phone">
                        <el-input v-model.trim="site.phone" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="微信" prop="weixin">
                        <el-input v-model.trim="site.weixin" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" prop="qq">
                        <el-input v-model.trim="site.qq" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="Email" prop="email">
                        <el-input v-model.trim="site.email" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="SEO关键字">
                        <el-input v-model.trim="site.seoKey" :disabled="notEdit"></el-input>
                    </el-form-item>
                    <el-form-item label="站点描述">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 10}"
                                v-model.trim="site.description"
                                :disabled="notEdit">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="可用资金">
                        {{site.funds}}
                    </el-form-item>
                    <el-form-item label="冻结资金">
                        {{site.freezeFunds}}
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
    </el-row>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "AdminInfo",
        async created() {
            this.site = await axiosGet('/site/auth/site/info');
        },
        data() {
            return {
                site: {},
                oldSite: {},
                notEdit: true,
                siteRules: {
                    name: [
                        { required: true, message: '请输入站点名称！', trigger: 'blur'},
                        { max: 50, message: '长度不能超过50 个字符'},
                        { validator: async (rule, value, callback) => {
                                let oldName = this.oldSite.name;
                                if (value !== oldName) {
                                    let site = await axiosGet('/site/auth/site/' + value + '/exist');
                                    if (site) {
                                        callback(new Error('分站： ' + value + ' 已经存在！'));
                                    }else {
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'}
                    ],
                    phone: [
                        {max: 14, message: '长度不能超过14个字符！', trigger: 'blur'}
                    ],
                    weixin: [
                        {max: 18, message: '长度不能超过18个字符！', trigger: 'blur'}
                    ],
                    qq: [
                        {max: 16, message: '长度不能超过16个字符！', trigger: 'blur'}
                    ],
                    email: [
                        {max: 32, message: '长度不能超过32个字符！', trigger: 'blur'}
                    ]
                },
            };
        },
        methods: {
            siteEdit() {
                this.notEdit = false;
                this.oldSite = JSON.parse(JSON.stringify(this.site));
            },
            async save() {
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        this.notEdit = true;
                        let site = this.site;
                        await axiosPost('/site/auth/site/info/update', {
                            id: site.id,
                            name: site.name,
                            canRegister: site.canRegister,
                            goldUpPrice: site.goldUpPrice,
                            superUpPrice: site.superUpPrice,
                            upperRatio: site.upperRatio,
                            phone: site.phone,
                            weixin: site.weixin,
                            qq: site.qq,
                            email: site.email,
                            seoKey: site.seoKey,
                            description: site.description
                        });
                    } else {
                        return false;
                    }
                });
            },
            cancelEdit() {
                this.notEdit = true;
                this.site = this.oldSite;
                this.$refs.form.resetFields();
            }
        },
        computed: {
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editSettingsSite';
                });
            }
        }
    }
</script>

<style lang="scss">

</style>