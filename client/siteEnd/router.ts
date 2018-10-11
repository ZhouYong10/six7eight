import Vue from "vue";
import VueRouter from "vue-router";
import {axiosGet} from "@/utils";
import {Message} from "element-ui";

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {path: '*', component: () => import("@/components/NoPage.vue")},
        {path: '/', component: () => import("./components/login/Login.vue")},
        {path: '/home', component: () => import("./components/Home.vue"),
            children: [
                {path: '', component: () => import("./components/Index.vue")},
            ]}
    ]
});

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