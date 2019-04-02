<template>
    <div>
        <vue-ueditor-wrap v-model="msg" :config="myConfig" @ready="ready" :destroy="true"></vue-ueditor-wrap>
        <el-button plain :type="btnTypeUser" size="small" @click="loadUserDoc">前端用户教程</el-button>
        <el-button plain :type="btnTypeSite" size="small" @click="loadSiteDoc">分站管理员教程</el-button>
    </div>
</template>

<script>
    import {axiosGet, axiosPost} from "@/slfaxios";
    import VueUeditorWrap from 'vue-ueditor-wrap' // ES6 Module
    import {Notification } from "element-ui";

    export default {
        name: "vue-ueditor",
        components: {
            VueUeditorWrap
        },
        data() {
            return {
                editor: null,
                oldMsg: '',
                msg: '',
                myConfig: {
                    initialFrameHeight: 660,
                    initialFrameWidth:'100%'
                },
                userDoc: false,
                siteDoc: false,
                btnTypeUser: '',
                btnTypeSite: '',
            }
        },
        methods: {
            ready(editor) {
                editor.setDisabled('fullscreen');
                this.editor = editor;

                setInterval(async () => {
                    if (this.msg !== '' && this.msg !== this.oldMsg) {
                        this.oldMsg = this.msg;
                        await this.saveDoc(this.oldMsg);
                        Notification.success({
                            title: '提示!',
                            message: '自动保存成功！',
                            duration: 2000,
                            position: 'bottom-right'
                        });
                    }
                }, 5000);
            },
            async loadUserDoc() {
                let userDoc = await axiosGet('/platform/auth/load/user/document');
                this.msg = userDoc;
                this.oldMsg = userDoc;
                this.editor.setEnabled();
                this.siteDoc = false;
                this.userDoc = true;
                this.btnTypeUser = 'primary';
                this.btnTypeSite = '';
            },
            async loadSiteDoc() {
                let siteDoc = await axiosGet('/platform/auth/load/site/document');
                this.msg = siteDoc;
                this.oldMsg = siteDoc;
                this.editor.setEnabled();
                this.userDoc = false;
                this.siteDoc = true;
                this.btnTypeSite = 'primary';
                this.btnTypeUser = '';
            },
            async saveDoc(doc) {
                if (this.userDoc) {
                    await axiosPost('/platform/auth/save/user/document', {userDoc: doc});
                }
                if (this.siteDoc) {
                    await axiosPost('/platform/auth/save/site/document', {siteDoc: doc});
                }
            }
        }
    }
</script>

<style lang="scss">

</style>