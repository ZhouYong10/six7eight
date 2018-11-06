import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let state = Storage.getItem(StorageKey.user);
        return state ? state : {};
    })(),
    mutations: {
        saveInitData(state, data) {
            Vue.set(state, 'initData', data);
        },
        saveUser(state, user) {
            Vue.set(state, 'user', user);
        },
        clearUser(state) {
            state.user = null;
        },
        updateUsername(state, username) {
            state.user.username = username;
        }
    }
});

export default store;