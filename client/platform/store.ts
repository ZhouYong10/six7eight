import Vue from "vue";
import Vuex from "vuex";
import Storage, {StorageKey} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let info = Storage.getItem(StorageKey.platform);
        return info ? info : {};
    })(),
    mutations: {
        saveInfo(state, user) {
            Vue.set(state, 'user', user);
        },
        clearUser(state) {
            state = {};
        }
    }
});

export default store;