<template>
    <div style="height: 100%; background: #1C2327; border-bottom: 1px solid #3E4447;">
        <i class="el-icon-menu menu-btn" title="菜单"></i>
        <div class="header-menu">
            <ul>
                <li>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                            <el-dropdown-item command="b">狮子头</el-dropdown-item>
                            <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                            <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                            <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                            <el-dropdown-item command="b">狮子头</el-dropdown-item>
                            <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                            <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                            <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li>
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">黄金糕</el-dropdown-item>
                            <el-dropdown-item command="b">狮子头</el-dropdown-item>
                            <el-dropdown-item command="c">螺蛳粉</el-dropdown-item>
                            <el-dropdown-item command="d" disabled>双皮奶</el-dropdown-item>
                            <el-dropdown-item command="e" divided>蚵仔煎</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </li>
                <li>
                    账户名：等级
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HeaderMenu",
        componentName: "HeaderMenu",
        methods: {
            handleCommand(command) {
                this.$message('click on item ' + command);
            }
        }
    }
</script>

<style lang="scss">
    .menu-btn{
        height: 50px;
        display: inline-block;
        width: 50px;
        line-height: 50px;
        font-size: 30px;
        background: #1C2327;
        color: white;
        text-align: center;
        cursor: pointer;
        border-right: 1px solid #3E4447;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>