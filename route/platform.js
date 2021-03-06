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
const CUserSite_1 = require("../controler/CUserSite");
const CProductField_1 = require("../controler/CProductField");
const COrderUser_1 = require("../controler/COrderUser");
const RightAdmin_1 = require("../entity/RightAdmin");
const RoleUserAdmin_1 = require("../entity/RoleUserAdmin");
const CErrorOrderUser_1 = require("../controler/CErrorOrderUser");
const Platform_1 = require("../entity/Platform");
const FundsRecordPlatform_1 = require("../entity/FundsRecordPlatform");
const FundsRecordUser_1 = require("../entity/FundsRecordUser");
const FundsRecordSite_1 = require("../entity/FundsRecordSite");
const fs = require("fs");
const request_other_1 = require("../request-other");
const MessageUserSite_1 = require("../entity/MessageUserSite");
const MessageUser_1 = require("../entity/MessageUser");
const debug = (info, msg) => {
    const debug = debuger('six7eight:route_platform');
    debug(JSON.stringify(info) + '  ' + msg);
};
const platformAuth = new Router();
function platformRoute(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.post('/platform/login', passport.authenticate('platform'), (ctx) => __awaiter(this, void 0, void 0, function* () {
            let platform = yield Platform_1.Platform.find();
            let user = ctx.state.user;
            user.lastLoginTime = utils_1.now();
            user = yield user.save();
            let productMenus = yield CProductTypes_1.CProductTypes.productsRight();
            let rightMenus = yield RightAdmin_1.RightAdmin.findTrees();
            let menus = user.role.treeRights(productMenus.concat(rightMenus));
            yield utils_1.platformGetMenuWaitCount(menus, user.role.products);
            ctx.body = new utils_1.MsgRes(true, '登录成功！', {
                userId: user.id,
                username: user.username,
                userState: user.state,
                roleId: user.role.id,
                roleType: user.role.type,
                roleName: user.role.name,
                menus: menus,
                permissions: user.role.rights,
                magProducts: user.role.products,
                platformName: platform.name,
                baseFunds: platform.baseFunds,
                profit: platform.allProfit,
            });
        }));
        router.use('/platform/auth/*', (ctx, next) => {
            if (ctx.isAuthenticated() && ctx.state.user.type === UserBase_1.UserType.Platform) {
                return next();
            }
            else {
                ctx.body = new utils_1.MsgRes(false, '请登录后操作!!-platform');
            }
        });
        platformAuth.get('/clear/datas/:day/days/ago', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let day = ctx.params.day;
            CRecharge_1.CRecharge.clear(day).then(() => {
                console.log("清除" + day + "天前的充值记录完成");
            });
            CWithdraw_1.CWithdraw.clear(day).then(() => {
                console.log("清除" + day + "天前的提现记录完成");
            });
            COrderUser_1.COrderUser.clear(day).then(() => {
                console.log("清除" + day + "天前的订单记录完成");
            });
            CFeedbackUser_1.CFeedbackUser.clear(day).then(() => {
                console.log("清除" + day + "天前的用户反馈记录完成");
            });
            CFeedbackUserSite_1.CFeedbackUserSite.clear(day).then(() => {
                console.log("清除" + day + "天前的分站反馈记录完成");
            });
            FundsRecordPlatform_1.FundsRecordPlatform.clearFundsRecordPlatform(day).then(() => {
                console.log("清除" + day + "天前的平台资金收支记录完成");
            });
            FundsRecordSite_1.FundsRecordSite.clearFundsRecordSite(day).then(() => {
                console.log("清除" + day + "天前的分站资金收支记录完成");
            });
            FundsRecordUser_1.FundsRecordUser.clearFundsRecordUser(day).then(() => {
                console.log("清除" + day + "天前的用户资金收支记录完成");
            });
            MessageUserSite_1.MessageUserSite.clearMessageUserSite(day).then(() => {
                console.log("清除" + day + "天前的分站消息记录完成");
            });
            MessageUser_1.MessageUser.clearMessageUser(day).then(() => {
                console.log("清除" + day + "天前的用户消息记录完成");
            });
            CPlacardUser_1.CPlacardUser.clear(day).then(() => {
                console.log("清除" + day + "天前的分站公告记录完成");
            });
            CPlacardUserSite_1.CPlacardUserSite.clear(day).then(() => {
                console.log("清除" + day + "天前的平台公告记录完成");
            });
            ctx.body = new utils_1.MsgRes(true, '', '');
        }));
        platformAuth.get('/refresh/menus', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let platform = yield Platform_1.Platform.find();
            let user = ctx.state.user;
            let productMenus = yield CProductTypes_1.CProductTypes.productsRight();
            let rightMenus = yield RightAdmin_1.RightAdmin.findTrees();
            let menus = user.role.treeRights(productMenus.concat(rightMenus));
            yield utils_1.platformGetMenuWaitCount(menus, user.role.products);
            ctx.body = new utils_1.MsgRes(true, '', {
                userId: user.id,
                username: user.username,
                userState: user.state,
                roleId: user.role.id,
                roleType: user.role.type,
                roleName: user.role.name,
                menus: menus,
                permissions: user.role.rights,
                magProducts: user.role.products,
                platformName: platform.name,
                baseFunds: platform.baseFunds,
                profit: platform.allProfit,
            });
        }));
        platformAuth.get('/get/total/statistics/data', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let day = utils_1.today();
            let { normal, freeze, ban } = yield CUser_1.CUser.getAllStatusInfo();
            let { funds, freezeFunds } = yield CUser_1.CUser.getAllFunds();
            let orderInfo = yield COrderUser_1.COrderUser.statisticsOrderPlatform(day);
            let { platDayBaseFunds, platDayProfit } = yield FundsRecordPlatform_1.FundsRecordPlatform.dayBaseFundsAndProfit(day);
            let userNum = yield CUser_1.CUser.platNewUserOfDay(day);
            let upRoleNum = yield FundsRecordUser_1.FundsRecordUser.platUpRoleOfDay(day);
            let { rechargeFunds } = yield CRecharge_1.CRecharge.platRechargeOfDay(day);
            let { withdrawFunds } = yield CWithdraw_1.CWithdraw.platWithdrawOfDay(day);
            let { platTotalFunds, platRealTotalFunds, siteTotalFunds, siteRealTotalFunds } = yield COrderUser_1.COrderUser.statisticsOrderFundsPlat(day);
            let { siteDayBaseFunds, siteDayProfit } = yield FundsRecordSite_1.FundsRecordSite.dayBaseFundsAndProfit(day);
            let sites = yield CSite_1.CSite.statisticsSites();
            ctx.body = new utils_1.MsgRes(true, '', {
                funds: funds,
                freezeFunds: freezeFunds,
                normal: normal,
                freeze: freeze,
                ban: ban,
                orderInfo: orderInfo,
                platDayBaseFunds: platDayBaseFunds,
                platDayProfit: platDayProfit,
                platDayUser: userNum,
                platDayUserUpRole: upRoleNum,
                platDayRecharge: rechargeFunds || 0,
                platDayWithdraw: withdrawFunds || 0,
                platDayOrderFunds: platTotalFunds,
                platDayOrderExecuteFunds: platRealTotalFunds,
                siteDayOrderFunds: siteTotalFunds,
                siteDayOrderExecuteFunds: siteRealTotalFunds,
                platDaySiteBaseFunds: siteDayBaseFunds,
                platDaySiteProfit: siteDayProfit,
                sites: sites,
            });
        }));
        platformAuth.get('/get/total/funds/users/info', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let { normal, freeze, ban } = yield CUser_1.CUser.getAllStatusInfo();
            let { funds, freezeFunds } = yield CUser_1.CUser.getAllFunds();
            ctx.body = new utils_1.MsgRes(true, '', {
                funds: funds,
                freezeFunds: freezeFunds,
                normal: normal,
                freeze: freeze,
                ban: ban,
            });
        }));
        platformAuth.get('/get/order/count/data/:date', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.statisticsOrderPlatform(ctx.params.date));
        }));
        platformAuth.get('/load/platform/statistics/base/info/:date', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let { platDayBaseFunds, platDayProfit } = yield FundsRecordPlatform_1.FundsRecordPlatform.dayBaseFundsAndProfit(ctx.params.date);
            let userNum = yield CUser_1.CUser.platNewUserOfDay(ctx.params.date);
            let upRoleNum = yield FundsRecordUser_1.FundsRecordUser.platUpRoleOfDay(ctx.params.date);
            let { rechargeFunds } = yield CRecharge_1.CRecharge.platRechargeOfDay(ctx.params.date);
            let { withdrawFunds } = yield CWithdraw_1.CWithdraw.platWithdrawOfDay(ctx.params.date);
            let { platTotalFunds, platRealTotalFunds, siteTotalFunds, siteRealTotalFunds } = yield COrderUser_1.COrderUser.statisticsOrderFundsPlat(ctx.params.date);
            let { siteDayBaseFunds, siteDayProfit } = yield FundsRecordSite_1.FundsRecordSite.dayBaseFundsAndProfit(ctx.params.date);
            ctx.body = new utils_1.MsgRes(true, '', {
                platDayBaseFunds: platDayBaseFunds,
                platDayProfit: platDayProfit,
                platDayUser: userNum,
                platDayUserUpRole: upRoleNum,
                platDayRecharge: rechargeFunds || 0,
                platDayWithdraw: withdrawFunds || 0,
                platDayOrderFunds: platTotalFunds,
                platDayOrderExecuteFunds: platRealTotalFunds,
                siteDayOrderFunds: siteTotalFunds,
                siteDayOrderExecuteFunds: siteRealTotalFunds,
                platDaySiteBaseFunds: siteDayBaseFunds,
                platDaySiteProfit: siteDayProfit,
            });
        }));
        platformAuth.get('/statistics/of/sites', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.statisticsSites());
        }));
        platformAuth.get('/get/statistics/of/site/:siteId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let siteId = ctx.params.siteId;
            let day = utils_1.today();
            let { funds, freezeFunds } = yield CUser_1.CUser.getAllFundsOfSite(siteId);
            let { normal, freeze, ban } = yield CUser_1.CUser.getAllStatusInfoOfSite(siteId);
            let orderInfo = yield COrderUser_1.COrderUser.statisticsOrderSite(siteId, day);
            let { siteDayBaseFunds, siteDayProfit } = yield FundsRecordSite_1.FundsRecordSite.dayBaseFundsAndProfitOfSite(siteId, day);
            let userNum = yield CUser_1.CUser.siteNewUserOfDay(siteId, day);
            let upRoleNum = yield FundsRecordUser_1.FundsRecordUser.siteUpRoleOfDay(siteId, day);
            let { platTotalFunds, platRealTotalFunds, siteTotalFunds, siteRealTotalFunds } = yield COrderUser_1.COrderUser.statisticsOrderFundsSite(siteId, day);
            ctx.body = new utils_1.MsgRes(true, '', {
                funds: funds || 0,
                freezeFunds: freezeFunds || 0,
                normal: normal,
                freeze: freeze,
                ban: ban,
                orderInfo: orderInfo,
                siteDayBaseFunds: siteDayBaseFunds,
                siteDayProfit: siteDayProfit,
                siteDayUser: userNum,
                siteDayUserUpRole: upRoleNum,
                siteDayOrderFunds: siteTotalFunds,
                siteDayOrderExecuteFunds: siteRealTotalFunds,
                platDayOrderFunds: platTotalFunds,
                platDayOrderExecuteFunds: platRealTotalFunds,
            });
        }));
        platformAuth.get('/get/total/funds/users/info/of/:siteId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let siteId = ctx.params.siteId;
            let { funds, freezeFunds } = yield CUser_1.CUser.getAllFundsOfSite(siteId);
            let { normal, freeze, ban } = yield CUser_1.CUser.getAllStatusInfoOfSite(siteId);
            ctx.body = new utils_1.MsgRes(true, '', {
                funds: funds || 0,
                freezeFunds: freezeFunds || 0,
                normal: normal,
                freeze: freeze,
                ban: ban,
            });
        }));
        platformAuth.get('/load/site/:siteId/statistics/base/info/:day', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let siteId = ctx.params.siteId;
            let day = ctx.params.day;
            let { siteDayBaseFunds, siteDayProfit } = yield FundsRecordSite_1.FundsRecordSite.dayBaseFundsAndProfitOfSite(siteId, day);
            let userNum = yield CUser_1.CUser.siteNewUserOfDay(siteId, day);
            let upRoleNum = yield FundsRecordUser_1.FundsRecordUser.siteUpRoleOfDay(siteId, day);
            let { platTotalFunds, platRealTotalFunds, siteTotalFunds, siteRealTotalFunds } = yield COrderUser_1.COrderUser.statisticsOrderFundsSite(siteId, day);
            ctx.body = new utils_1.MsgRes(true, '', {
                siteDayBaseFunds: siteDayBaseFunds,
                siteDayProfit: siteDayProfit,
                siteDayUser: userNum,
                siteDayUserUpRole: upRoleNum,
                siteDayOrderFunds: siteTotalFunds,
                siteDayOrderExecuteFunds: siteRealTotalFunds,
                platDayOrderFunds: platTotalFunds,
                platDayOrderExecuteFunds: platRealTotalFunds,
            });
        }));
        platformAuth.get('/get/order/count/data/of/:siteId/:day', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.statisticsOrderSite(ctx.params.siteId, ctx.params.day));
        }));
        platformAuth.get('/all/funds/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield FundsRecordPlatform_1.FundsRecordPlatform.all(ctx.query));
        }));
        platformAuth.get('/logout', (ctx) => {
            ctx.logout();
            ctx.body = new utils_1.MsgRes(true, '退出登录');
        });
        platformAuth.get('/admin/info/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.findById(ctx.params.id));
        }));
        platformAuth.post('/adminInfo/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.updateContact(ctx.request.body));
        }));
        platformAuth.post('/compare/pass', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let body = ctx.request.body;
            let password = body.password;
            ctx.body = new utils_1.MsgRes(true, '', utils_1.comparePass(password, ctx.state.user.password));
        }));
        platformAuth.post('/change/pass', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.changePass(Object.assign({ user: ctx.state.user }, ctx.request.body)));
        }));
        platformAuth.get('/orders/:productId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.findPlatformOrdersByProductId(ctx.params.productId, ctx.query));
        }));
        platformAuth.post('/order/execute', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.execute(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/order/account/of/:orderId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.handleAccount(ctx.params.orderId, ctx.io));
        }));
        platformAuth.post('/order/refund', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.backout(ctx.request.body, ctx.io));
        }));
        platformAuth.post('/order/get/douYinFans/num', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield request_other_1.getDouYinFansNum(ctx.request.body.douYinUrl));
        }));
        platformAuth.post('/order/get/douYinLike/num', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield request_other_1.getDouYinLikeNum(ctx.request.body.douYinUrl));
        }));
        platformAuth.post('/order/get/douYinComment/num', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield request_other_1.getDouYinCommentNum(ctx.request.body.douYinUrl));
        }));
        platformAuth.post('/order/get/douYinForward/num', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield request_other_1.getDouYinForwardNum(ctx.request.body.douYinUrl));
        }));
        platformAuth.post('/order/get/douYinPlay/num', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield request_other_1.getDouYinPlayNum(ctx.request.body.douYinUrl));
        }));
        platformAuth.get('/all/order/errors', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CErrorOrderUser_1.CErrorOrderUser.platformAll(ctx.state.user.role.products, ctx.query));
        }));
        platformAuth.post('/order/deal/error', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CErrorOrderUser_1.CErrorOrderUser.dealError(ctx.request.body, ctx.state.user, ctx.io));
        }));
        platformAuth.get('/get/order/info/of/:orderId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield COrderUser_1.COrderUser.findById(ctx.params.orderId));
        }));
        platformAuth.post('/deal/error/order/refund', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CErrorOrderUser_1.CErrorOrderUser.dealErrorOrderRefund(ctx.request.body, ctx.state.user, ctx.io));
        }));
        platformAuth.post('/deal/error/order/account', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CErrorOrderUser_1.CErrorOrderUser.dealErrorOrderAccount(ctx.request.body, ctx.state.user, ctx.io));
        }));
        platformAuth.get('/recharge/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.all(ctx.query));
        }));
        platformAuth.post('/hand/recharge', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.handRecharge(ctx.request.body, ctx.io));
        }));
        platformAuth.post('/hand/recharge/fail', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRecharge_1.CRecharge.handRechargeFail(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/withdraw/records', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.all(ctx.query));
        }));
        platformAuth.get('/hand/withdraw/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.handWithdraw(ctx.params.id, ctx.io));
        }));
        platformAuth.post('/hand/withdraw/fail', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CWithdraw_1.CWithdraw.handWithdrawFail(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/product/fields', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductField_1.CProductField.getAll());
        }));
        platformAuth.get('/product/field/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductField_1.CProductField.findByName(ctx.params.name));
        }));
        platformAuth.post('/product/field/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductField_1.CProductField.add(ctx.request.body, ctx.io));
        }));
        platformAuth.post('/product/field/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductField_1.CProductField.update(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/product/field/remove/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductField_1.CProductField.delById(ctx.params.id));
        }));
        platformAuth.get('/product/types', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.getAll(ctx.state.user.role.productTypes));
        }));
        platformAuth.post('/product/type/set/onsale', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.setOnSale(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/product/type/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.findByName(ctx.params.name));
        }));
        platformAuth.post('/product/type/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.add(ctx.request.body, ctx.state.user, ctx.io));
        }));
        platformAuth.post('/product/type/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProductTypes_1.CProductTypes.update(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/products', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.getAll(ctx.state.user.role.products));
        }));
        platformAuth.get('/products/of/:typeId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.getByTypeId(ctx.state.user.role.products, ctx.params.typeId));
        }));
        platformAuth.post('/product/set/onsale', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.setOnSale(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/:typeId/product/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.findByNameAndTypeId(ctx.params.typeId, ctx.params.name));
        }));
        platformAuth.post('/product/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.add(ctx.request.body, ctx.state.user, ctx.io));
        }));
        platformAuth.post('/product/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CProduct_1.CProduct.update(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/sites/all', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.allSites());
        }));
        platformAuth.get('/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.getAll(ctx.query));
        }));
        platformAuth.post('/placard/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.user = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.add(info, ctx.io));
        }));
        platformAuth.post('/placard/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.update(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/placard/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUserSite_1.CPlacardUserSite.delById(ctx.params.id));
        }));
        platformAuth.get('/sites/placards', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.getAll(ctx.query));
        }));
        platformAuth.get('/site/placard/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CPlacardUser_1.CPlacardUser.delById(ctx.params.id));
        }));
        platformAuth.get('/sites', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.all(ctx.query));
        }));
        platformAuth.get('/site/:siteId/admins', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.allAdmins(ctx.params.siteId));
        }));
        platformAuth.get('/site/user/:userId/reset/password', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.resetPassword(ctx.params.userId));
        }));
        platformAuth.get('/site/:siteId/funds/records/:type', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield FundsRecordSite_1.FundsRecordSite.allOf(ctx.params.siteId, ctx.query, ctx.params.type));
        }));
        platformAuth.post('/site/admin/username/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserSite_1.CUserSite.findByUsername(ctx.request.body.username));
        }));
        platformAuth.post('/site/name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.findByName(ctx.request.body.name));
        }));
        platformAuth.post('/site/address/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.findByAddress(info.address));
        }));
        platformAuth.post('/site/add', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.add(ctx.request.body));
        }));
        platformAuth.post('/site/change/state', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.changeState(ctx.request.body, ctx.io));
        }));
        platformAuth.post('/site/change/funds', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.changeFunds(ctx.request.body, ctx.io));
        }));
        platformAuth.post('/site/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CSite_1.CSite.update(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/users', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.all(ctx.query));
        }));
        platformAuth.get('/search/user/by/:userId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.searchByUserId(ctx.params.userId));
        }));
        platformAuth.post('/search/user/by/username', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.searchByUsername(ctx.request.body.username, ctx.query));
        }));
        platformAuth.get('/lower/user/of/:parentId', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.lowerUserOf(ctx.params.parentId, ctx.query));
        }));
        platformAuth.post('/get/parent/user/by/username', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.getParentUserPlat(ctx.request.body.username));
        }));
        platformAuth.get('/user/:userId/funds/records/:type', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield FundsRecordUser_1.FundsRecordUser.findByUserId(ctx.params.userId, ctx.query, ctx.params.type));
        }));
        platformAuth.post('/user/change/funds', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.changeFunds(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/user/:id/reset/password', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.resetPassword(ctx.params.id));
        }));
        platformAuth.post('/user/change/state', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.changeState(ctx.request.body, ctx.io));
        }));
        platformAuth.post('/user/add/remark', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.addUserAdminRemark(ctx.request.body, ctx.state.user));
        }));
        platformAuth.get('/user/:userId/remarks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUser_1.CUser.loadRemarksByUserAdmin(ctx.params.userId, ctx.state.user.id));
        }));
        platformAuth.get('/site/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.getAll(ctx.query));
        }));
        platformAuth.post('/site/feedback/deal', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.dealTime = utils_1.now();
            info.dealUser = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUserSite_1.CFeedbackUserSite.deal(info, ctx.io));
        }));
        platformAuth.get('/site/user/feedbacks', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.getAll(ctx.query));
        }));
        platformAuth.post('/site/user/feedback/deal', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            info.dealTime = utils_1.now();
            info.dealUserAdmin = ctx.state.user;
            ctx.body = new utils_1.MsgRes(true, '', yield CFeedbackUser_1.CFeedbackUser.deal(info, ctx.io));
        }));
        platformAuth.get('/admins', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.allAdmins());
        }));
        platformAuth.get('/admin/roles/type/user', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.typeUserRoles());
        }));
        platformAuth.post('/admin/username/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.findByUsername(ctx.request.body.username));
        }));
        platformAuth.post('/admin/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.save(ctx.request.body));
        }));
        platformAuth.post('/admin/change/role', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.changeRole(ctx.request.body, ctx.io));
        }));
        platformAuth.post('/admin/change/state', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.changeState(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/admin/del/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CUserAdmin_1.CUserAdmin.delById(ctx.params.id));
        }));
        platformAuth.get('/role/view/rights', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let productRights = yield CProductTypes_1.CProductTypes.productsRight();
            let rights = yield RightAdmin_1.RightAdmin.findTrees();
            ctx.body = new utils_1.MsgRes(true, '', productRights.concat(rights));
        }));
        platformAuth.get('/admin/roles', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.allRoles());
        }));
        platformAuth.get('/role/:name/exist', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.findByName(ctx.params.name));
        }));
        platformAuth.post('/role/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.saveOne(ctx.request.body));
        }));
        platformAuth.post('/role/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.update(ctx.request.body, ctx.io));
        }));
        platformAuth.get('/role/remove/:id', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let roleType = ctx.state.user.role.type;
            if (roleType !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                throw new Error('您没有该项操作的权限！');
            }
            ctx.body = new utils_1.MsgRes(true, '', yield CRoleUserAdmin_1.CRoleUserAdmin.delById(ctx.params.id));
        }));
        platformAuth.get('/platform/info', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield Platform_1.Platform.find());
        }));
        platformAuth.post('/platform/info/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            let id = info.id;
            delete info.id;
            let io = ctx.io;
            io.emit('changePlatformInfo', {
                canRegister: info.canRegister,
                canAddUser: info.canAddUser,
            });
            io.emit('changePlatformName', info.name);
            ctx.body = new utils_1.MsgRes(true, '', yield Platform_1.Platform.update(id, info));
        }));
        platformAuth.get('/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.show());
        }));
        platformAuth.post('/right/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.add(ctx.request.body));
        }));
        platformAuth.post('/right/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.update(ctx.request.body));
        }));
        platformAuth.post('/platform/right/change/sort', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightAdmin_1.CRightAdmin.changeRightSort(ctx.request.body));
        }));
        platformAuth.get('/site/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.show());
        }));
        platformAuth.post('/site/right/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.add(ctx.request.body));
        }));
        platformAuth.post('/site/right/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.update(ctx.request.body));
        }));
        platformAuth.post('/site/right/change/sort', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightSite_1.CRightSite.changeRightSort(ctx.request.body));
        }));
        platformAuth.get('/user/right/show', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.show());
        }));
        platformAuth.post('/user/right/save', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.add(ctx.request.body));
        }));
        platformAuth.post('/user/right/update', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.update(ctx.request.body));
        }));
        platformAuth.post('/user/right/change/sort', (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx.body = new utils_1.MsgRes(true, '', yield CRightUser_1.CRightUser.changeRightSort(ctx.request.body));
        }));
        platformAuth.get('/load/user/document', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let userDoc = fs.readFileSync(__dirname + '/../public/userDoc.html', { encoding: 'utf-8' });
            ctx.body = new utils_1.MsgRes(true, '', userDoc);
        }));
        platformAuth.get('/load/site/document', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let siteDoc = fs.readFileSync(__dirname + '/../public/siteDoc.html', { encoding: 'utf-8' });
            ctx.body = new utils_1.MsgRes(true, '', siteDoc);
        }));
        platformAuth.post('/save/user/document', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            fs.writeFileSync(__dirname + '/../public/userDoc.html', info.userDoc);
            ctx.body = new utils_1.MsgRes(true, '', true);
        }));
        platformAuth.post('/save/site/document', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            fs.writeFileSync(__dirname + '/../public/siteDoc.html', info.siteDoc);
            ctx.body = new utils_1.MsgRes(true, '', true);
        }));
        router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
    });
}
exports.platformRoute = platformRoute;
//# sourceMappingURL=platform.js.map