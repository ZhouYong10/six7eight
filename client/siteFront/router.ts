
import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import Storage, {axiosGet, parseRightsToRoutes, StorageKey} from "@/utils";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: compObj.noPage},
        {
            path: '/', component: compObj.home,
            children: [
                {path: '', component: compObj.index},
                {path: 'selfInfo', component: compObj.myInfo},
                {path: 'product/:id', component: compObj.product, props: true},
                ...getRoutes()
            ]
        }
    ]
});

function getRoutes() {
    let state = Storage.getItem(StorageKey.user);
    if (state && state.rights) {
        return parseRightsToRoutes(state.rights, compObj);
    } else {
        return [];
    }
}

router.beforeEach(async (to, from, next) => {
    let pathArr = to.path.split('/');
    let pathId = pathArr[pathArr.length - 1];
    let vue = router.app;
    let productMenu = vue.$store.state.typeRights;
    let roleMenu = vue.$store.state.rights;
    if (productMenu && roleMenu) {
        let userRights: string[] = [];
        productMenu.forEach((type: any) => {
            if (type.onSale && type.children.length > 0) {
                type.children.forEach((product: any) => {
                    if (product.onSale) {
                        userRights.push(product.id);
                    }
                });
            }
        });
        roleMenu.forEach((menu: any) => {
            if (menu.children && menu.children.length > 0) {
                menu.children.forEach((item: any) => {
                    userRights.push(item.id);
                });
            } else {
                userRights.push(menu.id);
            }
        });
        if (pathId.split('-').length > 2 && userRights.indexOf(pathId) === -1) {
            router.replace('/none/page/fund');
        } else {
            next();
        }
    } else {
        let hasRight = await axiosGet('/user/has/right/' + (pathId || 'index'));
        if (hasRight) {
            next();
        } else {
            router.replace('/none/page/fund');
            next();
        }
    }
});

export default router;