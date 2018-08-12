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
const passport = require("koa-passport");
const debuger = require("debug");
const utils_1 = require("../utils");
const UserBase_1 = require("../entity/UserBase");
const CRightAdmin_1 = require("../controler/CRightAdmin");
const CRoleUserAdmin_1 = require("../controler/CRoleUserAdmin");
const CUserAdmin_1 = require("../controler/CUserAdmin");
const debug = (info, msg) => {
    const debug = debuger('six7eight:route_platform');
    debug(JSON.stringify(info) + '  ' + msg);
};
const platformAuth = new Router();
function platformRoute(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.get('/platform', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('platform');
        }));
        router.post('/platform/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.body;
            const captcha = ctx.session.captcha;
            if (captcha === params.securityCode) {
                return passport.authenticate('platform', (err, user, info, status) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        ctx.login(user);
                        yield CUserAdmin_1.CUserAdmin.updateLoginTime({ id: user.id, time: utils_1.now() });
                        ctx.body = new utils_1.MsgRes(true, '', user);
                    }
                    else {
                        ctx.body = new utils_1.MsgRes(false, '用户名或密码错误！');
                    }
                }))(ctx, () => {
                    return new Promise((resolve, reject) => {
                        resolve();
                    });
                });
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '验证码错误！');
            }
        }));
        router.get('/platform/logined', (ctx) => __awaiter(this, void 0, void 0, function* () {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Platform) {
                ctx.body = new utils_1.MsgRes(true);
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        }));
        router.use('/platform/auth/*', (ctx, next) => {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Platform) {
                return next();
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        });
        platformAuth.get('/admins', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.allAdmins());
        }));
        platformAuth.get('/admin/roles', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.allRoles());
        }));
        platformAuth.post('/role/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.saveOne(ctx.request.body));
        }));
        platformAuth.post('/role/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.update(ctx.request.body));
        }));
        platformAuth.get('/role/remove/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.delById(ctx.params.id));
        }));
        platformAuth.get('/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.show());
        }));
        platformAuth.post('/right/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.save(ctx.request.body));
        }));
        platformAuth.post('/right/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.update(ctx.request.body));
        }));
        platformAuth.get('/right/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.del(ctx.params.id));
        }));
        router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
    });
}
exports.platformRoute = platformRoute;
//# sourceMappingURL=platform.js.map