import Vuex from "vuex";
import Vue from "vue";
import Storage, { StorageKey } from "@/utils";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: {
        info: (function () {
            var info = Storage.getItem(StorageKey.user);
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo: function (state, data) {
            state.info = {
                user: data
            };
        },
        updateUsername: function (state, username) {
            state.info.user.username = username;
        }
    }
});
export default store;
//# sourceMappingURL=store.js.map