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
        saveInfo(state, data) {
            Vue.set(state, 'user', data.user);
            Vue.set(state, 'rights', data.rights);
        },
        clearUser(state) {
            state.user = null;
        }
    }
});

export default store;