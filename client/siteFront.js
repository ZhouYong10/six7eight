import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import Storage, { StorageKey } from "@/utils";
import reminder from "./commons/components/Reminder.vue";
Vue.use(ElementUI);
Vue.component('sf-reminder', reminder);
var app = new Vue({
    el: "#app",
    store: store,
    router: router,
    computed: {
        getUser: function () {
            return this.$store.state.user;
        },
        getSiteName: function () {
            return this.$store.state.siteName;
        },
        getRights: function () {
            return this.$store.state.rights;
        }
    },
    watch: {
        getUser: {
            handler: function (val) {
                this.$store.state.user = val;
                Storage.setItem(StorageKey.user, this.$store.state);
            },
            deep: true
        },
        getSiteName: {
            handler: function (val) {
                this.$store.state.siteName = val;
                Storage.setItem(StorageKey.user, this.$store.state);
            }
        },
        getRights: {
            handler: function (val) {
                this.$store.state.rights = val;
                Storage.setItem(StorageKey.user, this.$store.state);
            },
            deep: true
        },
    }
});
//# sourceMappingURL=siteFront.js.map