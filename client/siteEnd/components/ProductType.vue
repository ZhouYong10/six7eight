<template>
    <div style="height: 100%">
        <el-button v-if="canAdd"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="创建日期"
                    width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名称"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="createUser"
                    label="创建账户"
                    min-width="90">
            </el-table-column>
            <el-table-column
                    label="上/下架"
                    min-width="120">
                <template slot-scope="scope">
                    <el-switch v-if="scope.row.type === 'type_site' && canOnSale"
                               v-model="scope.row.onSale"
                               @change="setOnSale(scope.row)">
                    </el-switch>
                    <span v-else>{{ scope.row.onSale ? '已上架' : '已下架'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <div v-if="scope.row.type === 'type_site' && canEdit">
                        <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" >
                    <el-switch
                            v-model="dialog.onSale"
                            active-text="上架"
                            inactive-text="下架">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button v-if="!dialog.edit" type="primary" @click="add">确 定</el-button>
                <el-button v-if="dialog.edit" type="primary" @click="update">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "ProductType",
        async created() {
            this.tableData = await axiosGet('/site/auth/product/types');
            this.$options.sockets[this.roleId + 'addType'] = (type) =>{
                this.tableData.unshift(type);
            };
            this.$options.sockets[this.siteId + 'updateType'] = (type) => {
                let types = this.tableData;
                let index = types.findIndex((item) => {
                    return item.id === type.id;
                });
                let aim = types[index];
                aim.name = type.name;
                aim.onSale = type.onSale;
            };
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '60px',
                dialogVisible: false,
                dialogTitle: '添加商品类别',
                dialog: {
                    name: '',
                    onSale: true
                },
                rules: {
                    name: [
                        {required: true, message: '请输入商品类别名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                let oldName;
                                if (this.dialog.type) {
                                    oldName = this.dialog.type.name;
                                }
                                if (value !== oldName) {
                                    let type = await axiosGet('/site/auth/product/type/' + value + '/exist');
                                    if (type) {
                                        callback(new Error('商品类别: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.onSale ? 'for-sale' : 'not-sale';
            },
            cancelDialog() {
                this.dialogTitle = "添加商品类别";
                this.dialog = {
                    name: '',
                    onSale: true
                };
                this.$refs.dialog.resetFields();
            },
            setOnSale(type) {
                axiosPost('/site/auth/product/type/set/onsale', {id: type.id, onSale: type.onSale});
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/site/auth/product/type/add', {
                            name: this.dialog.name,
                            onSale: this.dialog.onSale
                        });
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(type) {
                this.dialogTitle = '编辑商品类别';
                this.dialog = {
                    id: type.id,
                    name: type.name,
                    onSale: type.onSale,
                    type: type,
                    edit: true
                };
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        await axiosPost('/site/auth/product/type/update', {
                            id: this.dialog.id,
                            name: this.dialog.name,
                            onSale: this.dialog.onSale
                        });
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            }
        },
        computed:{
            siteId() {
                return this.$store.state.siteId;
            },
            roleId() {
                return this.$store.state.roleId;
            },
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addProductTypeSite';
                });
            },
            canOnSale() {
                return this.$store.state.permissions.some(item => {
                    return item === 'onSaleProductTypeSite';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editProductTypeSite';
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-table .for-sale {
        background: #F0F9EB;
    }

    .el-table .not-sale {
        background: #FEF0F0;
    }
</style>