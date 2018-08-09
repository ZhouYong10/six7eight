<template>
    <div class="block">
        <p>后台系统页面权限管理，格式：（ 类型 | 名称 | 路径 | 组件名 ）</p>
        <el-tree
                :data="data"
                highlight-current
                :props="props"
                default-expand-all
                node-key="id">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                    <el-button
                          type="primary" plain
                          size="mini"
                          @click.stop.prevent="() => add(data, node)">添加</el-button>
                    <el-button
                             v-bind:disabled="node.level === 1 && data.id === '0'"
                             type="success" plain
                             size="mini"
                             @click.stop.prevent="() => edit(data)">编辑</el-button>
                    <el-button
                            v-bind:disabled="node.level === 1"
                            type="danger" plain
                            size="mini"
                            @click.stop.prevent="() => remove(node, data)">删除</el-button>
                </span>
          </span>
        </el-tree>

        <el-dialog title="权限详情" :visible.sync="dialogVisible" @closed="cancelDialog">
            <el-form :model="dialog" :label-width="dialogLabelWidth">
                <el-form-item label="权限类型">
                    <el-select v-model="dialog.type" placeholder="请选择权限类型" value="">
                        <el-option
                                v-for="item in dialog.types"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="icon图标">
                    <el-input v-model="dialog.icon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限名称">
                    <el-input v-model="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限路径">
                    <el-input v-model="dialog.path" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="组件名称">
                    <el-input v-model="dialog.componentName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button v-if="!dialog.save" type="primary" @click="append">添 加</el-button>
                <el-button v-if="dialog.save" type="primary" @click="editSave">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/utils";

    export default {
        name: "platform-right",
        async created() {
            let res = await axiosGet('/platform/auth/right/show');
            if (res.data.length > 0) {
                this.data = res.data;
            }
        },
        data() {
            return {
                data: [{
                    id: '0',
                    type: '',
                    icon: 'icon',
                    name: '名称',
                    path: '路径',
                    componentName: '组件名',
                    children: []
                }],
                props: {
                    label: (data) => {
                        function typeName(type) {
                            switch (type) {
                                case 'page':
                                    return '页面';
                                case 'menuGroup':
                                    return '菜单组';
                                case 'pageItem':
                                    return '操作项';
                                default:
                                    return '类型'
                            }
                        }
                        const split = ' | ';
                        return typeName(data.type) + split + data.name +
                            (data.path ? split + data.path : (data.componentName ? split + "' '" : '')) +
                            (data.componentName? split + data.componentName : '');
                    }
                },
                dialogVisible: false,
                dialogLabelWidth: '100px',
                dialog: {
                    types: [
                        {value: 'page', label: '页面'},
                        {value: 'menuGroup', label: '菜单组'},
                        {value: 'pageItem', label: '操作项'}
                    ],
                    type: '',
                    icon: '',
                    name: '',
                    path: '',
                    componentName: ''
                }
            }
        },
        methods: {
            cancelDialog() {
                //重置dialog表单数据和状态
                this.dialog = {
                    types: this.dialog.types,
                    type: '',
                    icon: '',
                    name: '',
                    path: '',
                    componentName: '',
                };
                this.dialogVisible = false;
            },
            add(data, node) {
                this.dialogVisible = true;
                this.dialog.data = data;
                this.dialog.node = node;
            },
            async append() {
                let data = this.dialog.data;
                let node = this.dialog.node;
                // 构造新节点
                let newChild = {
                    type: this.dialog.type,
                    icon: this.dialog.icon,
                    name: this.dialog.name,
                    path: this.dialog.path,
                    componentName: this.dialog.componentName,
                    parent: data.id
                };
                // 保存节点
                let res = await axiosPost('/platform/auth/right/save', newChild);
                // 替换节点
                newChild = res.data;
                // 显示节点
                if (node.level === 1 && data.id === '0') {
                    node.data = newChild;
                } else {
                    data.children.push(newChild);
                }
                //重置dialog表单数据和状态
                this.cancelDialog();
            },
            edit(data) {
                this.dialog.type = data.type;
                this.dialog.icon = data.icon;
                this.dialog.name = data.name;
                this.dialog.path = data.path;
                this.dialog.componentName = data.componentName;
                this.dialog.data = data;
                this.dialog.save = true;
                this.dialogVisible = true;
            },
            async editSave() {
                let data = this.dialog.data;
                let res = await axiosPost('/platform/auth/right/update', {
                    id: data.id,
                    type: this.dialog.type,
                    icon: this.dialog.icon,
                    name: this.dialog.name,
                    path: this.dialog.path,
                    componentName: this.dialog.componentName
                });
                let newData = res.data;
                data.type = newData.type;
                data.icon = newData.icon;
                data.name = newData.name;
                data.path = newData.path;
                data.componentName = newData.componentName;

                this.cancelDialog();
            },
            async remove(node, data) {
                this.$confirm('此操作将永久删除所选权限及其子权限信息！', '注意', {
                    confirmButtonText: '确 定',
                    cancelButtonText: '取 消',
                    type: 'warning'
                }).then( async () => {
                    let res = await axiosGet('/platform/auth/right/del/' + data.id);
                    if (res.data) {
                        const parent = node.parent;
                        if (parent.data) {
                            const children = parent.data.children || parent.data;
                            const index = children.findIndex(d => d.id === data.id);
                            children.splice(index, 1);
                        }
                    } else {
                        this.$message.error('删除出错了，请联系开发人员！！！')
                    }
                }).catch(() => {
                    this.$message.success('小心使得万年船！');
                });
            }
        }
    }
</script>

<style lang="scss">
    .el-tree-node{
        padding-top: 8px;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        padding-right: 8px;
    }
</style>