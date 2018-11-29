
import VueRouter from "vue-router";
import Vue from "vue";
import compObj from "./components";
import Storage, {document, parseRightsToRoutes, StorageKey} from "@/utils";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', redirect: '/'},
        {
            path: '/', component: compObj.home,
            children: [
                {path: '', component: compObj.index, meta: {title: '公告'}},
                {path: 'selfInfo', component: compObj.myInfo, meta: {title: '账户信息'}},
                {path: 'product/:id', component: compObj.product, props: true, meta: {title: '订单信息'}},
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
    document.title = to.meta.title;
    next();
});

export default router;