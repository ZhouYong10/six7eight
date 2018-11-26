
import VueRouter from "vue-router";
import {Message} from "element-ui";
import Storage, {document, axiosGet, parseRightsToRoutes, StorageKey} from "@/utils";
import Vue from "vue";
import compObj from "./components";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: compObj.noPage, meta: {title: '404'}},
        {path: '/', component: compObj.login, meta: {title: '登录'}}
    ]
});

router.addRoutes([
    {
        path: '/home', component: compObj.home,
        children: [
            {path: '', component: compObj.index, meta: {title: '首页'}},
            {path: 'admin/info', component: compObj.adminInfo, meta: {title: '账户信息'}},
            {path: 'product/:id', component: compObj.dealProduct, props: true, meta: {title: '订单管理'}},
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
    document.title = to.meta.title;

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