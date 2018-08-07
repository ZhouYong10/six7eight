<template>
    <div class="block">
        <p>使用 scoped slot</p>
        <el-tree
                highlight-current
                :props="props"
                lazy
                :load="loadNode"
                node-key="id">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span>
                    <el-button
                          type="primary" plain
                          size="mini"
                          @click.stop.prevent="() => add(node, data)">添加</el-button>
                     <el-button
                             type="success" plain
                             size="mini"
                             @click.stop.prevent="() => edit(node, data)">编辑</el-button>
                    <el-button
                          type="danger" plain
                          size="mini"
                          @click.stop.prevent="() => remove(node, data)">删除</el-button>
                </span>
          </span>
        </el-tree>

        <el-dialog title="权限详情" :visible.sync="dialogVisible">
            <el-form :model="dialog">
                <el-form-item label="权限名称" :label-width="formLabelWidth">
                    <el-input v-model="dialog.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限路径" :label-width="formLabelWidth">
                    <el-input v-model="dialog.path" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="组件名称" :label-width="formLabelWidth">
                    <el-input v-model="dialog.componentName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="hasChild" :label-width="formLabelWidth">
                    <el-switch v-model="dialog.hasChild">
                    </el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="append">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    let id = 1000;

    export default {
        name: "platform-right",
        data() {
            return {
                props: {
                    label: (data) => {
                        return data.name + ' ' + data.path + ' ' + data.componentName;
                    },
                    children: 'children',
                    isLeaf: (data, node) => {
                        return !data.hasChild;
                    }
                },
                dialogVisible: false,
                dialog: {
                    name: '',
                    path: '',
                    componentName: '',
                    hasChild: false,
                },
                formLabelWidth: '100px'
            }
        },

        methods: {
            loadNode(node, resolve) {
                if (!node.data) {
                    console.log('初始化。。。。')
                    /*
                    * 从服务器端加载指定权限数据，如果没有就初始化一个根数据用于添加权限
                    * */
                    return resolve([{id: '0', name: '#', path: '', componentName: '', hasChild: true, children: []}]);
                }else{
                    /*
                    * 从服务器端获取数据，并结合本地数据显示
                    * */
                    console.log(node, '-1111111111111111111111');
                    let local = node.data.children;
                    setTimeout(() => {
                        [
                            {id: '1200', name: '服务器加载数据', path: 'path', componentName: 'conponentName', hasChild: false, children: []},
                            {id: '1202', name: '服务器加载数据2',path: 'path2', componentName: 'conponentName2',  hasChild: false, children: []},
                            {id: '1203', name: '服务器加载数据3',path: 'path3', componentName: 'conponentName3',  hasChild: false, children: []},
                        ].reverse().forEach((val) => {
                            local.unshift(val);
                        });
                        console.log(local, '33333333333333333333333');
                        resolve(local);
                    }, 1000);
                }
            },
            cancelDialog() {
                //重置dialog表单数据和状态
                this.dialog = {
                    name: '',
                    path: '',
                    componentName: '',
                    hasChild: false,
                };
                this.dialogVisible = false;
            },
            add(node, data) {
                this.dialogVisible = true;
                this.dialog.node = node;
                this.dialog.data = data;
            },
            append() {
                let node = this.dialog.node;
                let data = this.dialog.data;
                let newChild = {
                    name: this.dialog.name,
                    path: this.dialog.path,
                    componentName: this.dialog.componentName,
                    hasChile: this.dialog.hasChild
                };
                if (newChild.hasChild) {
                    newChild.children = [];
                }

                if (node.level > 1 && !data.hasChild) {
                    // 给标记为叶子节点的节点添加叶子节点
                    let pChildren = node.parent.data.children;
                    let index = pChildren.findIndex((val) => {
                        return val.id === data.id;
                    });
                    this.$set(data, 'children', []);
                    data.children.push(newChild);
                    //重置叶子节点为非叶子节点
                    const newData = {
                        id: data.id,
                        name: data.name,
                        path: data.path,
                        componentName: data.componentName,
                        hasChild: true,
                        children: data.children
                    };
                    pChildren.splice(index, 1, newData);
                }else{
                    data.children.push(newChild);
                }
                //重置dialog表单数据和状态
                this.cancelDialog();
            },
            edit(node, data) {
                console.log(data, '这是编辑');
            },
            remove(node, data) {
                console.log(node,'delete 1111111111111111111111')
                console.log(data,'delete 2222222222222222222222222')
                const parent = node.parent;
                if (parent.data) {
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                }
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