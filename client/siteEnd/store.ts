import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let info = Storage.getItem(StorageKey.site);
        return info ? info : {};
    })(),
    mutations: {
        saveInfo(state, data) {
            Vue.set(state, 'user', data.user);
            Vue.set(state, 'rights', data.rights);
        },
        clearUser(state) {
            state.user = null;
        },
        addTypeToMenu(state, type) {
            state.user.role.rights.unshift(type.id);
            addTypeToMenu(state.rights, type);
        },
        addProductToMenu(state, data) {
            addProductToMenu(state.rights, data.typeId, data.product);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.rights, data);
        },
    }
});

export default store;