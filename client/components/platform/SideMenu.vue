<template>
    <el-menu class="el-menu-vertical-demo" router :default-active="$route.path" unique-opened @select="selected">
        <template v-for="(item, index) in menus" v-if="item.isShow">
            <el-submenu :index="item.path" v-if="item.hasChild">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </template>
                <el-menu-item v-for="(childItem, index) in item.children" :index="childItem.path" :key="index">
                    {{childItem.name}}
                </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.path" v-else>
                <i :class="item.icon"></i>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script>
    export default {
        name: "side-menu",
        componentName: "side-menu",
        data(){
            return {
                menus: [
                    {
                        path: '/home/wx',
                        icon: 'el-icon-setting',
                        name: '微信推广',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/wx/fans',
                                icon: 'el-icon-setting',
                                name: '微信粉丝',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/wx/friend',
                                icon: 'el-icon-setting',
                                name: '微信好友',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/wx/code',
                                icon: 'el-icon-setting',
                                name: '微信扫码',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/home/order/err',
                        icon: 'el-icon-setting',
                        name: '订单报错',
                        isShow: true,
                        hasChild: false
                    },
                    {
                        path: '/home/funds',
                        icon: 'el-icon-setting',
                        name: '资金管理',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/funds/recharge',
                                icon: 'el-icon-setting',
                                name: '充值记录',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/funds/withdraw',
                                icon: 'el-icon-setting',
                                name: '提现记录',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/home/products',
                        icon: 'el-icon-setting',
                        name: '商品管理',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/products/types',
                                icon: 'el-icon-setting',
                                name: '分类列表',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/products/all',
                                icon: 'el-icon-setting',
                                name: '所有商品',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/home/placards',
                        icon: 'el-icon-setting',
                        name: '公告管理',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/placards/platform',
                                icon: 'el-icon-setting',
                                name: '系统公告',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/placards/site',
                                icon: 'el-icon-setting',
                                name: '分站公告',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/home/sites',
                        icon: 'el-icon-setting',
                        name: '分站管理',
                        isShow: true,
                        hasChild: false
                    },
                    {
                        path: '/home/feedback',
                        icon: 'el-icon-setting',
                        name: '问题反馈',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/feedback/site',
                                icon: 'el-icon-setting',
                                name: '站点反馈',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/feedback/user',
                                icon: 'el-icon-setting',
                                name: '用户反馈',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/home/platform/admins',
                        icon: 'el-icon-setting',
                        name: '平台管理员',
                        isShow: true,
                        hasChild: false
                    },
                    {
                        path: '/home/test',
                        icon: 'el-icon-setting',
                        name: '测试',
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

        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>