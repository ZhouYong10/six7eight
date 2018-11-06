import Vue from "vue";
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import Storage, {StorageKey, axiosGet, parseRightsToRoutes} from "@/utils";
import reminder from "./commons/components/Reminder.vue";
import compObj from "./siteFront/components";

Vue.use(ElementUI);
Vue.component('sf-reminder', reminder);


let app = new Vue({
    el: "#app",
    store,
    router,
    beforeCreate() {
        let state = Storage.getItem(StorageKey.user);
        if (!state || !state.rights) {
            axiosGet('/user/init/data').then( (data:any)=> {
                this.$store.commit('saveInitData', data);
                this.$router.addRoutes([
                    {
                        path: '/', component: compObj.home,
                        children: parseRightsToRoutes(data.rights, compObj)
                    }
                ]);
            });
        }
    },
    computed: {
        getState():any {
            return this.$store.state;
        }
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.user, val);
            },
            deep: true
        }
    }
});