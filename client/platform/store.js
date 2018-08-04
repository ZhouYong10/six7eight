import Vue from "vue";
import Vuex from "vuex";
import { StorageKey } from "@/utils";
import window from "@/window";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: {
        info: (function () {
            var info = JSON.parse(window.sessionStorage.getItem(StorageKey.platform));
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo: function (state, data) {
            state.info = {
                user: data
            };
            window.sessionStorage.setItem(StorageKey.platform, JSON.stringify(state.info));
        },
        changeUser: function (state, user) {
            state.info.user = user;
        }
    }
});
export default store;
//# sourceMappingURL=store.js.map