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
        name: "SideMenu",
        componentName: "SideMenu",
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
                                path: '/recharge/add',
                                icon: 'el-icon-setting',
                                name: '在线充值',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/recharge/record',
                                icon: 'el-icon-setting',
                                name: '充值记录',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/consume/record',
                                icon: 'el-icon-setting',
                                name: '消费记录',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/profit/record',
                                icon: 'el-icon-setting',
                                name: '返利记录',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/withdraw/add',
                                icon: 'el-icon-setting',
                                name: '申请提现',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/withdraw/record',
                                icon: 'el-icon-setting',
                                name: '提现记录',
                                isShow: true,
                                hasChild: false
                            },
                        ]
                    },
                    {
                        path: '/lower/users',
                        icon: 'el-icon-setting',
                        name: '下级管理',
                        isShow: true,
                        hasChild: false
                    },
                    {
                        path: '/feedback',
                        icon: 'el-icon-setting',
                        name: '问题反馈',
                        isShow: true,
                        hasChild: false
                    },
                ]
            }
        },
        methods: {
            selected(index,indexPath){
                this.$router.push(index);
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>