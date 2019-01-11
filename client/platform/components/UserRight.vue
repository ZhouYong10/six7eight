<template>
    <div class="block">
        <div>
            <el-button v-if="canMenuGroup"
                       size="small" type="primary" icon="el-icon-plus"
                       @click="dMenuGroupV = true">菜单组</el-button>
            <el-button v-if="canMenu"
                       size="small" type="success" icon="el-icon-plus"
                       @click="dMenuV = true">菜单项</el-button>
        </div>
        <el-tree
                :data="treeData"
                highlight-current
                :props="props"
                default-expand-all
                node-key="id"
                draggable
                :allow-drag="allowDrag"
                :allow-drop="allowDrop"
                @node-drop="nodeDropEdit">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span><i v-if="data.icon" :class="data.icon"> &nbsp; </i>{{ data.name }}</span>
                <span>
                    <el-button v-if="data.type !== 'menuItem' && canTreeAdd"
                               type="primary" plain
                               size="mini"
                               @click.stop.prevent="() => data.type === 'menuGroup' ? openDMenu(data) : openDMenuItem(data)">添加</el-button>
                    <el-button
                            v-if="canTreeEdit"
                            type="success" plain
                            size="mini"
                            @click.stop.prevent="() => {
                             if(data.type === 'menuGroup') editMenuGroup(data);
                             if(data.type === 'menu') editMenu(data);
                             if(data.type === 'menuItem') editMenuItem(data);
                             }">编辑</el-button>
                </span>
          </span>
        </el-tree>

        <el-dialog :title="dMenuGroupT" :visible.sync="dMenuGroupV" @closed="dMenuGroupC">
            <el-form :model="dMenuGroup" ref="dMenuGroup" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dMenuGroup.name"></el-input>
                </el-form-item>
                <el-form-item label="icon图标" prop="icon">
                    <el-input v-model.trim="dMenuGroup.icon"></el-input>
                </el-form-item>
                <el-form-item label="权限指纹" prop="fingerprint">
                    <el-input v-model.trim="dMenuGroup.fingerprint"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dMenuGroupV = false">取 消</el-button>
                <el-button v-if="!dMenuGroup.edit" type="primary" @click="addMenuGroup">添 加</el-button>
                <el-button v-if="dMenuGroup.edit" type="primary" @click="saveMenuGroup">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="dMenuT" :visible.sync="dMenuV" @closed="dMenuC">
            <el-form :model="dMenu" ref="dMenu" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dMenu.name"></el-input>
                </el-form-item>
                <el-form-item label="icon图标" prop="icon">
                    <el-input v-model.trim="dMenu.icon"></el-input>
                </el-form-item>
                <el-form-item label="路由" prop="path">
                    <el-input v-model.trim="dMenu.path"></el-input>
                </el-form-item>
                <el-form-item label="权限指纹" prop="fingerprint">
                    <el-input v-model.trim="dMenu.fingerprint"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dMenuV = false">取 消</el-button>
                <el-button v-if="!dMenu.edit" type="primary" @click="addMenu">添 加</el-button>
                <el-button v-if="dMenu.edit" type="primary" @click="saveMenu">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="dMenuItemT" :visible.sync="dMenuItemV" @closed="dMenuItemC">
            <el-form :model="dMenuItem" ref="dMenuItem" :label-width="dialogLabelWidth">
                <el-form-item label="名称" prop="name">
                    <el-input v-model.trim="dMenuItem.name"></el-input>
                </el-form-item>
                <el-form-item label="权限指纹" prop="fingerprint">
                    <el-input v-model.trim="dMenuItem.fingerprint"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dMenuItemV = false">取 消</el-button>
                <el-button v-if="!dMenuItem.edit" type="primary" @click="addMenuItem">添 加</el-button>
                <el-button v-if="dMenuItem.edit" type="primary" @click="saveMenuItem">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";

    async function loadTreeData() {
        return await axiosGet('/platform/auth/user/right/show');
    }

    async function addRight(right) {
        return await axiosPost('/platform/auth/user/right/save', right);
    }
    async function updateRight(right) {
        await axiosPost('/platform/auth/user/right/update', right);
    }

    export default {
        name: "platform-right",
        async created() {
            this.treeData = await loadTreeData();
        },
        data() {
            return {
                treeData: [],
                props: {
                    label: 'name'
                },
                dialogLabelWidth: '80px',

                dMenuGroupT: '添加菜单组',
                dMenuGroupV: false,
                dMenuGroup: {
                    name: '',
                    icon: '',
                    fingerprint: ''
                },

                dMenuT: '添加菜单项',
                dMenuV: false,
                dMenu: {
                    name: '',
                    icon: '',
                    path: '',
                    fingerprint: ''
                },

                dMenuItemT: '添加功能项',
                dMenuItemV: false,
                dMenuItem: {
                    name: '',
                    fingerprint: ''
                },
            }
        },
        methods: {
            dMenuGroupC() {
                this.dMenuGroupT = '添加菜单组';
                this.dMenuGroup = {
                    name: '',
                    icon: '',
                    fingerprint: ''
                };
                this.$refs.dMenuGroup.resetFields();
            },
            dMenuC() {
                this.dMenuT = '添加菜单项';
                this.dMenu = {
                    name: '',
                    icon: '',
                    path: '',
                    fingerprint: ''
                };
                this.$refs.dMenu.resetFields();
            },
            dMenuItemC() {
                this.dMenuItemT = '添加功能项';
                this.dMenuItem = {
                    name: '',
                    fingerprint: ''
                };
                this.$refs.dMenuItem.resetFields();
            },

            async addMenuGroup() {
                let info = this.dMenuGroup;
                let menuGroup = {
                    type: 'menuGroup',
                    name: info.name,
                    icon: info.icon,
                    fingerprint: info.fingerprint,
                    path: '',
                    parentId: null
                };
                menuGroup = await addRight(menuGroup);
                this.treeData.push(menuGroup);
                this.dMenuGroupV = false;
            },
            editMenuGroup(right) {
                this.dMenuGroupT = `修改菜单组 ${right.name} 信息`;
                this.dMenuGroup = {
                    name: right.name,
                    icon: right.icon,
                    fingerprint: right.fingerprint,
                    edit: true,
                    oldRight: right
                };
                this.dMenuGroupV = true;
            },
            async saveMenuGroup() {
                let info = this.dMenuGroup;
                let oldRight = info.oldRight;
                await updateRight({
                    id: oldRight.id,
                    name: info.name,
                    icon: info.icon,
                    fingerprint: info.fingerprint,
                    path: ''
                });
                oldRight.name = info.name;
                oldRight.icon = info.icon;
                oldRight.fingerprint = info.fingerprint;
                this.dMenuGroupV = false;
            },

            async addMenu() {
                let info = this.dMenu;
                let parent = info.parent;
                let menu = {
                    type: 'menu',
                    name: info.name,
                    icon: info.icon,
                    fingerprint: info.fingerprint,
                    path: info.path,
                    parentId: parent ? parent.id : null
                };
                menu = await addRight(menu);
                if (parent) {
                    parent.children.push(menu);
                } else {
                    this.treeData.push(menu);
                }
                this.dMenuV = false;
            },
            openDMenu(parent) {
                this.dMenuV = true;
                this.dMenu.parent = parent;
            },
            editMenu(right) {
                this.dMenuT = `修改菜单项 ${right.name} 信息`;
                this.dMenu = {
                    name: right.name,
                    icon: right.icon,
                    path: right.path,
                    fingerprint: right.fingerprint,
                    edit: true,
                    oldRight: right
                };
                this.dMenuV = true;
            },
            async saveMenu() {
                let info = this.dMenu;
                let oldRight = info.oldRight;
                await updateRight({
                    id: oldRight.id,
                    name: info.name,
                    icon: info.icon,
                    fingerprint: info.fingerprint,
                    path: info.path
                });
                oldRight.name = info.name;
                oldRight.icon = info.icon;
                oldRight.fingerprint = info.fingerprint;
                oldRight.path = info.path;
                this.dMenuV = false;
            },

            async addMenuItem() {
                let info = this.dMenuItem;
                let parent = info.parent;
                let menuItem = {
                    type: 'menuItem',
                    name: info.name,
                    icon: '',
                    fingerprint: info.fingerprint,
                    path: '',
                    parentId: parent.id
                };
                menuItem = await addRight(menuItem);
                parent.children.push(menuItem);
                this.dMenuItemV = false;
            },
            openDMenuItem(parent) {
                this.dMenuItemV = true;
                this.dMenuItem.parent = parent;
            },
            editMenuItem(right) {
                this.dMenuItemT = `修改功能项 ${right.name} 信息`;
                this.dMenuItem = {
                    name: right.name,
                    fingerprint: right.fingerprint,
                    edit: true,
                    oldRight: right
                };
                this.dMenuItemV = true;
            },
            async saveMenuItem() {
                let info = this.dMenuItem;
                let oldRight = info.oldRight;
                await updateRight({
                    id: oldRight.id,
                    name: info.name,
                    icon: '',
                    fingerprint: info.fingerprint,
                    path: ''
                });
                oldRight.name = info.name;
                oldRight.fingerprint = info.fingerprint;
                this.dMenuItemV = false;
            },

            allowDrop(dragNode, dropNode, location) {
                if (dragNode.data.type === 'menuGroup' && dropNode.data.pId !== '0') {
                    return false;
                }
                if (dragNode.data.type === 'menu' && dropNode.data.type === 'menuItem') {
                    return false;
                }
                if (location === 'inner') {
                    if (dragNode.data.type === 'menuGroup') {
                        return false;
                    }
                    if (dragNode.data.type === 'menu' && dropNode.data.type !== 'menuGroup') {
                        return false;
                    }
                }
                return true;
            },
            async nodeDropEdit(dragNode, dropNode, location, event) {
                let dragData = dragNode.data;
                let dropData = dropNode.data;
                let change = {
                    rightDrag: {id: dragData.id, num: dropData.num, parentId: dropData.pId},
                    rightDrop: {id: dropData.id, num: dragData.num}
                };
                if (location === 'inner') {
                    change = {
                        rightDrag: {id: dragData.id, num: dragData.num, parentId: dropData.id},
                        rightDrop: {id: dropData.id, num: dropData.num}
                    };
                }
                await axiosPost('/platform/auth/user/right/change/sort', change);
                this.treeData = await loadTreeData();
            },
            allowDrag(node) {
                return node.data.type !== 'menuItem';
            }
        },
        computed: {
            canMenuGroup() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addMenuGroupRightUser';
                });
            },
            canMenu() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addMenuRightUser';
                });
            },
            canTreeAdd() {
                return this.$store.state.permissions.some(item => {
                    return item === 'addTreeRightUser';
                });
            },
            canTreeEdit() {
                return this.$store.state.permissions.some(item => {
                    return item === 'editTreeRightUser';
                });
            },
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
