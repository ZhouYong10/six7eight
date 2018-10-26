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
const passport = require("passport");
const debuger = require("debug");
const utils_1 = require("../utils");
const UserBase_1 = require("../entity/UserBase");
const CRightAdmin_1 = require("../controler/CRightAdmin");
const CRoleUserAdmin_1 = require("../controler/CRoleUserAdmin");
const CUserAdmin_1 = require("../controler/CUserAdmin");
const CSite_1 = require("../controler/CSite");
const CRightSite_1 = require("../controler/CRightSite");
const CRightUser_1 = require("../controler/CRightUser");
const CProductTypes_1 = require("../controler/CProductTypes");
const CProduct_1 = require("../controler/CProduct");
const CFeedbackUserSite_1 = require("../controler/CFeedbackUserSite");
const CFeedbackUser_1 = require("../controler/CFeedbackUser");
const CPlacardUser_1 = require("../controler/CPlacardUser");
const CPlacardUserSite_1 = require("../controler/CPlacardUserSite");
const CUser_1 = require("../controler/CUser");
const CRecharge_1 = require("../controler/CRecharge");
const CWithdraw_1 = require("../controler/CWithdraw");
const debug = (info, msg) => {
    const debug = debuger('six7eight:route_platform');
    debug(JSON.stringify(info) + '  ' + msg);
};
const platformAuth = new Router();
function platformRoute(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.post('/platform/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.body;
            const captcha = ctx.session.captcha;
            if (captcha === params.securityCode) {
                return passport.authenticate('platform', (err, user, info, status) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        ctx.login(user);
                        yield CUserAdmin_1.CUserAdmin.updateLoginTime({ id: user.id, time: utils_1.now() });
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
        router.get('/platform/logined', (ctx) => {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Platform) {
                ctx.body = new utils_1.MsgRes(true);
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        });
        router.use('/platform/auth/*', (ctx, next) => {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Platform) {
                return next();
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        });
        platformAuth.get('/logout', (ctx) => {
            ctx.logout();
            ctx.body = new utils_1.MsgRes(true, '退出登录');
        });
        platformAuth.get('/admin/info/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.findById(ctx.params.id));
        }));
        platformAuth.post('/adminInfo/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.updateInfo(ctx.request.body));
        }));
        platformAuth.post('/compare/pass', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let body = ctx.request.body;
            let password = body.password;
            ctx.body = new utils_1.MsgRes(true, '', utils_1.comparePass(password, ctx.state.user.password));
        }));
        platformAuth.post('/change/pass', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.changePass(Object.assign({ user: ctx.state.user }, ctx.request.body)));
        }));
        platformAuth.get('/recharge/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.all());
        }));
        platformAuth.post('/hand/recharge', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.handRecharge(ctx.request.body));
        }));
        platformAuth.post('/hand/recharge/fail', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.handRechargeFail(ctx.request.body));
        }));
        platformAuth.get('/withdraw/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.all());
        }));
        platformAuth.get('/hand/withdraw/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.handWithdraw(ctx.params.id));
        }));
        platformAuth.get('/product/types', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.getAll());
        }));
        platformAuth.get('/product/type/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.findByName(ctx.params.name));
        }));
        platformAuth.post('/product/type/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.add(ctx.request.body));
        }));
        platformAuth.post('/product/type/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.update(ctx.request.body));
        }));
        platformAuth.get('/products', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.getAll());
        }));
        platformAuth.get('/product/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.findByName(ctx.params.name));
        }));
        platformAuth.post('/product/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.add(ctx.request.body));
        }));
        platformAuth.post('/product/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.update(ctx.request.body));
        }));
        platformAuth.get('/product/remove/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.delById(ctx.params.id));
        }));
        platformAuth.get('/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.getAll());
        }));
        platformAuth.post('/placard/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.user = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.add(info));
        }));
        platformAuth.post('/placard/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.update(ctx.request.body));
        }));
        platformAuth.get('/placard/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.delById(ctx.params.id));
        }));
        platformAuth.get('/sites/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.getAll());
        }));
        platformAuth.get('/site/placard/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.delById(ctx.params.id));
        }));
        platformAuth.get('/sites', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.all());
        }));
        platformAuth.post('/site/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.add(ctx.request.body));
        }));
        platformAuth.post('/site/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.update(ctx.request.body));
        }));
        platformAuth.get('/users', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.all());
        }));
        platformAuth.post('/user/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.platformUpdate(ctx.request.body));
        }));
        platformAuth.get('/site/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.getAll());
        }));
        platformAuth.post('/site/feedback/deal', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.dealTime = utils_1.now();
            info.dealUser = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.deal(info));
        }));
        platformAuth.get('/site/user/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.getAll());
        }));
        platformAuth.post('/site/user/feedback/deal', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.dealTime = utils_1.now();
            info.dealUser = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.deal(info));
        }));
        platformAuth.get('/admins', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.allAdmins());
        }));
        platformAuth.get('/:username/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.findByUsername(ctx.params.username));
        }));
        platformAuth.post('/admin/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.save(ctx.request.body));
        }));
        platformAuth.post('/admin/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.update(ctx.request.body));
        }));
        platformAuth.get('/admin/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.delById(ctx.params.id));
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
        platformAuth.get('/site/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.show());
        }));
        platformAuth.post('/site/right/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.save(ctx.request.body));
        }));
        platformAuth.post('/site/right/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.update(ctx.request.body));
        }));
        platformAuth.get('/site/right/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.del(ctx.params.id));
        }));
        platformAuth.get('/user/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.show());
        }));
        platformAuth.post('/user/right/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.save(ctx.request.body));
        }));
        platformAuth.post('/user/right/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.update(ctx.request.body));
        }));
        platformAuth.get('/user/right/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.del(ctx.params.id));
        }));
        router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
    });
}
exports.platformRoute = platformRoute;
//# sourceMappingURL=platform.js.map