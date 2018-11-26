import Vue from "vue";
import VueSocketio from 'vue-socket.io';
import * as socketio from 'socket.io-client';
import ElementUI from "element-ui";

import "element-ui/lib/theme-chalk/index.css";
import "@/css/main.css";
import store from "./siteFront/store";
import router from "./siteFront/router";
import Storage, {StorageKey, axiosGet, parseRightsToRoutes, host} from "@/utils";
import reminder from "./commons/components/Reminder.vue";
import compObj from "./siteFront/components";

Vue.use(ElementUI);
Vue.use(VueSocketio, socketio(host()), store);
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
        },
        userRights() {
            let productMenu = store.state.typeRights || [];
            let roleMenu = store.state.rights || [];
            let userRights: string[] = [];
            productMenu.forEach((type: any) => {
                if (type.onSale && type.children.length > 0) {
                    type.children.forEach((product: any) => {
                        if (product.onSale) {
                            userRights.push(product.id);
                        }
                    });
                }
            });
            roleMenu.forEach((menu: any) => {
                if (menu.children && menu.children.length > 0) {
                    menu.children.forEach((item: any) => {
                        userRights.push(item.id);
                    });
                } else {
                    userRights.push(menu.id);
                }
            });
            return userRights;
        }
    },
    watch: {
        getState: {
            handler: function (val) {
                Storage.setItem(StorageKey.user, val);
            },
            deep: true
        },
        $route(to, from) {
            let pathArr = to.path.split('/');
            let pathId = pathArr[pathArr.length - 1];
            if (pathId.split('-').length > 2 && this.userRights.indexOf(pathId) === -1) {
                this.$router.replace('/none/page/found');
            }
        }
    }
});