<template>
    <div style="height: 100%">
        <el-button v-if="canAdd"
                   size="small" type="success" icon="el-icon-circle-plus-outline"
                   @click="dialogVisible = true">添 加</el-button>

        <el-table
                :data="tableData"
                height="93%">
            <el-table-column
                    label="创建日期"
                    min-width="155">
                <template slot-scope="scope">
                    <span>{{ scope.row.createTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="名 称"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类 型"
                    min-width="110">
            </el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button-group>
                        <el-button v-if="canEdit"
                                   type="primary" size="small"
                                   @click="edit(scope.row)">编 辑</el-button>
                        <el-button v-if="canDel"
                                   type="danger" size="small"
                                   @click="remove(scope.row.id)">删 除</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog class="addEditDialog" :title="dialogTitle" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <sf-reminder title="提示">
                1. 图片类型字段， 类型中需包含 ‘file’ 字符串；<br/>
                2. 地址类型字段， 类型中需包含 ‘address’ 字符串；<br/>
                3. 评论类型字段， 类型中需包含 ‘comment’ 字符串；<br/>
                4. 评论商品的评论类型字段， 类型中需包含 ‘commentTask’ 字符串；
            </sf-reminder>
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dialog.name" placeholder="请输入字段名称"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model.trim="dialog.type" placeholder="请输入字段类型(使用驼峰命名)"></el-input>
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
        sockets: {
            addField(field) {
                this.tableData.unshift(field);
            },
            updateField(field) {
                let fields = this.tableData;
                let index = fields.findIndex((item) => {
                    return item.id === field.id;
                });
                let aim = fields[index];
                aim.name = field.name;
                aim.type = field.type;
            }
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '60px',
                dialogVisible: false,
                dialogTitle: '添加商品字段',
                dialog: {
                    name: '',
                    type: ''
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
            cancelDialog() {
                this.dialogTitle = '添加商品字段';
                this.dialog = {
                    name: '',
                    type: ''
                };
                this.$refs.dialog.resetFields();
            },
            add() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            await axiosPost('/platform/auth/product/field/add', this.dialog);
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
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
                    field: field,
                    edit: true
                };
                this.dialogVisible = true;
            },
            update() {
                this.$refs.dialog.validate(async (valid) => {
                    if (valid) {
                        if (!this.dialog.isCommitted) {
                            this.dialog.isCommitted = true;
                            await axiosPost('/platform/auth/product/field/update', {
                                id: this.dialog.id,
                                name: this.dialog.name,
                                type: this.dialog.type
                            });
                            this.dialogVisible = false;
                        }else{
                            this.$message.error('数据已经提交了,请勿重复提交!');
                        }
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
        },
        computed: {
            canAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addProductFieldPlatform';
                });
            },
            canEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editProductFieldPlatform';
                });
            },
            canDel() {
                return this.$store.state.permissions.some(item => {
                    return item === 'deleteProductFieldPlatform';
                });
            }
        }
    }
</script>

<style lang="scss">
    .addEditDialog .el-dialog__body{
        padding: 0px 16px;
    }
</style>