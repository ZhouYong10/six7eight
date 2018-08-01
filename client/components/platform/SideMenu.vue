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
                        path: '/home/user',
                        icon: 'el-icon-setting',
                        name: '用户管理',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/home/mp/fans',
                                icon: 'el-icon-setting',
                                name: '美拍粉丝',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/mp/friend',
                                icon: 'el-icon-setting',
                                name: '美拍好友',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/home/mp/code',
                                icon: 'el-icon-setting',
                                name: '美拍扫码',
                                isShow: true,
                                hasChild: false
                            }
                        ]
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
                        path: '/home/product',
                        icon: 'el-icon-setting',
                        name: '商品管理',
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