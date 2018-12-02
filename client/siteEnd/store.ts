import Vuex from "vuex";
import Vue from "vue";
import Storage, {StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate, findMenu} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let info = Storage.getItem(StorageKey.site);
        return info ? info : {};
    })(),
    mutations: {
        login(state, data) {
            Vue.set(state, 'userId', data.userId);
            Vue.set(state, 'username', data.username);
            Vue.set(state, 'userState', data.userState);
            Vue.set(state, 'roleId', data.roleId);
            Vue.set(state, 'roleName', data.roleName);
            Vue.set(state, 'roleType', data.roleType);
            Vue.set(state, 'permissions', data.permissions);
            Vue.set(state, 'menus', data.menus);
            Vue.set(state, 'siteId', data.siteId);
            Vue.set(state, 'siteName', data.siteName);
        },
        logout(state) {
            Storage.removeItem(StorageKey.site);
        },
        changeSiteName(state, siteName) {
            state.siteName = siteName;
        },
        addTypeToMenu(state, type) {
            state.permissions.unshift(type.id);
            addTypeToMenu(state.menus, type);
        },
        addProductToMenu(state, data) {
            let product = data.product;
            addProductToMenu(state.menus, data.typeId, product);
            state.permissions.unshift(product.id);
        },
        typeOrProductUpdate(state, data) {
            typeOrProductUpdate(state.menus, data);
        },
        changeRights(state, data) {
            state.menus = data.menuRights;
            state.roleName = data.roleName;
            state.permissions = data.rights;
        },
        changeUserState(state, userState) {
            state.userState = userState;
        },
        changeUserRole(state, data) {
            state.menus = data.menuRights;
            state.roleId = data.role.id;
            state.roleType = data.role.type;
            state.roleName = data.role.name;
            state.permissions = data.role.rights;
        }
    }
});

export function isLogin() {
    return store.state.userId;
}

export function getMenu(path: string, isId: boolean) {
    return findMenu(store.state.menus, path, isId);
}

export function hasPermission(fingerprint: string) {
    return store.state.permissions.some((item:string) => {
        return item === fingerprint;
    });
}

export default store;