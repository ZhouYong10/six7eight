import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let info = Storage.getItem(StorageKey.site);
        return info ? info : {};
    })(),
    mutations: {
        saveInfo(state, user) {
            Vue.set(state, 'user', user);
        },
        clearUser(state) {
            state.user = null;
        }
    }
});

export default store;