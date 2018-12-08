<template>
    <el-row type="flex" justify="center" :gutter="20">
        <el-col>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>账户信息</span>
                    <el-button style="float: right; padding: 3px 0" type="text" v-if="notEdit && canEdit" @click="notEdit = false">编 辑</el-button>
                    <el-button style="float: right; padding: 3px 0" type="text" v-if="!notEdit" @click="save">保 存</el-button>
                </div>
                <el-form ref="form" :model="site" label-width="160px">
                    <el-form-item label="域名">
                        {{site.address}}
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="site.name" :disabled="notEdit"></el-input>
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
                notEdit: true
            };
        },
        methods: {
            async save() {
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