import * as Router from "koa-router";
import * as passport from "passport";
import * as debuger from "debug";
import {comparePass, MsgRes, now, platformGetMenuWaitCount, today} from "../utils";
import {UserType} from "../entity/UserBase";
import {CRightAdmin} from "../controler/CRightAdmin";
import {CRoleUserAdmin} from "../controler/CRoleUserAdmin";
import {CUserAdmin} from "../controler/CUserAdmin";
import {CSite} from "../controler/CSite";
import {CRightSite} from "../controler/CRightSite";
import {CRightUser} from "../controler/CRightUser";
import {CProductTypes} from "../controler/CProductTypes";
import {CProduct} from "../controler/CProduct";
import {CFeedbackUserSite} from "../controler/CFeedbackUserSite";
import {CFeedbackUser} from "../controler/CFeedbackUser";
import {CPlacardUser} from "../controler/CPlacardUser";
import {CPlacardUserSite} from "../controler/CPlacardUserSite";
import {CUser} from "../controler/CUser";
import {CRecharge} from "../controler/CRecharge";
import {CWithdraw} from "../controler/CWithdraw";
import {CUserSite} from "../controler/CUserSite";
import {CProductField} from "../controler/CProductField";
import {COrderUser} from "../controler/COrderUser";
import {RightAdmin} from "../entity/RightAdmin";
import {RoleUserAdminType} from "../entity/RoleUserAdmin";
import {CErrorOrderUser} from "../controler/CErrorOrderUser";
import {Platform} from "../entity/Platform";
import {FundsRecordPlatform} from "../entity/FundsRecordPlatform";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import * as fs from "fs";
import {
    getDouYinCommentNum,
    getDouYinFansNum,
    getDouYinForwardNum,
    getDouYinLikeNum,
    getDouYinPlayNum
} from "../request-other";
import {MessageUserSite} from "../entity/MessageUserSite";
import {MessageUser} from "../entity/MessageUser";

const debug = (info: any, msg?: string) => {
    const debug = debuger('six7eight:route_platform');
    debug(JSON.stringify(info) + '  ' + msg);
};
const platformAuth = new Router();

