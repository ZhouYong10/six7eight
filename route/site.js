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
const utils_1 = require("../utils");
const UserBase_1 = require("../entity/UserBase");
const passport = require("passport");
const CUserSite_1 = require("../controler/CUserSite");
const CRoleUserSite_1 = require("../controler/CRoleUserSite");
const CRightSite_1 = require("../controler/CRightSite");
const CProductTypeSite_1 = require("../controler/CProductTypeSite");
const CProductSite_1 = require("../controler/CProductSite");
const CRoleUser_1 = require("../controler/CRoleUser");
const CRightUser_1 = require("../controler/CRightUser");
const CPlacardUser_1 = require("../controler/CPlacardUser");
const CSite_1 = require("../controler/CSite");
const siteAuth = new Router();
function siteRoute(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.get('/site/admin', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('siteEndLogin');
        }));
        router.post('/site/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.body;
            const captcha = ctx.session.captcha;
            if (captcha === params.securityCode) {
                return passport.authenticate('site', (err, user, info, status) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        ctx.login(user);
                        yield CUserSite_1.CUserSite.updateLoginTime({ id: user.id, time: utils_1.now() });
                        ctx.body = new utils_1.MsgRes(true, '登录成功！', user);
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
        router.get('/site/logined', (ctx) => __awaiter(this, void 0, void 0, function* () {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Site) {
                ctx.body = new utils_1.MsgRes(true);
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        }));
        router.use('/site/auth/*', (ctx, next) => {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Site) {
                return next();
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        });
        siteAuth.get('/admin/info/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.findById(ctx.params.id));
        }));
        siteAuth.post('/adminInfo/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.updateInfo(ctx.request.body));
        }));
        siteAuth.post('/compare/pass', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let body = ctx.request.body;
            let password = body.password;
            ctx.body = new utils_1.MsgRes(true, '', utils_1.comparePass(password, ctx.state.user.password));
        }));
        siteAuth.post('/change/pass', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.changePass(Object.assign({ id: ctx.state.user.id }, ctx.request.body)));
        }));
        siteAuth.get('/product/types', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.getAll());
        }));
        siteAuth.get('/product/type/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.findByName(ctx.params.name));
        }));
        siteAuth.post('/product/type/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.add(ctx.request.body));
        }));
        siteAuth.post('/product/type/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.update(ctx.request.body));
        }));
        siteAuth.get('/products', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.getAll());
        }));
        siteAuth.get('/product/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.findByName(ctx.params.name));
        }));
        siteAuth.post('/product/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.add(ctx.request.body));
        }));
        siteAuth.post('/product/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.update(ctx.request.body));
        }));
        siteAuth.get('/product/remove/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.delById(ctx.params.id));
        }));
        siteAuth.get('/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.show());
        }));
        siteAuth.get('/admin/roles', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.allRoles());
        }));
        siteAuth.post('/role/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.saveOne(ctx.request.body));
        }));
        siteAuth.post('/role/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.update(ctx.request.body));
        }));
        siteAuth.get('/role/remove/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.delById(ctx.params.id));
        }));
        siteAuth.get('/admins', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.allAdmins());
        }));
        siteAuth.get('/:username/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.findByUsername(ctx.params.username));
        }));
        siteAuth.post('/admin/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.save(ctx.request.body));
        }));
        siteAuth.post('/admin/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.update(ctx.request.body));
        }));
        siteAuth.get('/admin/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.delById(ctx.params.id));
        }));
        siteAuth.get('/user/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.show());
        }));
        siteAuth.get('/user/roles', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUser_1.CRoleUser.allRoles());
        }));
        siteAuth.post('/user/role/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUser_1.CRoleUser.update(ctx.request.body));
        }));
        siteAuth.get('/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.getAll());
        }));
        siteAuth.post('/placard/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.user = yield CUserSite_1.CUserSite.findById(ctx.state.user.id);
            ;
            info.site = yield CSite_1.CSite.findById(ctx.state.site.id);
            ;
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.add(info));
        }));
        siteAuth.post('/placard/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.update(ctx.request.body));
        }));
        siteAuth.get('/placard/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.delById(ctx.params.id));
        }));
        router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
    });
}
exports.siteRoute = siteRoute;
//# sourceMappingURL=site.js.map