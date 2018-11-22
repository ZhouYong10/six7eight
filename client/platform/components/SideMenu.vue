<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened>
        <template v-for="item in rights">
            <el-submenu :index="'/home/' + item.id" v-if="item.type !=='productType' && item.children.length > 0">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/home/' + childItem.id" :key="childItem.id">
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>
            <el-submenu :index="'/home/product/' + item.id" v-else-if="item.type ==='productType' && item.children.length > 0">
                <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="childItem in item.children" :index="'/home/product/' + childItem.id" :key="childItem.id">
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>
            <el-menu-item :index="'/home/' + item.id" v-if="item.type !=='productType' && item.children.length < 1">
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>

    import {axiosGet, parseRightsToRoutes, pageChangeMsg} from "@/utils";
    import compObj from "./";

    export default {
        name: "SideMenu",
        componentName: "SideMenu",
        created() {
            this.$router.addRoutes([
                {
                    path: '/home', component: compObj.home,
                    children: parseRightsToRoutes(this.rights, compObj, '/home/')
                }
            ]);

            this.registIoListener();
        },
        methods: {
            registIoListener() {
                if (this.role.type === 'role_developer') {
                    // 添加商品类别
                    this.$options.sockets[this.role.id + 'type'] = (type) => {
                        this.$store.commit('addTypeToMenu', type);
                    };

                    // 添加商品
                    this.$options.sockets[this.role.id + 'product'] = (data) => {
                        this.$store.commit('addProductToMenu', data);
                    };
                }

                // 修改商品类别或商品信息
                this.$options.sockets['typeOrProductUpdate'] = (data) => {
                    this.$store.commit('typeOrProductUpdate', data);
                };

                // 修改管理员角色信息
                this.$options.sockets[this.role.id + 'changeRights'] = (data) => {
                    this.$router.addRoutes([
                        {
                            path: '/home', component: compObj.home,
                            children: parseRightsToRoutes(data.menuRights, compObj, '/home/')
                        }
                    ]);
                    this.$store.commit('changeRights', data);
                    this.$router.push('/home');
                    pageChangeMsg('您的角色信息变更了！');
                };

                // 修改管理员账户状态
                this.$options.sockets[this.userId + 'changeUserState'] = (state) => {
                    if (state === '禁用') {
                        axiosGet('/platform/auth/logout');
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
                    this.$router.addRoutes([
                        {
                            path: '/home', component: compObj.home,
                            children: parseRightsToRoutes(data.menuRights, compObj, '/home/')
                        }
                    ]);
                    this.$store.commit('changeUserRole', data);
                    this.$router.push('/home');
                    pageChangeMsg('您的角色变更了！');
                };
            }
        },
        computed: {
            userId() {
                let user = this.$store.state.user;
                return user ? user.id : '';
            },
            role() {
                let user = this.$store.state.user;
                return user ? user.role : null;
            },
            rights() {
                return this.$store.state.rights || [];
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>