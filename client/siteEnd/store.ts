import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        info: (() => {
            let info = Storage.getItem(StorageKey.site);
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo(state, data) {
            state.info = {
                user: data
            };
            Storage.setItem(StorageKey.site, state.info);
        }
    }
});

export default store;