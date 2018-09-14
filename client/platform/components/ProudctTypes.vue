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
                    label="名称"
                    min-width="160">
            </el-table-column>
            <el-table-column
                    label="状态"
                    min-width="300">
                <template slot-scope="scope">
                    {{ scope.row.onSale ? '上架' : '下架'}}
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

        <el-dialog title="添加商品类别" :visible.sync="dialogVisible" top="6vh" width="30%" @closed="cancelDialog">
            <el-form :model="dialog" :rules="rules" ref="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="dialog.name" auto-complete="off"></el-input>
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
    import {axiosGet, axiosPost, rightFilter} from "@/utils";

    export default {
        name: "ProductTypes",
        async created() {
            this.tableData = await axiosGet('/platform/auth/admin/roles');
        },
        data() {
            return {
                tableData: [],
                dialogLabelWidth: '60px',
                dialogVisible: false,
                dialog: {
                    name: '',
                    onSale: true
                },
                rules: {
                    name: [
                        {required: true, message: '请输入商品类别名称!', trigger: 'blur'},
                        { validator: async (rule, value, callback) => {
                            let type = await axiosGet('/platform/auth/product/type/' + value + '/exist');
                            if (type) {
                                callback(new Error('商品类别: ' + value + ' 已经存在！'));
                            } else {
                                callback();
                            }
                            }, trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            cancelDialog() {
                this.$refs.dialog.resetFields();
            },
            async add() {
                let checkedRight = this.$refs.editRight.getCheckedNodes(true);
                let userRight = rightFilter(JSON.parse(JSON.stringify(this.rights)), checkedRight);
                let roleSaved = await axiosPost('/platform/auth/role/save', {
                    name: this.dialog.name,
                    rights: [userRight, checkedRight]
                });
                this.tableData.unshift(roleSaved);
                this.dialogVisible = false;
            },
            edit(role) {
                this.dialogVisible = true;
                this.dialog.name = role.name;
                this.dialog.id = role.id;
                this.dialog.edit = true;
                this.dialog.role = role;
                if (!this.$refs.editRight) {
                    setTimeout(() => {
                        this.$refs.editRight.setCheckedNodes(role.rights[1] ? role.rights[1] : []);
                    }, 100);
                } else {
                    this.$refs.editRight.setCheckedNodes(role.rights[1] ? role.rights[1] : []);
                }
            },
            async update() {
                let checkedRight = this.$refs.editRight.getCheckedNodes(true);
                let userRight = rightFilter(JSON.parse(JSON.stringify(this.rights)), checkedRight);
                await axiosPost('/platform/auth/role/update', {
                    id: this.dialog.id,
                    name: this.dialog.name,
                    rights: [userRight, checkedRight]
                });
                this.dialog.role.name = this.dialog.name;
                this.dialog.role.rights = [userRight, checkedRight];
                this.dialogVisible = false;
            },
            async remove(id) {
                this.$confirm('此操作将永久删除所选角色！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then(async () => {
                    await axiosGet('/platform/auth/role/remove/' + id);
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

</style>