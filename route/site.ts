import * as Router from "koa-router";
import {Context} from "koa";
import {assert, comparePass, MsgRes, now, siteGetMenuWaitCount, today} from "../utils";
import {UserState, UserType} from "../entity/UserBase";
import * as passport from "passport";
import {CUserSite} from "../controler/CUserSite";
import {CRoleUserSite} from "../controler/CRoleUserSite";
import {CProductTypeSite} from "../controler/CProductTypeSite";
import {CProductSite} from "../controler/CProductSite";
import {CRoleUser} from "../controler/CRoleUser";
import {CRightUser} from "../controler/CRightUser";
import {CPlacardUser} from "../controler/CPlacardUser";
import {CSite} from "../controler/CSite";
import {CFeedbackUserSite} from "../controler/CFeedbackUserSite";
import {CUser} from "../controler/CUser";
import {CFeedbackUser} from "../controler/CFeedbackUser";
import {RechargeType, RechargeWay} from "../entity/Recharge";
import {CRechargeCode} from "../controler/CRechargeCode";
import {CRecharge} from "../controler/CRecharge";
import {WithdrawType} from "../entity/Withdraw";
import {CWithdraw} from "../controler/CWithdraw";
import {CProductField} from "../controler/CProductField";
import {COrderUser} from "../controler/COrderUser";
import {RightSite} from "../entity/RightSite";
import {RoleUserSiteType} from "../entity/RoleUserSite";
import {CErrorOrderUser} from "../controler/CErrorOrderUser";
import {CPlacardUserSite} from "../controler/CPlacardUserSite";
import {Platform} from "../entity/Platform";
import {FundsRecordSite} from "../entity/FundsRecordSite";
import {Site, SiteState} from "../entity/Site";
import {MessageUserSite} from "../entity/MessageUserSite";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {FundsRecordPlatform} from "../entity/FundsRecordPlatform";

const siteAuth = new Router();

