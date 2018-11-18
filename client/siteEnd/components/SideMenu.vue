<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened @select="selected">
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
    import {parseRightsToRoutes} from "@/utils";
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
        },
        data(){
            return {
                menus: [
                    {
                        path: '/recharge',
                        icon: 'el-icon-setting',
                        name: '资金管理',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/recharge/add',
                                icon: 'el-icon-setting',
                                name: '在线充值',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/recharge/record',
                                icon: 'el-icon-setting',
                                name: '充值记录',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/consume/record',
                                icon: 'el-icon-setting',
                                name: '消费记录',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/profit/record',
                                icon: 'el-icon-setting',
                                name: '返利记录',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/withdraw/add',
                                icon: 'el-icon-setting',
                                name: '申请提现',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/withdraw/record',
                                icon: 'el-icon-setting',
                                name: '提现记录',
                                isShow: true,
                                hasChild: false
                            },
                        ]
                    },
                    {
                        path: '/product',
                        icon: 'el-icon-setting',
                        name: '商品管理',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/product/type',
                                icon: 'el-icon-setting',
                                name: '商品类别',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/product/all',
                                icon: 'el-icon-setting',
                                name: '所有商品',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/admins',
                        icon: 'el-icon-setting',
                        name: '站点管理员',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/admin/role',
                                icon: 'el-icon-setting',
                                name: '角色管理',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/admins',
                                icon: 'el-icon-setting',
                                name: '管理员列表',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/users',
                        icon: 'el-icon-setting',
                        name: '用户管理',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/users/role',
                                icon: 'el-icon-setting',
                                name: '用户角色',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/users',
                                icon: 'el-icon-setting',
                                name: '用户列表',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/home/placard',
                        icon: 'el-icon-setting',
                        name: '公告管理',
                        isShow: true,
                        hasChild: false
                    },
                    {
                        path: '/feedbacks',
                        icon: 'el-icon-setting',
                        name: '问题反馈',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/feedback',
                                icon: 'el-icon-setting',
                                name: '我的反馈',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/user/feedback',
                                icon: 'el-icon-setting',
                                name: '用户反馈',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/home/site/settings',
                        icon: 'el-icon-setting',
                        name: '系统设置',
                        isShow: true,
                        hasChild: false
                    }
                ]
            }
        },
        methods: {
            selected(index,indexPath){
                this.$router.push(index);
            }
        },
        computed: {
            rights() {
                let user = this.$store.state.user;
                if (user) {
                    return user.role.rights[0][0].children;
                }else {
                    return [];
                }
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>