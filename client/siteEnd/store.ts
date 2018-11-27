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
        logout(state) {
            state = null;
        },
        changeSiteName(state, siteName) {
            state.user.site.name = siteName;
        },
        addTypeToMenu(state, type) {
            state.user.role.rights.unshift(type.id);
            addTypeToMenu(state.rights, type);
        },
        addProductToMenu(state, data) {
            let treeRights = state.rights, typeId = data.typeId, product = data.product;
            addProductToMenu(treeRights, typeId, product);

            let rights = state.user.role.rights;
            for(let i = 0; i < rights.length; i++){
                if (rights[i] === typeId) {
                    rights.splice(i, 1);
                    break;
                }
            }
            rights.unshift(product.id);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.rights, data);
        },
        changeRights(state, data) {
            state.rights = data.menuRights;
            state.user.role.name = data.roleName;
            state.user.role.rights = data.rights;
        },
        changeUserState(state, userState) {
            state.user.state = userState;
        },
        changeUserRole(state, data) {
            state.rights = data.menuRights;
            state.user.role = data.role;
        }
    }
});

export default store;