export async function siteRoute(router: Router) {

    /* 登录入口 */
    router.post('/site/login', passport.authenticate('site'), async (ctx: Context, some: any) => {
        let user = ctx.state.user;
        user.lastLoginTime = now();
        user = await user.save();
        let productRights = await CProductTypeSite.productsRight(user.site.id);
        let rights = await RightSite.findTrees();
        let menus = user.role.treeRights(productRights.concat(rights));
        await siteGetMenuWaitCount(menus, user.site.id, user.role.products);
        ctx.body = new MsgRes(true, '登录成功！', {
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
            messageNum: await MessageUserSite.getWaitCount(user.id),
        });
    });

    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/site/logined', (ctx: Context) => {
        let user = ctx.state.user;
        if (ctx.isAuthenticated() && user.type === UserType.Site) {
            let site = <Site>user.site;
            if (site.getState === SiteState.Ban) {
                ctx.logout();
                ctx.body = new MsgRes(false, '当前站点已被禁用了！');
            }else {
                ctx.body = new MsgRes(true);
            }
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/site/auth/*',(ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.Site) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 获取平台发给分站的公告和分站统计信息 */
    siteAuth.get('/platform/placards', async (ctx: Context) => {
        let siteId = ctx.state.user.site.id;
        let day = today();
        let placards = await CPlacardUserSite.getPlacardsOf(siteId);
        let {funds, freezeFunds} = await CUser.getAllFundsOfSite(siteId);
        let {normal, freeze, ban} = await CUser.getAllStatusInfoOfSite(siteId);
        let orderInfo = await COrderUser.statisticsOrderSite(siteId, day);
        let {siteDayBaseFunds, siteDayProfit} = await FundsRecordSite.dayBaseFundsAndProfitOfSite(siteId, day);
        let userNum = await CUser.siteNewUserOfDay(siteId, day);
        let upRoleNum = await FundsRecordUser.siteUpRoleOfDay(siteId, day);
        let {platTotalFunds, platRealTotalFunds,
            siteTotalFunds, siteRealTotalFunds} = await COrderUser.statisticsOrderFundsSite(siteId, day);

        ctx.body = new MsgRes(true, '', {
            placards: placards,
            statistics: {
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
            }
        });
    });

    /* 获取分站总金额和用户信息 */
    siteAuth.get('/get/total/funds/users/info', async (ctx: Context) => {
        let siteId = ctx.state.user.site.id;
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

    /* 获取分站业务订单统计信息 */
    siteAuth.get('/get/order/count/data/:date', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await COrderUser.statisticsOrderSite(ctx.state.user.site.id, ctx.params.date));
    });

    /* 获取分站基础统计信息 */
    siteAuth.get('/load/platform/statistics/base/info/:date', async (ctx: Context) => {
        let siteId = ctx.state.user.site.id;
        let {siteDayBaseFunds, siteDayProfit} = await FundsRecordSite.dayBaseFundsAndProfitOfSite(siteId, ctx.params.date);
        let userNum = await CUser.siteNewUserOfDay(siteId, ctx.params.date);
        let upRoleNum = await FundsRecordUser.siteUpRoleOfDay(siteId, ctx.params.date);
        let {platTotalFunds, platRealTotalFunds,
            siteTotalFunds, siteRealTotalFunds} = await COrderUser.statisticsOrderFundsSite(siteId, ctx.params.date);

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

    // 获取用户消息
    siteAuth.get('/load/user/messages', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await MessageUserSite.loadMessages(ctx.state.user.id));
    });

    // 删除指定消息
    siteAuth.get('/delete/message/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await MessageUserSite.delete(ctx.params.id));
    });

    /* 退出登录 */
    siteAuth.get('/logout', (ctx: Context) => {
        ctx.logout();
        ctx.body = new MsgRes(true, '退出登录');
    });

    /* 管理员信息 */
    siteAuth.get('/admin/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findById(ctx.params.id));
    });

    siteAuth.post('/adminInfo/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.updateContact(ctx.request.body));
    });

    siteAuth.post('/compare/pass', async (ctx: Context) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    siteAuth.post('/change/pass', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.changePass({
            user: ctx.state.user,
            ...ctx.request.body
        }));
    });

    /* 订单管理 */
    siteAuth.get('/orders/:productId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await COrderUser.findSiteOrdersByProductId(ctx.params.productId, ctx.state.user.site.id, ctx.query));
    });

    siteAuth.post('/order/execute', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.execute(ctx.request.body, (ctx as any).io))
    });

    siteAuth.post('/order/refund', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.backout(ctx.request.body, (ctx as any).io));
    });

    /* 订单报错管理 */
    siteAuth.get('/all/order/errors', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CErrorOrderUser.siteAll(ctx.state.user.role.products, ctx.query));
    });

    siteAuth.post('/order/deal/error', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CErrorOrderUser.dealError(ctx.request.body, ctx.state.user, (ctx as any).io))
    });

    siteAuth.post('/deal/error/order/refund', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CErrorOrderUser.dealErrorOrderRefund(ctx.request.body, ctx.state.user, (ctx as any).io))
    });

    /* 资金管理 */
    // 在线充值
    siteAuth.get('/recharge/code', async (ctx: Context) => {
        let info = {
            type: RechargeType.Site,
            userSite: ctx.state.user,
            site: ctx.state.user.site,
        };
        ctx.body = new MsgRes(true, '', await CRechargeCode.getOne(info));
    });

    siteAuth.post('/alipayId/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.findByAlipayId(ctx.request.body));
    });

    siteAuth.post('/recharge/add', async (ctx: Context) => {
        let info:any= ctx.request.body;
        let userSite = ctx.state.user;
        let params = {
            alipayId: info.alipayId,
            type: RechargeType.Site,
            way: RechargeWay.Hand,
            user: null,
            userSite: userSite,
            site: userSite.site
        };
        ctx.body = new MsgRes(true, '', await CRecharge.addOrRecharge(params, (ctx as any).io));
    });

    // 充值记录
    siteAuth.get('/recharge/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.siteAll(ctx.state.user.site.id, ctx.query));
    });

    siteAuth.get('/recharge/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.findByIdSite(ctx.params.id));
    });

    // 消费记录(站点资金变动记录)
    siteAuth.get('/all/funds/records/:type', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await FundsRecordSite.allOf(ctx.state.user.site.id, ctx.query, ctx.params.type));
    });

    // 返利记录(站点资金变动记录)
    siteAuth.get('/all/profit/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await FundsRecordSite.allProfitOf(ctx.state.user.site.id, ctx.query));
    });

    // 获取用户可提现金额
    siteAuth.get('/user/funds', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', ctx.state.user.site.funds);
    });

    // 获取分站最少提现金额限制和站点可用金额
    siteAuth.get('/get/withdraw/min/and/site/funds', async (ctx: Context) => {
        let platform = <Platform>await Platform.find();
        let user = ctx.state.user;
        let site = user.site;
        ctx.body = new MsgRes(true, '', {
            minWithdraw: platform.siteWithdrawMin,
            siteState: site.state,
            userState: user.state,
            siteFunds: site.funds
        });
    });

    // 申请提现
    siteAuth.post('/withdraw/add', async (ctx: Context) => {
        let info:any = ctx.request.body;
        let user = ctx.state.user;
        let site = user.site;
        assert(site.state === SiteState.Normal, '当前站点已被' + site.state + ',无法提现');
        assert(user.state === UserState.Normal, '您的账户已被' + user.state + ',无法提现');
        let params = {
            alipayCount: info.alipayCount,
            alipayName: info.alipayName,
            funds: parseFloat(info.funds),
            type: WithdrawType.Site,
            user: undefined,
            userSite: user,
            site: site
        };
        assert(params.alipayCount, '请输入提现支付宝账户');
        assert(params.alipayName, '请输入提现支付宝账户实名');
        let platform = <Platform>await Platform.find();
        assert(params.funds >= platform.siteWithdrawMin, '最少' + platform.siteWithdrawMin + '元起提');
        assert(site.funds >= params.funds, '站点可提现金额不足，当前可提现金额为：' + site.funds + '元');
        ctx.body = new MsgRes(true, '', await CWithdraw.add(params, (ctx as any).io));
    });

    // 提现记录
    siteAuth.get('/withdraw/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CWithdraw.siteAll(ctx.state.user.site.id, ctx.query));
    });

    siteAuth.get('/withdraw/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.findByIdSite(ctx.params.id));
    });

    /* 商品类别管理 */
    siteAuth.get('/product/types', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CProductTypeSite.getAll(ctx.state.user.role.productTypes));
    });

    // 更新商品类别上下架状态
    siteAuth.post('/product/type/set/onsale', async (ctx: Context) => {
        let type = await CProductTypeSite.setOnSale(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());
        // 更新分站所有商品类别管理页面中对应的商品类别
        io.emit(site.id + 'updateType', type);

        ctx.body = new MsgRes(true, '', null);
    });

    // 检测输入的商品类别名称是否存在
    siteAuth.get('/product/type/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductTypeSite.findByName(ctx.params.name));
    });

    // 添加商品类别
    siteAuth.post('/product/type/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CProductTypeSite.add(ctx.request.body, ctx.state.user, (ctx as any).io));
    });

    // 编辑商品类别信息
    siteAuth.post('/product/type/update', async (ctx: Context) => {
        let type = await CProductTypeSite.update(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', type.menuRightItem());
        // 更新分站所有商品类别管理页面中对应的商品类别
        io.emit(site.id + 'updateType', type);

        ctx.body = new MsgRes(true, '', null);
    });

    /* 商品管理 */
    siteAuth.get('/products', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CProductSite.getAll(ctx.state.user.role.products));
    });

    siteAuth.get('/products/of/:typeId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CProductSite.getByTypeId(ctx.state.user.role.products, ctx.params.typeId));
    });

    siteAuth.post('/product/set/onsale', async (ctx: Context) => {
        let product = await CProductSite.setOnSale(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
        // 更新分站所有商品管理页面对应的商品信息
        io.emit(site.id + 'updateProduct', product);
        ctx.body = new MsgRes(true, '', null);
    });

    siteAuth.get('/:typeId/product/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.findByNameAndTypeId(ctx.params.typeId, ctx.params.name));
    });

    siteAuth.get('/product/fields', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductField.getAll());
    });

    siteAuth.get('/prototype/of/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.getPrototypeById(ctx.params.id));
    });

    siteAuth.post('/product/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CProductSite.add(ctx.request.body, ctx.state.user, (ctx as any).io));
    });

    siteAuth.post('/product/update', async (ctx: Context) => {
        let product = await CProductSite.update(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
        // 更新分站所有商品管理页面对应的商品信息
        io.emit(site.id + 'updateProduct', product);
        ctx.body = new MsgRes(true, '', product);
    });

    siteAuth.post('/product/update/platform', async (ctx: Context) => {
        let product = await CProductSite.updatePlatform(ctx.request.body);
        let io = (ctx as any).io;
        let site = ctx.state.user.site;
        io.emit(site.id + 'typeOrProductUpdate', product.menuRightItem());
        // 更新分站所有商品管理页面对应的商品信息
        io.emit(site.id + 'updateProduct', product);
        ctx.body = new MsgRes(true, '', null);
    });

    /* 分站管理员角色操作 */
    siteAuth.get('/role/view/rights', async (ctx: Context) => {
        let productRights = await CProductTypeSite.productsRight(ctx.state.user.site.id);
        let rights = await RightSite.findTrees();
        ctx.body = new MsgRes(true, '', productRights.concat(rights));
    });

    siteAuth.get('/admin/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.allRoles(ctx.state.user.site.id));
    });

    siteAuth.get('/role/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.findByName(ctx.params.name));
    });

    siteAuth.post('/role/save', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserSite.saveOne(ctx.request.body, ctx.state.user.site));
    });

    siteAuth.post('/role/update', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserSite.update(ctx.request.body, (ctx as any).io));
    });

    siteAuth.get('/role/remove/:id', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CRoleUserSite.delById(ctx.params.id));
    });

    /* 分站管理员操作 */
    siteAuth.get('/admins', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.allAdmins(ctx.state.user.site.id));
    });

    siteAuth.get('/admin/roles/type/user', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUserSite.typeUserRoles(ctx.state.user.site.id));
    });

    siteAuth.get('/admin/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUserSite.findByUsername(ctx.params.username))
    });

    siteAuth.post('/admin/save', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.save(ctx.request.body, ctx.state.user.site));
    });

    siteAuth.post('/admin/change/role', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.changeRole(ctx.request.body, (ctx as any).io));
    });

    siteAuth.post('/admin/change/state', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.changeState(ctx.request.body, (ctx as any).io));
    });

    siteAuth.get('/admin/del/:id', async (ctx: Context) => {
        let roleType = ctx.state.user.role.type;
        if (roleType !== RoleUserSiteType.Site) {
            throw new Error('您没有该项操作的权限！');
        }
        ctx.body = new MsgRes(true, '', await CUserSite.delById(ctx.params.id));
    });

    /* 分站用户角色操作 */
    siteAuth.get('/user/right/show', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRightUser.show());
    });

    siteAuth.get('/user/roles', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUser.allRoles(ctx.state.user.site.id));
    });

    siteAuth.post('/user/role/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRoleUser.update(ctx.request.body, (ctx as any).io));
    });

    /* 分站用户操作 */
    siteAuth.get('/users', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.siteAll(ctx.state.user.site.id, ctx.query));
    });

    siteAuth.get('/search/user/by/:username', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CUser.searchByUsernameSite(ctx.state.user.site.id, ctx.params.username, ctx.query));
    });

    siteAuth.get('/lower/user/of/:parentId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.lowerUserOfSite(ctx.params.parentId, ctx.query));
    });

    siteAuth.get('/get/parent/user/:username', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.getParentUserSite(ctx.params.username))
    });

    siteAuth.get('/user/:userId/funds/records/:type', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await FundsRecordUser.findByUserId(ctx.params.userId, ctx.query, ctx.params.type));
    });

    siteAuth.get('/user/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findByName(ctx.params.username))
    });

    siteAuth.post('/user/save', async (ctx: Context) => {
        let info:any = ctx.request.body;
        info.role = await CRoleUser.findById(info.role);
        info.site = ctx.state.user.site;
        ctx.body = new MsgRes(true, '', await CUser.save(info));
    });

    siteAuth.get('/user/:id/reset/password', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.resetPassword(ctx.params.id));
    });

    siteAuth.post('/user/change/state', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.changeState(ctx.request.body, (ctx as any).io));
    });

    siteAuth.post('/user/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.updateOtherContact(ctx.request.body, (ctx as any).io));
    });

    siteAuth.post('/user/add/remark', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.addUserSiteRemark(ctx.request.body, ctx.state.user));
    });

    siteAuth.get('/user/:userId/remarks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.loadRemarksByUserSite(ctx.params.userId, ctx.state.user.id));
    });

    /* 分站公告管理 */
    siteAuth.get('/placards', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CPlacardUser.getSiteAll(ctx.state.user.site.id, ctx.query));
    });

    siteAuth.post('/placard/add', async (ctx: Context) => {
        let user = ctx.state.user;
        let info:any = ctx.request.body;
        info.user = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await CPlacardUser.add(info, (ctx as any).io));
    });

    siteAuth.post('/placard/update', async (ctx: Context) => {
        let info: any = ctx.request.body;
        info.siteId = ctx.state.user.site.id;
        ctx.body = new MsgRes(true, '', await CPlacardUser.update(info, (ctx as any).io));
    });

    siteAuth.get('/placard/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.delById(ctx.params.id));
    });

    /* 分站问题反馈 */
    siteAuth.get('/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CFeedbackUserSite.getSiteAll(ctx.state.user.site.id, ctx.query));
    });

    siteAuth.get('/feedback/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.getById(ctx.params.id))
    });

    siteAuth.post('/feedback/add', async (ctx: Context) => {
        let user = ctx.state.user;
        let info:any = ctx.request.body;
        info.user = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.add(info, (ctx as any).io));
    });

    siteAuth.post('/feedback/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.update(ctx.request.body));
    });

    siteAuth.get('/feedback/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUserSite.delById(ctx.params.id));
    });

    /* 处理用户问题反馈 */
    siteAuth.get('/user/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CFeedbackUser.siteGetAll(ctx.state.user.site.id, ctx.query));
    });

    siteAuth.post('/user/feedback/deal', async (ctx: Context) => {
        let info: any = ctx.request.body;
        info.dealTime = now();
        info.dealUserSite = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.deal(info, (ctx as any).io));
    });

    /* 分站信息管理 */
    siteAuth.get('/site/info', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.findById(ctx.state.user.site.id));
    });

    siteAuth.get('/site/:name/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.findByName(ctx.params.name));
    });

    siteAuth.post('/site/info/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CSite.updateInfo(ctx.request.body, (ctx as any).io));
    });


    router.use('/site/auth', siteAuth.routes(), siteAuth.allowedMethods());
}