export async function platformRoute(router: Router) {

    /* 登录入口 */
    router.post('/platform/login', passport.authenticate('platform'), async (ctx) => {
        let platform = <Platform>await Platform.find();
        let user = ctx.state.user;
        user.lastLoginTime = now();
        user = await user.save();
        let productMenus = await CProductTypes.productsRight();
        let rightMenus = await RightAdmin.findTrees();
        let menus = user.role.treeRights(productMenus.concat(rightMenus));
        await platformGetMenuWaitCount(menus, user.role.products);
        ctx.body = new MsgRes(true, '登录成功！', {
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
    });

    /* 拦截需要登录的所有路由 */
    router.use('/platform/auth/*', (ctx, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Platform) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作!!-platform');
        }
    });

    platformAuth.get('/clear/datas/:day/days/ago', async (ctx) => {
        let day: number = ctx.params.day;
        CRecharge.clear(day).then(() => {
            console.log("清除" + day + "天前的充值记录完成");
        });
        CWithdraw.clear(day).then(() => {
            console.log("清除" + day + "天前的提现记录完成");
        });
        COrderUser.clear(day).then(() => {
            console.log("清除" + day + "天前的订单记录完成");
        });

        CFeedbackUser.clear(day).then(() => {
            console.log("清除" + day + "天前的用户反馈记录完成");
        });
        CFeedbackUserSite.clear(day).then(() => {
            console.log("清除" + day + "天前的分站反馈记录完成");
        });
        FundsRecordPlatform.clearFundsRecordPlatform(day).then(() => {
            console.log("清除" + day + "天前的平台资金收支记录完成");
        });
        FundsRecordSite.clearFundsRecordSite(day).then(() => {
            console.log("清除" + day + "天前的分站资金收支记录完成");
        });
        FundsRecordUser.clearFundsRecordUser(day).then(() => {
            console.log("清除" + day + "天前的用户资金收支记录完成");
        });
        MessageUserSite.clearMessageUserSite(day).then(() => {
            console.log("清除" + day + "天前的分站消息记录完成");
        });
        MessageUser.clearMessageUser(day).then(() => {
            console.log("清除" + day + "天前的用户消息记录完成");
        });
        CPlacardUser.clear(day).then(() => {
            console.log("清除" + day + "天前的分站公告记录完成");
        });
        CPlacardUserSite.clear(day).then(() => {
            console.log("清除" + day + "天前的平台公告记录完成");
        });

        ctx.body = new MsgRes(true, '', '');
    });

    /* 刷新侧边导航栏菜单 */
    platformAuth.get('/refresh/menus', async (ctx) => {
        let platform = <Platform>await Platform.find();
        let user = ctx.state.user;
        let productMenus = await CProductTypes.productsRight();
        let rightMenus = await RightAdmin.findTrees();
        let menus = user.role.treeRights(productMenus.concat(rightMenus));
        await platformGetMenuWaitCount(menus, user.role.products);
        ctx.body = new MsgRes(true, '', {
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
    });

    /* 获取平台今天所有的统计数据 */
    platformAuth.get('/get/total/statistics/data', async (ctx) => {
        let day = today();
        let {normal, freeze, ban} = await CUser.getAllStatusInfo();
        let {funds, freezeFunds} = await CUser.getAllFunds();
        let orderInfo = await COrderUser.statisticsOrderPlatform(day);
        let {platDayBaseFunds, platDayProfit} = await FundsRecordPlatform.dayBaseFundsAndProfit(day);
        let userNum = await CUser.platNewUserOfDay(day);
        let upRoleNum = await FundsRecordUser.platUpRoleOfDay(day);
        let {rechargeFunds} = await CRecharge.platRechargeOfDay(day);
        let {withdrawFunds} = await CWithdraw.platWithdrawOfDay(day);
        let {platTotalFunds, platRealTotalFunds, siteTotalFunds, siteRealTotalFunds} =
            await COrderUser.statisticsOrderFundsPlat(day);
        let {siteDayBaseFunds, siteDayProfit} = await FundsRecordSite.dayBaseFundsAndProfit(day);
        let sites = await CSite.statisticsSites();

        ctx.body = new MsgRes(true, '', {
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
        })
    });

    /* 获取平台总金额和平台用户信息 */
    platformAuth.get('/get/total/funds/users/info', async (ctx) => {
        let {normal, freeze, ban} = await CUser.getAllStatusInfo();
        let {funds, freezeFunds} = await CUser.getAllFunds();
        ctx.body = new MsgRes(true, '', {
            funds: funds,
            freezeFunds: freezeFunds,
            normal: normal,
            freeze: freeze,
            ban: ban,
        });
    });

    /* 获取平台业务订单统计信息 */
    platformAuth.get('/get/order/count/data/:date', async (ctx) => {
        ctx.body = new MsgRes(true, '', await COrderUser.statisticsOrderPlatform(ctx.params.date));
    });

    /* 获取平台基础统计信息 */
    platformAuth.get('/load/platform/statistics/base/info/:date', async (ctx) => {
        let {platDayBaseFunds, platDayProfit} = await FundsRecordPlatform.dayBaseFundsAndProfit(ctx.params.date);
        let userNum = await CUser.platNewUserOfDay(ctx.params.date);
        let upRoleNum = await FundsRecordUser.platUpRoleOfDay(ctx.params.date);
        let {rechargeFunds} = await CRecharge.platRechargeOfDay(ctx.params.date);
        let {withdrawFunds} = await CWithdraw.platWithdrawOfDay(ctx.params.date);
        let {platTotalFunds, platRealTotalFunds, siteTotalFunds, siteRealTotalFunds} =
            await COrderUser.statisticsOrderFundsPlat(ctx.params.date);
        let {siteDayBaseFunds, siteDayProfit} = await FundsRecordSite.dayBaseFundsAndProfit(ctx.params.date);

        ctx.body = new MsgRes(true, '', {
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
    });

    platformAuth.get('/statistics/of/sites', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.statisticsSites());
    });

    /* 获取指定分站当前日期的所有统计信息 */
    platformAuth.get('/get/statistics/of/site/:siteId', async (ctx) => {
        let siteId = ctx.params.siteId;
        let day = today();
        let {funds, freezeFunds} = await CUser.getAllFundsOfSite(siteId);
        let {normal, freeze, ban} = await CUser.getAllStatusInfoOfSite(siteId);
        let orderInfo = await COrderUser.statisticsOrderSite(siteId, day);
        let {siteDayBaseFunds, siteDayProfit} = await FundsRecordSite.dayBaseFundsAndProfitOfSite(siteId, day);
        let userNum = await CUser.siteNewUserOfDay(siteId, day);
        let upRoleNum = await FundsRecordUser.siteUpRoleOfDay(siteId, day);
        let {
            platTotalFunds, platRealTotalFunds,
            siteTotalFunds, siteRealTotalFunds
        } = await COrderUser.statisticsOrderFundsSite(siteId, day);
        ctx.body = new MsgRes(true, '', {
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
        })
    });

    /* 获取指定分站的基础统计数据 */
    platformAuth.get('/get/total/funds/users/info/of/:siteId', async (ctx) => {
        let siteId = ctx.params.siteId;
        let {funds, freezeFunds} = await CUser.getAllFundsOfSite(siteId);
        let {normal, freeze, ban} = await CUser.getAllStatusInfoOfSite(siteId);
        ctx.body = new MsgRes(true, '', {
            funds: funds || 0,
            freezeFunds: freezeFunds || 0,
            normal: normal,
            freeze: freeze,
            ban: ban,
        });
    });

    /* 获取指定分站指定日期的历史基础统计数据 */
    platformAuth.get('/load/site/:siteId/statistics/base/info/:day', async (ctx) => {
        let siteId = ctx.params.siteId;
        let day = ctx.params.day;
        let {siteDayBaseFunds, siteDayProfit} = await FundsRecordSite.dayBaseFundsAndProfitOfSite(siteId, day);
        let userNum = await CUser.siteNewUserOfDay(siteId, day);
        let upRoleNum = await FundsRecordUser.siteUpRoleOfDay(siteId, day);
        let {
            platTotalFunds, platRealTotalFunds,
            siteTotalFunds, siteRealTotalFunds
        } = await COrderUser.statisticsOrderFundsSite(siteId, day);

        ctx.body = new MsgRes(true, '', {
            siteDayBaseFunds: siteDayBaseFunds,
            siteDayProfit: siteDayProfit,
            siteDayUser: userNum,
            siteDayUserUpRole: upRoleNum,
            siteDayOrderFunds: siteTotalFunds,
            siteDayOrderExecuteFunds: siteRealTotalFunds,
            platDayOrderFunds: platTotalFunds,
            platDayOrderExecuteFunds: platRealTotalFunds,
        });
    });

    /* 获取指定分站指定日期的订单统计信息 */
    platformAuth.get('/get/order/count/data/of/:siteId/:day', async (ctx) => {
        ctx.body = new MsgRes(true, '',
            await COrderUser.statisticsOrderSite(ctx.params.siteId, ctx.params.day));
    });

    /* 获取所有利润记录 */
    platformAuth.get('/all/funds/records', async (ctx) => {
        ctx.body = new MsgRes(true, '', await FundsRecordPlatform.all(ctx.query));
    });

    /* 退出登录 */
    platformAuth.get('/logout', (ctx) => {
        ctx.logout();
        ctx.body = new MsgRes(true, '退出登录');
    });

    /* 管理员信息 */
    platformAuth.get('/admin/info/:id', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.findById(ctx.params.id));
    });

    platformAuth.post('/adminInfo/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.updateContact(ctx.request.body));
    });

    platformAuth.post('/compare/pass', async (ctx) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    platformAuth.post('/change/pass', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.changePass({
            user: ctx.state.user,
            ...ctx.request.body
        }));
    });

    /* 订单管理 */
    platformAuth.get('/orders/:productId', async (ctx) => {
        ctx.body = new MsgRes(true, '', await COrderUser.findPlatformOrdersByProductId(ctx.params.productId, ctx.query));
    });

    platformAuth.post('/order/execute', async (ctx) => {
        ctx.body = new MsgRes(true, '', await COrderUser.execute(ctx.request.body, (ctx as any).io))
    });

    platformAuth.get('/order/account/of/:orderId', async (ctx) => {
        ctx.body = new MsgRes(true, '', await COrderUser.handleAccount(ctx.params.orderId, (ctx as any).io));
    });

    platformAuth.post('/order/refund', async (ctx) => {
        ctx.body = new MsgRes(true, '', await COrderUser.backout(ctx.request.body, (ctx as any).io));
    });
    // 获取抖音订单的初始量
    platformAuth.post('/order/get/douYinFans/num', async (ctx) => {
        ctx.body = new MsgRes(true, '', await getDouYinFansNum((ctx.request.body as any).douYinUrl));
    });
    platformAuth.post('/order/get/douYinLike/num', async (ctx) => {
        ctx.body = new MsgRes(true, '', await getDouYinLikeNum((ctx.request.body as any).douYinUrl));
    });
    platformAuth.post('/order/get/douYinComment/num', async (ctx) => {
        ctx.body = new MsgRes(true, '', await getDouYinCommentNum((ctx.request.body as any).douYinUrl));
    });
    platformAuth.post('/order/get/douYinForward/num', async (ctx) => {
        ctx.body = new MsgRes(true, '', await getDouYinForwardNum((ctx.request.body as any).douYinUrl));
    });
    platformAuth.post('/order/get/douYinPlay/num', async (ctx) => {
        ctx.body = new MsgRes(true, '', await getDouYinPlayNum((ctx.request.body as any).douYinUrl));
    });

    /* 订单报错管理 */
    platformAuth.get('/all/order/errors', async (ctx) => {
        ctx.body = new MsgRes(true, '',
            await CErrorOrderUser.platformAll(ctx.state.user.role.products, ctx.query));
    });

    platformAuth.post('/order/deal/error', async (ctx) => {
        ctx.body = new MsgRes(true, '',
            await CErrorOrderUser.dealError(ctx.request.body, ctx.state.user, (ctx as any).io));
    });

    platformAuth.get('/get/order/info/of/:orderId', async (ctx) => {
        ctx.body = new MsgRes(true, '',
            await COrderUser.findById(ctx.params.orderId));
    });

    platformAuth.post('/deal/error/order/refund', async (ctx) => {
        ctx.body = new MsgRes(true, '',
            await CErrorOrderUser.dealErrorOrderRefund(ctx.request.body, ctx.state.user, (ctx as any).io))
    });

    platformAuth.post('/deal/error/order/account', async (ctx) => {
        ctx.body = new MsgRes(true, '',
            await CErrorOrderUser.dealErrorOrderAccount(ctx.request.body, ctx.state.user, (ctx as any).io))
    });

    /* 资金管理 */
    // 充值记录
    platformAuth.get('/recharge/records', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRecharge.all(ctx.query));
    });

    platformAuth.post('/hand/recharge', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRecharge.handRecharge(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/hand/recharge/fail', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRecharge.handRechargeFail(ctx.request.body, (ctx as any).io));
    });

    // 提现记录
    platformAuth.get('/withdraw/records', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.all(ctx.query));
    });

    platformAuth.get('/hand/withdraw/:id', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.handWithdraw(ctx.params.id, (ctx as any).io));
    });

    platformAuth.post('/hand/withdraw/fail', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.handWithdrawFail(ctx.request.body, (ctx as any).io));
    });

    /* 商品字段管理 */
    platformAuth.get('/product/fields', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductField.getAll());
    });

    platformAuth.get('/product/field/:name/exist', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductField.findByName(ctx.params.name));
    });

    platformAuth.post('/product/field/add', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductField.add(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/product/field/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductField.update(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/product/field/remove/:id', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductField.delById(ctx.params.id));
    });

    /* 商品类别管理 */
    platformAuth.get('/product/types', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.getAll(ctx.state.user.role.productTypes));
    });

    platformAuth.post('/product/type/set/onsale', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.setOnSale(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/product/type/:name/exist', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.findByName(ctx.params.name));
    });

    platformAuth.post('/product/type/add', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.add(ctx.request.body, ctx.state.user, (ctx as any).io));
    });

    platformAuth.post('/product/type/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProductTypes.update(ctx.request.body, (ctx as any).io));
    });

    /* 商品管理 */
    platformAuth.get('/products', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProduct.getAll(ctx.state.user.role.products));
    });

    platformAuth.get('/products/of/:typeId', async (ctx) => {
        ctx.body = new MsgRes(true, '',
            await CProduct.getByTypeId(ctx.state.user.role.products, ctx.params.typeId));
    });

    platformAuth.post('/product/set/onsale', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProduct.setOnSale(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/:typeId/product/:name/exist', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProduct.findByNameAndTypeId(ctx.params.typeId, ctx.params.name));
    });

    platformAuth.post('/product/add', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProduct.add(ctx.request.body, ctx.state.user, (ctx as any).io));
    });

    platformAuth.post('/product/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CProduct.update(ctx.request.body, (ctx as any).io));
    });

    /* 发送给分站管理员及分站用户的公告管理 */
    platformAuth.get('/sites/all', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.allSites());
    });

    platformAuth.get('/placards', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.getAll(ctx.query));
    });

    platformAuth.post('/placard/add', async (ctx) => {
        let info: any = ctx.request.body;
        info.user = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.add(info, (ctx as any).io));
    });

    platformAuth.post('/placard/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.update(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/placard/del/:id', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CPlacardUserSite.delById(ctx.params.id));
    });

    /* 分站发布的公告管理 */
    platformAuth.get('/sites/placards', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.getAll(ctx.query));
    });

    platformAuth.get('/site/placard/del/:id', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.delById(ctx.params.id));
    });

    /* 站点管理 */
    platformAuth.get('/sites', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.all(ctx.query));
    });

    platformAuth.get('/site/:siteId/admins', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserSite.allAdmins(ctx.params.siteId));
    });

    platformAuth.get('/site/user/:userId/reset/password', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserSite.resetPassword(ctx.params.userId));
    });

    platformAuth.get('/site/:siteId/funds/records/:type', async (ctx) => {
        ctx.body = new MsgRes(true, '', await FundsRecordSite.allOf(ctx.params.siteId, ctx.query, ctx.params.type))
    });

    platformAuth.post('/site/admin/username/exist', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findByUsername((ctx.request.body as any).username))
    });

    platformAuth.post('/site/name/exist', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.findByName((ctx.request.body as any).name));
    });

    platformAuth.post('/site/address/exist', async (ctx) => {
        let info: any = ctx.request.body;
        ctx.body = new MsgRes(true, '', await CSite.findByAddress(info.address));
    });

    platformAuth.post('/site/add', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.add(ctx.request.body));
    });

    platformAuth.post('/site/change/state', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.changeState(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/site/change/funds', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.changeFunds(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/site/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CSite.update(ctx.request.body, (ctx as any).io));
    });

    /* 用户管理 */
    platformAuth.get('/users', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.all(ctx.query));
    });

    platformAuth.get('/search/user/by/:userId', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.searchByUserId(ctx.params.userId));
    });

    platformAuth.post('/search/user/by/username', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.searchByUsername((ctx.request.body as any).username, ctx.query));
    });

    platformAuth.get('/lower/user/of/:parentId', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.lowerUserOf(ctx.params.parentId, ctx.query));
    });

    platformAuth.post('/get/parent/user/by/username', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.getParentUserPlat((ctx.request.body as any).username))
    });

    platformAuth.get('/user/:userId/funds/records/:type', async (ctx) => {
        ctx.body = new MsgRes(true, '', await FundsRecordUser.findByUserId(ctx.params.userId, ctx.query, ctx.params.type));
    });

    platformAuth.post('/user/change/funds', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.changeFunds(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/user/:id/reset/password', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.resetPassword(ctx.params.id));
    });

    platformAuth.post('/user/change/state', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.changeState(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/user/add/remark', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.addUserAdminRemark(ctx.request.body, ctx.state.user));
    });

    platformAuth.get('/user/:userId/remarks', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUser.loadRemarksByUserAdmin(ctx.params.userId, ctx.state.user.id));
    });

    /* 处理分站问题反馈 */
    platformAuth.get('/site/feedbacks', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.getAll(ctx.query));
    });

    platformAuth.post('/site/feedback/deal', async (ctx) => {
        let info: any = ctx.request.body;
        info.dealTime = now();
        info.dealUser = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.deal(info, (ctx as any).io));
    });

    /* 处理分站用户问题反馈 */
    platformAuth.get('/site/user/feedbacks', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.getAll(ctx.query));
    });

    platformAuth.post('/site/user/feedback/deal', async (ctx) => {
        let info: any = ctx.request.body;
        info.dealTime = now();
        info.dealUserAdmin = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.deal(info, (ctx as any).io));
    });

    /* 平台管理员操作 */
    platformAuth.get('/admins', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.allAdmins());
    });

    platformAuth.get('/admin/roles/type/user', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.typeUserRoles());
    });

    platformAuth.post('/admin/username/exist', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CUserAdmin.findByUsername((ctx.request.body as any).username));
    });

    platformAuth.post('/admin/save', async (ctx) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.save(ctx.request.body));
    });

    platformAuth.post('/admin/change/role', async (ctx) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.changeRole(ctx.request.body, (ctx as any).io));
    });

    platformAuth.post('/admin/change/state', async (ctx) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.changeState(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/admin/del/:id', async (ctx) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserAdmin.delById(ctx.params.id));
    });

    /* 平台管理员角色操作 */
    platformAuth.get('/role/view/rights', async (ctx) => {
        let productRights = await CProductTypes.productsRight();
        let rights = await RightAdmin.findTrees();
        ctx.body = new MsgRes(true, '', productRights.concat(rights));
    });

    platformAuth.get('/admin/roles', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.allRoles());
    });

    platformAuth.get('/role/:name/exist', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.findByName(ctx.params.name));
    });

    platformAuth.post('/role/save', async (ctx) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.saveOne(ctx.request.body));
    });

    platformAuth.post('/role/update', async (ctx) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.update(ctx.request.body, (ctx as any).io));
    });

    platformAuth.get('/role/remove/:id', async (ctx) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserAdminType.Developer) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserAdmin.delById(ctx.params.id));
    });

    /* 平台基础信息管理 */
    platformAuth.get('/platform/info', async (ctx) => {
        ctx.body = new MsgRes(true, '', await Platform.find());
    });

    platformAuth.post('/platform/info/update', async (ctx) => {
        let info: any = ctx.request.body;
        let id = info.id;
        delete info.id;

        let io = (ctx as any).io;
        io.emit('changePlatformInfo', {
            canRegister: info.canRegister,
            canAddUser: info.canAddUser,
        });
        io.emit('changePlatformName', info.name);
        ctx.body = new MsgRes(true, '', await Platform.update(id, info));
    });

    /* 平台管理员权限操作 */
    platformAuth.get('/right/show', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.show());
    });

    platformAuth.post('/right/save', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.add(ctx.request.body));
    });

    platformAuth.post('/right/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.update(ctx.request.body));
    });

    platformAuth.post('/platform/right/change/sort', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightAdmin.changeRightSort(ctx.request.body))
    });

    /* 站点管理员权限操作 */
    platformAuth.get('/site/right/show', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightSite.show());
    });

    platformAuth.post('/site/right/save', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightSite.add(ctx.request.body));
    });

    platformAuth.post('/site/right/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightSite.update(ctx.request.body));
    });

    platformAuth.post('/site/right/change/sort', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightSite.changeRightSort(ctx.request.body))
    });

    /* 站点用户权限操作 */
    platformAuth.get('/user/right/show', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightUser.show());
    });

    platformAuth.post('/user/right/save', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightUser.add(ctx.request.body));
    });

    platformAuth.post('/user/right/update', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightUser.update(ctx.request.body));
    });

    platformAuth.post('/user/right/change/sort', async (ctx) => {
        ctx.body = new MsgRes(true, '', await CRightUser.changeRightSort(ctx.request.body))
    });

    /* 编辑前端用户和分站管理员教程 */
    platformAuth.get('/load/user/document', async (ctx) => {
        let userDoc = fs.readFileSync(__dirname + '/../public/userDoc.html', {encoding: 'utf-8'});
        ctx.body = new MsgRes(true, '', userDoc);
    });

    platformAuth.get('/load/site/document', async (ctx) => {
        let siteDoc = fs.readFileSync(__dirname + '/../public/siteDoc.html', {encoding: 'utf-8'});
        ctx.body = new MsgRes(true, '', siteDoc);
    });

    platformAuth.post('/save/user/document', async (ctx) => {
        let info:any = ctx.request.body;
        fs.writeFileSync(__dirname + '/../public/userDoc.html', info.userDoc);
        ctx.body = new MsgRes(true, '', true);
    });

    platformAuth.post('/save/site/document', async (ctx) => {
        let info:any = ctx.request.body;
        fs.writeFileSync(__dirname + '/../public/siteDoc.html', info.siteDoc);
        ctx.body = new MsgRes(true, '', true);
    });

    router.use('/platform/auth', platformAuth.routes(), platformAuth.allowedMethods());
}