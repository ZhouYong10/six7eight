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
const CErrorOrderUser_1 = require("../controler/CErrorOrderUser");
const CPlacardUserSite_1 = require("../controler/CPlacardUserSite");
const Platform_1 = require("../entity/Platform");
const FundsRecordSite_1 = require("../entity/FundsRecordSite");
const Site_1 = require("../entity/Site");
const MessageUserSite_1 = require("../entity/MessageUserSite");
const siteAuth = new Router();
function siteRoute(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.post('/site/login', passport.authenticate('site'), (ctx, some) => __awaiter(this, void 0, void 0, function* () {
            let user = ctx.state.user;
            user.lastLoginTime = utils_1.now();
            user = yield user.save();
            let productRights = yield CProductTypeSite_1.CProductTypeSite.productsRight(user.site.id);
            let rights = yield RightSite_1.RightSite.findTrees();
            let menus = user.role.treeRights(productRights.concat(rights));
            yield utils_1.siteGetMenuWaitCount(menus, user.site.id, user.role.products);
            ctx.body = new utils_1.MsgRes(true, '登录成功！', {
                userId: user.id,
                username: user.username,
                userState: user.state,
                roleId: user.role.id,
                roleType: user.role.type,
                roleName: user.role.name,
                permissions: user.role.rights,
                menus: menus,
                magProducts: user.role.products,
                siteId: user.site.id,
                siteName: user.site.name,
                funds: user.site.funds,
                freezeFunds: user.site.freezeFunds,
                messageNum: yield MessageUserSite_1.MessageUserSite.getWaitCount(user.id),
            });
        }));
        router.get('/site/logined', (ctx) => {
            let user = ctx.state.user;
            if (ctx.isAuthenticated() && user.type === UserBase_1.UserType.Site) {
                let site = user.site;
                if (site.getState === Site_1.SiteState.Ban) {
                    ctx.logout();
                    ctx.body = new utils_1.MsgRes(false, '当前站点已被禁用了！');
                }
                else {
                    ctx.body = new utils_1.MsgRes(true);
                }
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
        siteAuth.get('/platform/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.getPlacardsOf(ctx.state.user.site.id));
        }));
        siteAuth.get('/load/user/messages', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield MessageUserSite_1.MessageUserSite.loadMessages(ctx.state.user.id));
        }));
        siteAuth.get('/delete/message/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield MessageUserSite_1.MessageUserSite.delete(ctx.params.id));
        }));
        siteAuth.get('/logout', (ctx) => {
            ctx.logout();
            ctx.body = new utils_1.MsgRes(true, '退出登录');
        });
        siteAuth.get('/admin/info/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.findById(ctx.params.id));
        }));
        siteAuth.post('/adminInfo/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.updateContact(ctx.request.body));
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
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.findSiteOrdersByProductId(ctx.params.productId, ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.post('/order/execute', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.execute(ctx.request.body, ctx.io));
        }));
        siteAuth.post('/order/refund', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.refund(ctx.request.body, ctx.io));
        }));
        siteAuth.get('/all/order/errors', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CErrorOrderUser_1.CErrorOrderUser.siteAll(ctx.state.user.role.products, ctx.query));
        }));
        siteAuth.post('/order/deal/error', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CErrorOrderUser_1.CErrorOrderUser.dealError(ctx.request.body, ctx.state.user, ctx.io));
        }));
        siteAuth.post('/deal/error/order/refund', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CErrorOrderUser_1.CErrorOrderUser.dealErrorOrderRefund(ctx.request.body, ctx.state.user, ctx.io));
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
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.addOrRecharge(params, ctx.io));
        }));
        siteAuth.get('/recharge/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.siteAll(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.get('/recharge/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.findById(ctx.params.id));
        }));
        siteAuth.get('/all/funds/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield FundsRecordSite_1.FundsRecordSite.allOf(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.get('/all/profit/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield FundsRecordSite_1.FundsRecordSite.allProfitOf(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.get('/user/funds', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', ctx.state.user.site.funds);
        }));
        siteAuth.get('/get/withdraw/min/and/site/funds', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let platform = yield Platform_1.Platform.find();
            let user = ctx.state.user;
            let site = user.site;
            ctx.body = new utils_1.MsgRes(true, '', {
                minWithdraw: platform.siteWithdrawMin,
                siteState: site.state,
                userState: user.state,
                siteFunds: site.funds
            });
        }));
        siteAuth.post('/withdraw/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            let user = ctx.state.user;
            let site = user.site;
            utils_1.assert(site.state === Site_1.SiteState.Normal, '当前站点已被' + site.state + ',无法提现');
            utils_1.assert(user.state === UserBase_1.UserState.Normal, '您的账户已被' + user.state + ',无法提现');
            let params = {
                alipayCount: info.alipayCount,
                alipayName: info.alipayName,
                funds: parseFloat(info.funds),
                type: Withdraw_1.WithdrawType.Site,
                user: undefined,
                userSite: user,
                site: site
            };
            utils_1.assert(params.alipayCount, '请输入提现支付宝账户');
            utils_1.assert(params.alipayName, '请输入提现支付宝账户实名');
            let platform = yield Platform_1.Platform.find();
            utils_1.assert(params.funds >= platform.siteWithdrawMin, '最少' + platform.siteWithdrawMin + '元起提');
            utils_1.assert(site.funds >= params.funds, '站点可提现金额不足，当前可提现金额为：' + site.funds + '元');
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.add(params, ctx.io));
        }));
        siteAuth.get('/withdraw/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.siteAll(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.get('/product/types', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.getAll(ctx.state.user.role.productTypes));
        }));
        siteAuth.post('/product/type/set/onsale', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let type = yield CProductTypeSite_1.CProductTypeSite.setOnSale(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());
            io.emit(site.id + 'updateType', type);
            ctx.body = new utils_1.MsgRes(true, '', null);
        }));
        siteAuth.get('/product/type/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.findByName(ctx.params.name));
        }));
        siteAuth.post('/product/type/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypeSite_1.CProductTypeSite.add(ctx.request.body, ctx.state.user, ctx.io));
        }));
        siteAuth.post('/product/type/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let type = yield CProductTypeSite_1.CProductTypeSite.update(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());
            io.emit(site.id + 'updateType', type);
            ctx.body = new utils_1.MsgRes(true, '', null);
        }));
        siteAuth.get('/products', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.getAll(ctx.state.user.role.products));
        }));
        siteAuth.post('/product/set/onsale', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let product = yield CProductSite_1.CProductSite.setOnSale(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
            io.emit(site.id + 'updateProduct', product);
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
            ctx.body = new utils_1.MsgRes(true, '', yield CProductSite_1.CProductSite.add(ctx.request.body, ctx.state.user, ctx.io));
        }));
        siteAuth.post('/product/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let product = yield CProductSite_1.CProductSite.update(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
            io.emit(site.id + 'updateProduct', product);
            ctx.body = new utils_1.MsgRes(true, '', product);
        }));
        siteAuth.post('/product/update/platform', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let product = yield CProductSite_1.CProductSite.updatePlatform(ctx.request.body);
            let io = ctx.io;
            let site = ctx.state.user.site;
            io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
            io.emit(site.id + 'updateProduct', product);
            ctx.body = new utils_1.MsgRes(true, '', null);
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
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.update(ctx.request.body, ctx.io));
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
        siteAuth.get('/admin/roles/type/user', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserSite_1.CRoleUserSite.typeUserRoles(ctx.state.user.site.id));
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
        siteAuth.post('/admin/change/role', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.changeRole(ctx.request.body, ctx.io));
        }));
        siteAuth.post('/admin/change/state', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserSite_1.RoleUserSiteType.Site) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.changeState(ctx.request.body, ctx.io));
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
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUser_1.CRoleUser.update(ctx.request.body, ctx.io));
        }));
        siteAuth.get('/users', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.siteAll(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.get('/user/:username/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.findByName(ctx.params.username));
        }));
        siteAuth.post('/user/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.role = yield CRoleUser_1.CRoleUser.findById(info.role);
            info.site = ctx.state.user.site;
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.save(info));
        }));
        siteAuth.get('/user/:id/reset/password', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.resetPassword(ctx.params.id));
        }));
        siteAuth.post('/user/change/state', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.changeState(ctx.request.body, ctx.io));
        }));
        siteAuth.post('/user/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.updateOtherContact(ctx.request.body, ctx.io));
        }));
        siteAuth.post('/user/add/remark', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.addUserSiteRemark(ctx.request.body, ctx.state.user));
        }));
        siteAuth.get('/user/:userId/remarks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.loadRemarksByUserSite(ctx.params.userId, ctx.state.user.id));
        }));
        siteAuth.get('/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.getSiteAll(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.post('/placard/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let user = ctx.state.user;
            let info = ctx.request.body;
            info.user = user;
            info.site = user.site;
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.add(info, ctx.io));
        }));
        siteAuth.post('/placard/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.siteId = ctx.state.user.site.id;
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.update(info, ctx.io));
        }));
        siteAuth.get('/placard/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.delById(ctx.params.id));
        }));
        siteAuth.get('/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.getSiteAll(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.get('/feedback/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.getById(ctx.params.id));
        }));
        siteAuth.post('/feedback/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let user = ctx.state.user;
            let info = ctx.request.body;
            info.user = user;
            info.site = user.site;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.add(info, ctx.io));
        }));
        siteAuth.post('/feedback/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.update(ctx.request.body));
        }));
        siteAuth.get('/feedback/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.delById(ctx.params.id));
        }));
        siteAuth.get('/user/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.siteGetAll(ctx.state.user.site.id, ctx.query));
        }));
        siteAuth.post('/user/feedback/deal', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.dealTime = utils_1.now();
            info.dealUserSite = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.deal(info, ctx.io));
        }));
        siteAuth.get('/site/info', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.findById(ctx.state.user.site.id));
        }));
        siteAuth.post('/site/info/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.updateInfo(ctx.request.body, ctx.io));
        }));
        router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
    });
}
exports.siteRoute = siteRoute;
//# sourceMappingURL=site.js.map