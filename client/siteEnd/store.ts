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
            addTypeToMenu(state.user.role.rights[0][0].children, type);
        },
        addProductToMenu(state, data) {
            addProductToMenu(state.user.role.rights[0][0].children, data.typeId, data.product);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.user.role.rights[0][0].children, data);
        },
    }
});

export default store;