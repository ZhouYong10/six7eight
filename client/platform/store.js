import Vue from "vue";
import Vuex from "vuex";
import Storage, { StorageKey } from "@/utils";
Vue.use(Vuex);
var store = new Vuex.Store({
    state: {
        info: (function () {
            var info = Storage.getItem(StorageKey.platform);
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo: function (state, data) {
            state.info = {
                user: data
            };
        }
    }
});
export default store;
//# sourceMappingURL=store.js.map