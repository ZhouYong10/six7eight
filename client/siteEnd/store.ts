import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey, addTypeToMenu, addProductToMenu} from "@/utils";

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
        },
        addTypeToMenu(state, type) {
            addTypeToMenu(state.user.role.rights[0][0].children, type);
        },
        addProductToMenu(state, data) {
            addProductToMenu(state.user.role.rights[0][0].children, data.typeId, data.product);
        }
    }
});

export default store;