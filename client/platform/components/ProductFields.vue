<template>
    <div style="height: 100%">

        <el-row type="flex" justify="end">
            <el-col style="text-align: right; padding-right: 50px;">
                <el-button type="success" icon="el-icon-circle-plus-outline"
                           @click="dialogVisible = true">添 加</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                height="93%">
            <el-table-column
                    label="创建日期"
                    min-width="180">
                <template slot-scope="scope">
                    <i class="el-icon-time" style="color: #ff2525"></i>
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名 称"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类 型"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    label="上/下架"
                    min-width="80">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.onSale"
                               @change="setOnSale(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="188">
                <template slot-scope="scope">
                    <el-button type="primary" plain icon="el-icon-edit" size="small" @click="edit(scope.row)">编 辑</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="small" @click="remove(scope.row.id)">删 除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialog.name" placeholder="请输入字段名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="dialog.type" placeholder="请输入字段类型(使用驼峰命名)"></el-input>
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
        name: "ProductTypes",
        async created() {
            this.tableData = await axiosGet('/platform/auth/product/fields');
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '60px',
                dialogVisible: false,
                dialogTitle: '添加商品字段',
                dialog: {
                    name: '',
                    type: '',
                    onSale: true
                },
                rules: {
                    name: [
                        {required: true, message: '请输入字段名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                                let oldName;
                                if (this.dialog.field) {
                                    oldName = this.dialog.field.name;
                                }
                                if (!oldName || (oldName && value !== oldName)) {
                                    let type = await axiosGet('/platform/auth/product/field/' + value + '/exist');
                                    if (type) {
                                        callback(new Error('商品类别: ' + value + ' 已经存在！'));
                                    } else {
                                        callback();
                                    }
                                }else{
                                    callback();
                                }
                            }, trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请输入字段类型（使用驼峰命名）!', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            tableRowClassName({row}) {
                return row.onSale ? 'for-sale' : 'not-sale';
            },
            setOnSale(type) {
                axiosPost('/platform/auth/product/field/set/onsale', {id: type.id, onSale: type.onSale});
            },
            cancelDialog() {
                this.dialogTitle = '添加商品字段';
                this.dialog = {
                    name: '',
                    type: '',
                    onSale: true
                };
                this.$refs.dialog.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        let type = await axiosPost('/platform/auth/product/field/add', this.dialog);
                        this.tableData.unshift(type);
                        this.dialogVisible = false;
                    } else {
                        return false;
                    }
                });
            },
            edit(field) {
                this.dialogTitle = '编辑商品字段';
                this.dialog = {
                    id: field.id,
                    name: field.name,
                    type: field.type,
                    onSale: field.onSale,
                    field: field,
                    edit: true
                };
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        axiosPost('/platform/auth/product/field/update', this.dialog)
                            .then(() => {
                                this.dialog.field.name = this.dialog.name;
                                this.dialog.field.type = this.dialog.type;
                                this.dialog.field.onSale = this.dialog.onSale;
                                this.dialogVisible = false;
                            });
                    } else {
                        return false;
                    }
                });
            },
            remove(id) {
                this.$confirm('此操作将永久删除所选商品字段！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/product/field/remove/' + id);
                    this.tableData = this.tableData.filter((val) => {
                        return val.id !== id;
                    });
                }).catch((e) => {
                    console.log(e);
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