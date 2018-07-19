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

<!--
        <el-submenu index="1">
            <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">导航一</span>
            </template>
            <el-menu-item-group>
                <span slot="title">分组一</span>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
                <span slot="title">选项4</span>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
                <el-menu-item index="1-4-11">选项1</el-menu-item>
                <el-menu-item index="1-4-12">选项1</el-menu-item>
                <el-menu-item index="1-4-13">选项1</el-menu-item>
                <el-menu-item index="1-4-14">选项1</el-menu-item>
                <el-menu-item index="1-4-15">选项1</el-menu-item>
                <el-menu-item index="1-4-16">选项1</el-menu-item>
                <el-menu-item index="1-4-17">选项1</el-menu-item>
                <el-menu-item index="1-4-18">选项1</el-menu-item>
                <el-menu-item index="1-4-19">选项1</el-menu-item>
                <el-menu-item index="1-4-10">选项1</el-menu-item>
                <el-menu-item index="1-4-21">选项1</el-menu-item>
                <el-menu-item index="1-4-31">选项1</el-menu-item>
                <el-menu-item index="1-4-41">选项1</el-menu-item>
                <el-menu-item index="1-4-51">选项1</el-menu-item>
                <el-menu-item index="1-4-61">选项1</el-menu-item>
                <el-menu-item index="1-4-71">选项1</el-menu-item>
                <el-menu-item index="1-4-81">选项1</el-menu-item>
                <el-menu-item index="1-4-91">选项1</el-menu-item>
                <el-menu-item index="1-4-111">选项1</el-menu-item>
                <el-menu-item index="1-4-122">选项1</el-menu-item>
                <el-menu-item index="1-4-133">选项1</el-menu-item>
                <el-menu-item index="1-4-144">选项1</el-menu-item>
                <el-menu-item index="1-4-155">选项1</el-menu-item>
                <el-menu-item index="1-4-166">选项1</el-menu-item>
                <el-menu-item index="1-4-177">选项1</el-menu-item>
                <el-menu-item index="1-4-188">选项1</el-menu-item>
            </el-submenu>
        </el-submenu>
        <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
        </el-menu-item>
        -->

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
                        path: '/wx',
                        icon: 'el-icon-setting',
                        name: '微信推广',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/wx/fans',
                                icon: 'el-icon-setting',
                                name: '微信粉丝',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/wx/friend',
                                icon: 'el-icon-setting',
                                name: '微信好友',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/wx/code',
                                icon: 'el-icon-setting',
                                name: '微信扫码',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/mp',
                        icon: 'el-icon-setting',
                        name: '美拍推广',
                        isShow: true,
                        hasChild: true,
                        children: [
                            {
                                path: '/mp/fans',
                                icon: 'el-icon-setting',
                                name: '美拍粉丝',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/mp/friend',
                                icon: 'el-icon-setting',
                                name: '美拍好友',
                                isShow: true,
                                hasChild: false
                            },
                            {
                                path: '/mp/code',
                                icon: 'el-icon-setting',
                                name: '美拍扫码',
                                isShow: true,
                                hasChild: false
                            }
                        ]
                    },
                    {
                        path: '/recharge',
                        icon: 'el-icon-setting',
                        name: '充值',
                        isShow: true,
                        hasChild: false
                    },
                    {
                        path: '/test',
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
                console.log(index, indexPath, 'selected');
                let menu = this.menus.find(menu => {
                    if (menu.path === index) {
                        return menu;
                    }else if (menu.hasChild) {
                        return menu.children.find(childMenu => {
                            return childMenu.path === index;
                        });
                    }
                });
                this.$store.commit('addTab', {
                    title: menu.name,
                    content: menu.name + " " + menu.path
                })
            }
        }
    }
</script>

<style lang="scss">
    .el-menu-vertical-demo {
        border: none;
    }
</style>