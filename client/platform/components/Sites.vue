<template>
    <div style="height: 100%">
        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 66px;">
                <el-button v-if="canAdd" type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="建站日期"
                    min-width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="名称"
                    min-width="180">
                <template slot-scope="scope">
                    <el-popover
                            placement="right"
                            width="300"
                            trigger="click">
                        <p class="site-desc">名称: {{ scope.row.name }}</p>
                        <p class="site-desc">域名: {{ scope.row.address }}</p>
                        <p class="site-desc">电话: {{ scope.row.phone }}</p>
                        <p class="site-desc">微信: {{ scope.row.weixin }}</p>
                        <p class="site-desc">qq: {{ scope.row.qq }}</p>
                        <p class="site-desc">email: {{ scope.row.email }}</p>
                        <p class="site-desc">SEO关键字: {{ scope.row.seoKey }}</p>
                        <p class="site-desc">描述: {{ scope.row.description }}</p>
                        <el-button slot="reference">{{scope.row.name}}</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                    label="用户可用资金"
                    prop="userFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="用户冻结资金"
                    prop="userFreezeFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点可用资金"
                    prop="funds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点冻结资金"
                    prop="freezeFunds"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    label="站点返利"
                    prop="profit"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="168">
                <template slot-scope="scope">
                    <el-button v-if="canEdit" type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="添加分站" :visible.sync="dialogVisible" top="3vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="dialogRules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="管理员名" prop="username">
                    <el-input v-model="dialog.username"></el-input>
                </el-form-item>
                <el-form-item label="站点名" prop="name">
                    <el-input v-model="dialog.name"></el-input>
                </el-form-item>
                <el-form-item label="域名" prop="address">
                    <el-input v-model="dialog.address"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="dialog.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model="dialog.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model="dialog.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="dialog.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="add">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑分站" :visible.sync="dialogEditVisible" top="3vh" width="30%" @closed="cancelDialogEdit">
            <el-form :model="dialogEdit" :rules="dialogEditRules" ref="dialogEdit" :label-width="dialogLabelWidth">
                <el-form-item label="站点名" prop="name">
                    <el-input v-model="dialogEdit.name"></el-input>
                </el-form-item>
                <el-form-item label="域名" prop="address">
                    <el-input v-model="dialogEdit.address"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone">
                    <el-input v-model="dialogEdit.phone"></el-input>
                </el-form-item>
                <el-form-item label="微信" prop="weixin">
                    <el-input v-model="dialogEdit.weixin"></el-input>
                </el-form-item>
                <el-form-item label="QQ" prop="qq">
                    <el-input v-model="dialogEdit.qq"></el-input>
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="dialogEdit.email"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogEditVisible = false">取 消</el-button>
                <el-button type="primary" size="small" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "Sites",
        async created() {
            this.tableData = await axiosGet('/platform/auth/sites');
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '100px',
                dialogVisible: false,
                dialog: {
                    username: '',
                    name: '',
                    address: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogRules: {
                    username: [
                        { required: true, message: '请输入站点管理员账户名！'},
                        { max: 20, message: '长度不能超过20个字符！'},
                        {validator: async (rule, value, callback) => {
                                let admin = await axiosGet('/platform/auth/site/admin/' + value + '/exist');
                                if (admin) {
                                    callback(new Error('账户名： ' + value + ' 已经存在！'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    name: [
                        { required: true, message: '请输入站点名称！'},
                        { max: 16, message: '长度不能超过16个字符！'},
                        {validator: async (rule, value, callback) => {
                                let site = await axiosGet('/platform/auth/site/' + value + '/exist');
                                if (site) {
                                    callback(new Error('分站： ' + value + ' 已经存在！'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    address: [
                        { required: true, message: '请输入站点域名！'},
                        {validator: async (rule, value, callback) => {
                                let site = await axiosPost('/platform/auth/site/address/exist', {address: value});
                                if (site) {
                                    callback(new Error('分站域名： ' + value + ' 已经存在！'));
                                }else {
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ]
                },
                dialogEditVisible: false,
                dialogEdit: {
                    name: '',
                    address: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                },
                dialogEditRules: {
                    name: [
                        { required: true, message: '请输入站点名称！'},
                        { max: 16, message: '长度不能超过16个字符！'},
                        {validator: async (rule, value, callback) => {
                            let oldName = this.dialogEdit.site.name;
                                if (value !== oldName) {
                                    let site = await axiosGet('/platform/auth/site/' + value + '/exist');
                                    if (site) {
                                        callback(new Error('分站： ' + value + ' 已经存在！'));
                                    }else {
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'}
                    ],
                    address: [
                        { required: true, message: '请输入站点域名！'},
                        {validator: async (rule, value, callback) => {
                                let oldAddress = this.dialogEdit.site.address;
                                if (value !== oldAddress) {
                                    let site = await axiosPost('/platform/auth/site/address/exist', {address: value});
                                    if (site) {
                                        callback(new Error('分站域名： ' + value + ' 已经存在！'));
                                    }else {
                                        callback();
                                    }
                                }
                            }, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            cancelDialog() {
                this.dialog = {
                    username: '',
                    name: '',
                    address: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                };
                this.$refs.dialog.resetFields();
            },
            cancelDialogEdit() {
                this.dialogEdit = {
                    name: '',
                    address: '',
                    phone: '',
                    weixin: '',
                    qq: '',
                    email: ''
                };
                this.$refs.dialogEdit.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let site = await axiosPost('/platform/auth/site/add', this.dialog);
                        this.tableData.unshift(site);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(site) {
                this.dialogEdit = {
                    id: site.id,
                    name: site.name,
                    address: site.address,
                    phone: site.phone,
                    weixin: site.weixin,
                    qq: site.qq,
                    email: site.email,
                    site: site
                };
                this.dialogEditVisible = true;
            },
            update() {
                this.$refs.dialogEdit.validate(async (valid) => {
                    if (valid) {
                        let info = this.dialogEdit;
                        axiosPost('/platform/auth/site/update', {
                            id: info.id,
                            name: info.name,
                            address: info.address,
                            phone: info.phone,
                            weixin: info.weixin,
                            qq: info.qq,
                            email: info.email
                        }).then(() => {
                            let site = this.dialogEdit.site;
                            site.name = info.name;
                            site.address = info.address;
                            site.phone = info.phone;
                            site.weixin = info.weixin;
                            site.qq = info.qq;
                            site.email = info.email;
                            this.dialogEditVisible = false;
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        computed: {
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addSitePlatform';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editSitePlatform';
                });
            },
        }
    }
</script>

<style lang="scss">


</style>