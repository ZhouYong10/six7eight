import Vue from "vue";
import Vuex from "vuex";
import Storage, {StorageKey, addTypeToMenu, addProductToMenu, typeOrProductUpdate} from "@/utils";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: (() => {
        let info = Storage.getItem(StorageKey.platform);
        return info ? info : {};
    })(),
    mutations: {
        login(state, data) {
            Vue.set(state, 'userId', data.userId);
            Vue.set(state, 'username', data.username);
            Vue.set(state, 'userState', data.userState);
            Vue.set(state, 'roleId', data.roleId);
            Vue.set(state, 'roleType', data.roleType);
            Vue.set(state, 'roleName', data.roleName);
            Vue.set(state, 'menus', data.menus);
            Vue.set(state, 'permissions', data.permissions);
        },
        logout(state) {
            Storage.removeItem(StorageKey.platform);
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

export function isLogin() {
    return store.state.userId;
}

export function getMenu(path: string, isId: boolean) {
    function findMenu(menus:Array<any>, path: string, isId: boolean):any {
        for (let i = 0; i < menus.length; i++){
            let item = menus[i];
            if ((!isId && item.path === path) || (isId && item.id === path)) {
                return item;
            }
            if (item.children && item.children.length > 0) {
                let menu = findMenu(item.children, path, isId);
                if (menu) {
                    return menu;
                }
            }
        }
    }
    return findMenu(store.state.menus, path, isId);
}

export function hasPermission(fingerprint: string) {
    return store.state.permissions.some((item:string) => {
        return item === fingerprint;
    });
}

export default store;