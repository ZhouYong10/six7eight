<template>
    <el-menu class="el-menu-vertical-demo" unique-opened @select="selected">
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
        <el-submenu index="2">
            <template slot="title">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </template>
            <el-menu-item-group>
                <span slot="title">分组一</span>
                <el-menu-item index="2-1">选项1</el-menu-item>
                <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3">
            <i class="el-icon-document"></i>
            <span slot="title">导航三</span>
        </el-menu-item>
        <el-menu-item index="4">
            <i class="el-icon-setting"></i>
            <span slot="title">导航四</span>
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "SideMenu",
        componentName: "SideMenu",
        data(){
            return {
                isOpen: true
            }
        },
        methods: {
            selected(index,indexPath){
                console.log(index, indexPath, 'selected');
            }
        }
    }
</script>

<style lang="css">
    .el-menu-vertical-demo:not(.el-menu--collapse) {

    }
</style>