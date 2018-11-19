
import VueRouter from "vue-router";
import {Message} from "element-ui";
import Storage, {axiosGet, parseRightsToRoutes, StorageKey} from "@/utils";
import Vue from "vue";
import compObj from "./components";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: compObj.noPage},
        {path: '/', component: compObj.login}
    ]
});

router.addRoutes([
    {
        path: '/home', component: compObj.home,
        children: [
            {path: '', component: compObj.index},
            {path: 'admin/info', component: compObj.adminInfo},
            {path: 'product/:id', component: compObj.dealProduct, props: true},
            ...getRoutes()
        ]
    }
]);

function getRoutes() {
    let state = Storage.getItem(StorageKey.site);
    if (state && state.rights) {
        let rights = state.rights;
        return parseRightsToRoutes(rights, compObj, '/home/');
    } else {
        return [];
    }
}

router.beforeEach(async (to, from, next) => {
    const toPath = to.matched[0].path;
    if (toPath === '*' || toPath === '') {
        next();
    } else {
        const res = await axiosGet('/site/logined');
        if (res.data.successed) {
            next();
        }else {
            Message.error(res.data.msg);
            next('/');
        }
    }
});

export default router;