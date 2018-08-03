"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const debuger = require("debug");
const CUser_1 = require("../controler/CUser");
const debug = debuger('six7eight:route-user');
const userAuth = new Router();
function userRoutes(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.get('/users', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let cUser = new CUser_1.CUser({ name: "张三1122", password: "123456" });
            var savedUser = yield cUser.saveUser();
            debug(savedUser);
            ctx.body = savedUser;
        }));
        router.use('/user/auth/*', (ctx, next) => {
            debug('这是拦截 site user 所有路由的拦截器=====================');
            next();
        });
        userAuth.get('/', (ctx) => __awaiter(this, void 0, void 0, function* () {
        }));
        router.use('/user/auth', userAuth.routes(), userAuth.allowedMethods());
    });
}
exports.userRoutes = userRoutes;
//# sourceMappingURL=user.js.map