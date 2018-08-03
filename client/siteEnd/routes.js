"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Login_vue_1 = require("./components/login/Login.vue");
const NoPage_vue_1 = require("@/components/NoPage.vue");
const Index_vue_1 = require("./components/Index.vue");
const Home_vue_1 = require("./components/Home.vue");
const Hello_vue_1 = require("./components/Hello.vue");
const routes = [
    { path: '*', component: NoPage_vue_1.default },
    { path: '/', component: Login_vue_1.default },
    { path: '/home', component: Home_vue_1.default, children: [
            { path: '', component: Index_vue_1.default },
            { path: 'recharge', component: Hello_vue_1.default },
            { path: 'mp/code', component: Hello_vue_1.default },
        ] }
];
exports.default = routes;
//# sourceMappingURL=routes.js.map