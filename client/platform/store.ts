import Vue from "vue";
import Vuex from "vuex";
import Storage, {StorageKey} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        info: (() => {
            let info = Storage.getItem(StorageKey.platform);
            return info ? info : {};
        })()
    },
    mutations: {
        saveInfo(state, data) {
            state.info = {
                user: data
            };
        }
    }
});

export default store;