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
                          @click.stop.prevent="() => append(node, data)">添加</el-button>
                    <el-button
                          type="danger" plain
                          size="mini"
                          @click.stop.prevent="() => remove(node, data)">删除</el-button>
                </span>
          </span>
        </el-tree>
    </div>
</template>

<script>
    let id = 1000;

    export default {
        name: "platform-right",
        data() {
            return {
                props: {
                    label: 'nameDes',
                    children: 'children',
                    isLeaf: (data, node) => {
                        return !data.hasChild;
                    }
                }
            }
        },

        methods: {
            loadNode(node, resolve) {
                if (!node.data) {
                    console.log('初始化。。。。')
                    /*
                    * 从服务器端加载指定权限数据，如果没有就初始化一个根数据用于添加权限
                    * */
                    return resolve([{nameDes: '#', hasChild: true, children: []}]);
                }else{
                    /*
                    * 从服务器端获取数据，并结合本地数据显示
                    * */
                    console.log(node, '-1111111111111111111111');
                    let local = node.data.children;
                    setTimeout(() => {
                        [
                            {id: 1200, nameDes: '这是服务器加载数据', hasChild: false, children: []},
                            {id: 1202, nameDes: '这是服务器加载数据2', hasChild: false, children: []},
                            {id: 1203, nameDes: '这是服务器加载数据3', hasChild: false, children: []},
                        ].reverse().forEach((val) => {
                            local.unshift(val);
                        });
                        console.log(local, '33333333333333333333333');
                        resolve(local);
                    }, 1000);
                }
            },
            append(node, data) {
                console.log(node, '-------------------');
                console.log(data, '2222222222222222');
                if (node.level > 1 && !data.hasChild) {
                    let pChildren = node.parent.data.children;
                    let index = pChildren.findIndex((val) => {
                        return val.id === data.id;
                    });

                    console.log(index, '==================');

                    data.children.push({id: id++, nameDes: 'test ' + id, hasChild: false, children: []});
                    const newData = {id: data.id, nameDes: data.nameDes, hasChild: true, children: data.children}
                    pChildren.splice(index, 1, newData);
                }else{
                    const newChild = { id: id++, nameDes: 'test ' + id, hasChild:false, children: [] };
                    data.children.push(newChild);
                }
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