<template>
    <!--<div>-->
        <!--&lt;!&ndash;<div style="margin-bottom: 20px;">&ndash;&gt;-->
            <!--&lt;!&ndash;<el-button size="small" @click="addTab(editableTabsValue2)">&ndash;&gt;-->
                <!--&lt;!&ndash;add tab&ndash;&gt;-->
            <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--<el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">-->
            <!--<el-tab-pane-->
                    <!--v-for="(item, index) in editableTabs2"-->
                    <!--:key="item.name"-->
                    <!--:label="item.title"-->
                    <!--:name="item.name">-->
                <!--{{item.content}}-->
            <!--</el-tab-pane>-->
        <!--</el-tabs>-->
    <!--</div>-->
    <el-tabs v-model="editableTabsValue2" type="card" closable @tab-remove="removeTab">
        <el-tab-pane
                v-for="(item, index) in tabPages"
                :key="index"
                :label="item.title">
            <h1>{{item.content}}</h1>
            <h2>{{item.content}}</h2>
            <h3>{{item.content}}</h3>
            <h4>{{item.content}}</h4>

        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import {mapState} from "vuex";
    export default {
        name: "MainContent",
        componentName: "MainContent",
        data() {
            return {
                editableTabsValue2: '2',
                editableTabs2: [{
                    title: 'Tab 1',
                    name: '1',
                    content: 'Tab 1 content'
                }, {
                    title: 'Tab 2',
                    name: '2',
                    content: 'Tab 2 content'
                }],
                tabIndex: 2
            }
        },
        computed: {
            ...mapState({
                tabPages: state => state.tabs
            })
        },
        methods: {
            addTab(targetName) {
                let newTabName = ++this.tabIndex + '';
                this.editableTabs2.push({
                    title: 'New Tab',
                    name: newTabName,
                    content: 'New Tab content' + newTabName
                });
                this.editableTabsValue2 = newTabName;
            },
            removeTab(targetName) {
                let tabs = this.editableTabs2;
                let activeName = this.editableTabsValue2;
                if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                            }
                        }
                    });
                }

                this.editableTabsValue2 = activeName;
                this.editableTabs2 = tabs.filter(tab => tab.name !== targetName);
            }
        }
    }
</script>

<style lang="scss">
    .el-main {
        padding: 6px 12px;
    }
</style>