<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened>
        <template v-for="item in menus">
            <el-submenu :index="item.id" v-if="item.type ==='menuGroup' && item.children.length > 0">
                <template slot="title">
                    <i v-if="item.icon" :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="childItem.path" :key="childItem.id">
                    <i v-if="childItem.icon" :class="childItem.icon"></i>
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>

            <el-submenu :index="item.id" v-else-if="item.type ==='productType' && item.children.length > 0">
                <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/home/product/' + childItem.id" :key="childItem.id">
                    <i class="el-icon-tickets"></i>
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>

            <el-menu-item :index="item.path" v-if="item.type ==='menu'">
                <i v-if="item.icon" :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
    import {axiosGet, pageChangeMsg} from "@/utils";

    export default {
        name: "SideMenu",
        componentName: "SideMenu",
        created() {
            this.registIoListener();
        },
        methods: {
            registIoListener() {
                if (this.roleType === 'role_site') {
                    // 添加商品类别
                    this.$options.sockets[this.roleId + 'type'] = (type) => {
                        this.$store.commit('addTypeToMenu', type);
                    };

                    // 添加商品
                    this.$options.sockets[this.roleId + 'product'] = (data) => {
                        this.$store.commit('addProductToMenu', data);
                    };
                }

                // 修改商品类别或商品信息
                this.$options.sockets[this.siteId + 'typeOrProductUpdate'] = (data) => {
                    this.$store.commit('typeOrProductUpdate', data);
                };

                // 修改管理员角色信息
                this.$options.sockets[this.roleId + 'changeRights'] = (data) => {
                    this.$store.commit('changeRights', data);
                    this.$router.push('/home');
                    pageChangeMsg('您的角色信息变更了！');
                };

                // 修改管理员账户状态
                this.$options.sockets[this.userId + 'changeUserState'] = (state) => {
                    if (state === '禁用') {
                        axiosGet('/site/auth/logout');
                        this.$store.commit('logout');
                        this.$router.push('/');
                        pageChangeMsg('您的账户被封禁了！');
                    }else{
                        this.$store.commit('changeUserState', state);
                        if (state === '冻结') {
                            pageChangeMsg('您的账户被冻结了！');
                        } else {
                            pageChangeMsg('您的账户正常启用了！');
                        }
                    }
                };

                // 修改管理员账户角色
                this.$options.sockets[this.userId + 'changeUserRole'] = (data) => {
                    this.$store.commit('changeUserRole', data);
                    this.$router.push('/home');
                    pageChangeMsg('您的角色变更了！');
                };
            }
        },
        computed: {
            userId() {
                return this.$store.state.userId;
            },
            siteId() {
                return this.$store.state.siteId;
            },
            roleType() {
                return this.$store.state.roleType;
            },
            roleId() {
                return this.$store.state.roleId;
            },
            menus() {
                return this.$store.state.menus;
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>