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
const CProductTypeSite_1 = require("../controler/CProductTypeSite");
const CProductSite_1 = require("../controler/CProductSite");
const CRoleUser_1 = require("../controler/CRoleUser");
const CRightUser_1 = require("../controler/CRightUser");
const CPlacardUser_1 = require("../controler/CPlacardUser");
const CSite_1 = require("../controler/CSite");
const CFeedbackUserSite_1 = require("../controler/CFeedbackUserSite");
const CUser_1 = require("../controler/CUser");
const CFeedbackUser_1 = require("../controler/CFeedbackUser");
const Recharge_1 = require("../entity/Recharge");
const CRechargeCode_1 = require("../controler/CRechargeCode");
const CRecharge_1 = require("../controler/CRecharge");
const Withdraw_1 = require("../entity/Withdraw");
const CWithdraw_1 = require("../controler/CWithdraw");
const CProductField_1 = require("../controler/CProductField");
const COrderUser_1 = require("../controler/COrderUser");
const RightSite_1 = require("../entity/RightSite");
const RoleUserSite_1 = require("../entity/RoleUserSite");
const siteAuth = new Router();
function siteRoute(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.post('/site/login', (ctx) => __awaiter(this, void 0, void 0, function* () {
            const params = ctx.request.body;
            const captcha = ctx.session.captcha;
            if (captcha === params.securityCode) {
                return passport.authenticate('site', (err, user, info, status) => __awaiter(this, void 0, void 0, function* () {
                    if (user) {
                        ctx.login(user);
                        yield CUserSite_1.CUserSite.updateLoginTime({ id: user.id, time: utils_1.now() });
                        let productRights = yield CProductTypeSite_1.CProductTypeSite.productsRight(user.site.id);
                        let rights = yield RightSite_1.RightSite.findTrees();
                        let treeRights = user.role.treeRights(productRights.concat(rights));
                        ctx.body = new utils_1.MsgRes(true, '登录成功！', { user: user, rights: treeRights });
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
        router.get('/site/logined', (ctx) => {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Site) {
                ctx.body = new utils_1.MsgRes(true);
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        });
        router.use('/site/auth/*', (ctx, next) => {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Site) {
                return next();
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作！');
            }
        });
        siteAuth.get('/logout', (ctx) => {
            ctx.logout();
            ctx.body = new utils_1.MsgRes(true, '退出登录');
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
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.changePass(Object.assign({ user: ctx.state.user }, ctx.request.body)));
        }));
        siteAuth.get('/orders/:productId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.siteOrdersByProductId(ctx.params.productId, ctx.state.user.site.id));
        }));
        siteAuth.get('/recharge/code', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = {
                type: Recharge_1.RechargeType.Site,
                userSite: ctx.state.user,
                site: ctx.state.user.site,
            };
            ctx.body = new utils_1.MsgRes(true, '', yield CRechargeCode_1.CRechargeCode.getOne(info));
        }));
        siteAuth.post('/alipayId/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.findByAlipayId(ctx.request.body));
        }));
        siteAuth.post('/recharge/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            let userSite = ctx.state.user;
            let params = {
                alipayId: info.alipayId,
                type: Recharge_1.RechargeType.Site,
                way: Recharge_1.RechargeWay.Hand,
                user: null,
                userSite: userSite,
                site: userSite.site
            };
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.addOrRecharge(params));
        }));
        siteAuth.get('/recharge/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.siteAll(ctx.state.user.site.id));
        }));
        siteAuth.get('/user/funds', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', ctx.state.user.site.funds);
        }));
        siteAuth.post('/withdraw/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            let userSite = ctx.state.user;
            let params = {
                alipayCount: info.alipayCount,
                alipayName: info.alipayName,
                funds: info.funds,
                type: Withdraw_1.WithdrawType.Site,
                user: undefined,
                userSite: userSite,
                site: userSite.site
            };
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.add(params));
        }));
        siteAuth.get('/withdraw/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.siteAll(ctx.state.user.site.id));
        }));
        siteAuth.get('/product/types', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.getAll(ctx.state.user.site.id));
        }));
        siteAuth.post('/product/type/set/onsale', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let type = yield CProductTypeSite_1.CProductTypeSite.setOnSale(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());
            ctx.body = new utils_1.MsgRes(true, '', null);
        }));
        siteAuth.get('/product/type/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.findByName(ctx.params.name));
        }));
        siteAuth.post('/product/type/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.add(ctx.request.body, ctx.state.user.site, ctx.io));
        }));
        siteAuth.post('/product/type/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let type = yield CProductTypeSite_1.CProductTypeSite.update(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());
            ctx.body = new utils_1.MsgRes(true, '', null);
        }));
        siteAuth.get('/products', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.getAll(ctx.state.user.site.id));
        }));
        siteAuth.post('/product/set/onsale', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let product = yield CProductSite_1.CProductSite.setOnSale(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
            ctx.body = new utils_1.MsgRes(true, '', null);
        }));
        siteAuth.get('/:typeId/product/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.findByNameAndTypeId(ctx.params.typeId, ctx.params.name));
        }));
        siteAuth.get('/product/fields', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductField_1.CProductField.getAll());
        }));
        siteAuth.get('/prototype/of/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.getPrototypeById(ctx.params.id));
        }));
        siteAuth.post('/product/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.add(ctx.request.body, ctx.state.user.site, ctx.io));
        }));
        siteAuth.post('/product/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let product = yield CProductSite_1.CProductSite.update(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
            ctx.body = new utils_1.MsgRes(true, '', product);
        }));
        siteAuth.post('/product/update/platform', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.updatePlatform(ctx.request.body));
        }));
        siteAuth.get('/role/view/rights', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let productRights = yield CProductTypeSite_1.CProductTypeSite.productsRight(ctx.state.user.site.id);
            let rights = yield RightSite_1.RightSite.findTrees();
            ctx.body = new utils_1.MsgRes(true, '', productRights.concat(rights));
        }));
        siteAuth.get('/admin/roles', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.allRoles(ctx.state.user.site.id));
        }));
        siteAuth.get('/role/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.findByName(ctx.params.name));
        }));
        siteAuth.post('/role/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.saveOne(ctx.request.body, ctx.state.user.site));
        }));
        siteAuth.post('/role/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.update(ctx.request.body));
        }));
        siteAuth.get('/role/remove/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.delById(ctx.params.id));
        }));
        siteAuth.get('/admins', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.allAdmins(ctx.state.user.site.id));
        }));
        siteAuth.get('/admin/:username/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.findByUsername(ctx.params.username));
        }));
        siteAuth.post('/admin/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.save(ctx.request.body, ctx.state.user.site));
        }));
        siteAuth.post('/admin/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.update(ctx.request.body));
        }));
        siteAuth.get('/admin/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.delById(ctx.params.id));
        }));
        siteAuth.get('/user/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.show());
        }));
        siteAuth.get('/user/roles', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUser_1.CRoleUser.allRoles(ctx.state.user.site.id));
        }));
        siteAuth.post('/user/role/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUser_1.CRoleUser.update(ctx.request.body));
        }));
        siteAuth.get('/users', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.siteAll(ctx.state.user.site.id));
        }));
        siteAuth.get('/user/:username/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.findByNameAndSiteId(ctx.params.username, ctx.state.user.site.id));
        }));
        siteAuth.post('/user/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.role = yield CRoleUser_1.CRoleUser.findById(info.role);
            info.site = ctx.state.user.site;
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.save(info));
        }));
        siteAuth.post('/user/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.update(ctx.request.body));
        }));
        siteAuth.get('/user/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.delById(ctx.params.id));
        }));
        siteAuth.get('/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.getSiteAll(ctx.state.user.site.id));
        }));
        siteAuth.post('/placard/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let user = ctx.state.user;
            let info = ctx.request.body;
            info.user = user;
            info.site = user.site;
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.add(info));
        }));
        siteAuth.post('/placard/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.update(ctx.request.body));
        }));
        siteAuth.get('/placard/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.delById(ctx.params.id));
        }));
        siteAuth.get('/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.getSiteAll(ctx.state.user.site.id));
        }));
        siteAuth.post('/feedback/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let user = ctx.state.user;
            let info = ctx.request.body;
            info.user = user;
            info.site = user.site;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.add(info));
        }));
        siteAuth.post('/feedback/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.update(ctx.request.body));
        }));
        siteAuth.get('/feedback/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.delById(ctx.params.id));
        }));
        siteAuth.get('/user/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.siteGetAll(ctx.state.user.site.id));
        }));
        siteAuth.post('/user/feedback/deal', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.dealTime = utils_1.now();
            info.dealUser = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.deal(info));
        }));
        siteAuth.get('/site/info', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.findById(ctx.state.user.site.id));
        }));
        siteAuth.post('/site/info/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.updateInfo(ctx.request.body));
        }));
        router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
    });
}
exports.siteRoute = siteRoute;
//# sourceMappingURL=site.js.map