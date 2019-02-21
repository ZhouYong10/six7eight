import * as Router from "koa-router";
import {Context} from "koa";
import * as passport from "passport";
import * as debuger from "debug";
import {UserState, UserType} from "../entity/UserBase";
import {assert, comparePass, default as upload, MsgRes, today} from "../utils";
import {CUser} from "../controler/CUser";
import {CFeedbackUser} from "../controler/CFeedbackUser";
import {CRechargeCode} from "../controler/CRechargeCode";
import {RechargeType, RechargeWay} from "../entity/Recharge";
import {CRecharge} from "../controler/CRecharge";
import {CWithdraw} from "../controler/CWithdraw";
import {WithdrawType} from "../entity/Withdraw";
import {CSite} from "../controler/CSite";
import {RightUser} from "../entity/RightUser";
import {CProductTypeSite} from "../controler/CProductTypeSite";
import {CProductSite} from "../controler/CProductSite";
import {COrderUser} from "../controler/COrderUser";
import {Platform} from "../entity/Platform";
import {CRoleUser} from "../controler/CRoleUser";
import {FundsRecordUser} from "../entity/FundsRecordUser";
import {CPlacardUser} from "../controler/CPlacardUser";
import {MessageUser} from "../entity/MessageUser";

const debug = debuger('six7eight:route-user');
const userAuth = new Router();


export async function userRoutes(router: Router) {

    /* 获取所有商品价格 */
    router.get('/user/all/products/price', async (ctx: Context) => {
        let site = await CSite.findByAddress(ctx.hostname);
        assert(site, '你访问的分站不存在');
        let products: Array<any> = await CProductTypeSite.productsPrice(site!.id);
        let priceRoles: Array<any> = await CRoleUser.productPriceRoles(site!.id);
        ctx.body = new MsgRes(true, '', {
            products: products,
            priceRoles: priceRoles,
            goldUpPrice: site!.goldUpPrice,
            superUpPrice: site!.superUpPrice,
        });
    });

    /* 获取公告 */
    router.get('/user/all/placards', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CPlacardUser.getUserPlacards(ctx.hostname));
    });

    /* 检测注册用户名是否存在 */
    router.post('/user/check/username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findByName((ctx.request.body as any).username));
    });

    /* 用户注册 */
    router.post('/user/register', async (ctx: Context) => {
        let {username, password, rePassword, securityCode} = <any>ctx.request.body;
        assert(username.search('/') == -1, '账户名中不能包含特殊字符“/”');
        assert(username, '用户名不能为空!');
        assert(password, '账户密码不能为空!');
        assert(securityCode, '验证码不能为空!');
        assert(password === rePassword, '两次输入的密码不一致!');

        const captcha = ctx.session!.captcha;
        assert(captcha === securityCode, '验证码错误!');

        let site = await CSite.findByAddress(ctx.hostname);
        assert(site, '你访问的分站不存在!');

        await CUser.saveLower({
            username: username,
            password: password,
            parent: null,
            site: site
        });
        ctx.body = new MsgRes(true, '', true);
    });

    /* 用户登录 */
    router.post('/user/login', passport.authenticate('user'), async (ctx: Context) => {
        let user = ctx.state.user;
        let initData: any = await CUser.getUserLoginInitData(user);
        initData.productMenus = await CProductTypeSite.productsRight(user.site.id);
        ctx.body = new MsgRes(true, '', initData);
    });

    /* 获取账户初始化数据 */
    router.get('/user/init/data', async (ctx: Context) => {
        let site = await CSite.findByAddress(ctx.hostname);
        assert(site, '你访问的分站不存在!');
        let productMenus = await CProductTypeSite.productsRight(site!.id);
        let rightMenus = await RightUser.findTrees();
        let permissions = await RightUser.getAllPermissions();
        let platform = <Platform>await Platform.find();

        ctx.body = new MsgRes(true, '', {
            siteId: site!.id,
            siteName: site!.name,
            productMenus: productMenus,
            rightMenus: rightMenus,
            permissions: permissions,
            canSiteRegister: site!.canRegister,
            canRegister: platform.canRegister,
            canAddUser: platform.canAddUser
        });
    });

    /* 获取商品信息 */
    router.get('/user/product/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.findById(ctx.params.id));
    });

    /* 文件上传 */
    router.post('/file/upload', upload.single('file'), async (ctx: Context) => {
        let req: any = ctx.req;
        ctx.body = ctx.origin + '/uploads/' + req.file.filename;
    });

    /* 拦截需要登录的所有路由 */
    router.use('/user/auth/*', (ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.User) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作!!-user');
        }
    });

    /* 刷新用户菜单和消息提示 */
    userAuth.get('/refresh/menus/messages', async (ctx: Context) => {
        let user = ctx.state.user;
        let initData: any = await CUser.getUserLoginInitData(user);
        initData.productMenus = await CProductTypeSite.productsRight(user.site.id);
        ctx.body = new MsgRes(true, '', initData);
    });

    /* 获取用户所有统计数据 */
    userAuth.get('/get/total/count/data', async (ctx: Context) => {
        let userId = ctx.state.user.id;
        let day = today();
        let {recharge} = await CRecharge.dayRechargeOfUser(userId, day);
        let {withdraw} = await CWithdraw.dayWithdrawOfUser(userId, day);
        ctx.body = new MsgRes(true, '', {
            orderInfo: await COrderUser.statisticsOrderUser(userId, day),
            recharge: recharge || 0,
            withdraw: withdraw || 0,
            consume: await FundsRecordUser.dayConsumeOfUser(userId, day),
            refund: await FundsRecordUser.dayRefundOfUser(userId, day),
            profit: await FundsRecordUser.dayProfitOfUser(userId, day),
        })
    });

    /* 获取用户业务订单统计信息 */
    userAuth.get('/get/order/count/data/:date', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await COrderUser.statisticsOrderUser(ctx.state.user.id, ctx.params.date));
    });

    /* 获取用户基础统计信息 */
    userAuth.get('/load/platform/statistics/base/info/:date', async (ctx: Context) => {
        let userId = ctx.state.user.id;
        let date = ctx.params.date;
        let {recharge} = await CRecharge.dayRechargeOfUser(userId, date);
        let {withdraw} = await CWithdraw.dayWithdrawOfUser(userId, date);
        ctx.body = new MsgRes(true, '', {
            recharge: recharge || 0,
            withdraw: withdraw || 0,
            consume: await FundsRecordUser.dayConsumeOfUser(userId, date),
            refund: await FundsRecordUser.dayRefundOfUser(userId, date),
            profit: await FundsRecordUser.dayProfitOfUser(userId, date),
        });
    });

    // 获取用户消息
    userAuth.get('/load/messages', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await MessageUser.loadMessages(ctx.state.user.id));
    });

    // 删除指定消息
    userAuth.get('/delete/message/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await MessageUser.delete(ctx.params.id));
    });

    /* 退出登录 */
    userAuth.get('/logout', async (ctx: Context) => {
        ctx.logout();
        ctx.body = new MsgRes(false, '退出登录！');
    });

    /* 账户角色升级 */
    userAuth.get('/up/role/:userId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.upUserRole(ctx.params.userId, (ctx as any).io));
    });

    /* 获取指定商品的所有订单 */
    userAuth.get('/orders/:productId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await COrderUser.findUserOrdersByProductId(ctx.params.productId, ctx.state.user.id, ctx.query));
    });

    userAuth.get('/order/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.findById(ctx.params.id));
    });

    userAuth.post('/order/add', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.add(ctx.request.body, ctx.state.user, (ctx as any).io));
    });

    userAuth.get('/refund/order/of/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.applyRefund(ctx.params.id, (ctx as any).io));
    });

    userAuth.post('/order/add/error', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.addError(ctx.request.body, (ctx as any).io));
    });

    userAuth.get('/order/:orderId/errors', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.getErrors(ctx.params.orderId));
    });

    userAuth.get('/see/errors/of/:orderId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.seeErrors(ctx.params.orderId));
    });

    /* 账户信息 */
    userAuth.get('/user/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findById(ctx.params.id));
    });

    userAuth.post('/user/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.updateSelfContact(ctx.request.body));
    });

    userAuth.post('/compare/pass', async (ctx: Context) => {
        let body: any = ctx.request.body;
        let password: string = body.password;
        ctx.body = new MsgRes(true, '', comparePass(password, ctx.state.user.password));
    });

    userAuth.post('/change/pass', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.changePass({
            user: ctx.state.user,
            ...ctx.request.body
        }));
    });

    /* 资金管理 */
    // 在线充值
    userAuth.get('/recharge/code', async (ctx: Context) => {
        let info = {
            type: RechargeType.User,
            user: ctx.state.user,
            site: ctx.state.user.site,
        };
        ctx.body = new MsgRes(true, '', await CRechargeCode.getOne(info));
    });

    userAuth.post('/alipayId/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.findByAlipayId(ctx.request.body));
    });

    userAuth.post('/recharge/add', async (ctx: Context) => {
        let info: any = ctx.request.body;
        let user = ctx.state.user;
        let params = {
            alipayId: info.alipayId,
            type: RechargeType.User,
            way: RechargeWay.Hand,
            user: user,
            userSite: null,
            site: user.site
        };
        ctx.body = new MsgRes(true, '', await CRecharge.addOrRecharge(params, (ctx as any).io));
    });

    // 充值记录
    userAuth.get('/recharge/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CRecharge.userAll(ctx.state.user.id, ctx.query));
    });

    userAuth.get('/recharge/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.findByIdUser(ctx.params.id));
    });

    // 消费记录
    userAuth.get('/consume/records/:type', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await FundsRecordUser.findByUserId(ctx.state.user.id, ctx.query, ctx.params.type));
    });

    // 返利记录
    userAuth.get('/profit/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await FundsRecordUser.allProfitByUserId(ctx.state.user.id, ctx.query));
    });

    // 获取平台限制的用户最少提现金额和用户账户当前余额
    userAuth.get('/get/withdraw/min/and/user/funds', async (ctx: Context) => {
        let platform = <Platform>await Platform.find();
        let user = ctx.state.user;
        ctx.body = new MsgRes(true, '', {
            userState: user.state,
            userFunds: user.funds,
            minWithdraw: platform.userWithdrawMin,
        });
    });

    // 申请提现
    userAuth.post('/withdraw/add', async (ctx: Context) => {
        let info: any = ctx.request.body;
        let user = ctx.state.user;
        assert(user.state === UserState.Normal, '您的账户已被' + user.state + ',无法提现');
        let params = {
            alipayCount: info.alipayCount,
            alipayName: info.alipayName,
            funds: parseFloat(info.funds),
            type: WithdrawType.User,
            user: user,
            userSite: undefined,
            site: user.site
        };
        assert(params.alipayCount, '请输入提现支付宝账户');
        assert(params.alipayName, '请输入提现支付宝账户实名');
        let platform = <Platform>await Platform.find();
        assert(params.funds - platform.userWithdrawMin >= 0, '最少' + platform.userWithdrawMin + '元起提');
        assert(user.funds - params.funds >= 0, '账户可提现金额不足，当前可提现金额为：' + user.funds + '元');
        ctx.body = new MsgRes(true, '', await CWithdraw.add(params, (ctx as any).io));
    });

    // 提现记录
    userAuth.get('/withdraw/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CWithdraw.userAll(ctx.state.user.id, ctx.query));
    });

    userAuth.get('/withdraw/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.findByIdUser(ctx.params.id));
    });

    /* 下级用户管理 */
    userAuth.get('/lower/users', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CUser.lowerUserAll(ctx.state.user.id, ctx.query));
    });

    userAuth.post('/lower/user/username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findByName((ctx.request.body as any).username))
    });

    userAuth.post('/lower/user/save', async (ctx: Context) => {
        let user = ctx.state.user;
        let info: any = ctx.request.body;
        info.parent = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await CUser.saveLower(info));
    });

    userAuth.post('/lower/user/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.updateOtherContact(ctx.request.body, (ctx as any).io));
    });

    /* 用户问题反馈 */
    userAuth.get('/feedbacks', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '',
            await CFeedbackUser.userGetAll(ctx.state.user.id, ctx.query));
    });

    userAuth.get('/feedback/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.findById(ctx.params.id));
    });

    userAuth.post('/feedback/add', async (ctx: Context) => {
        let user = ctx.state.user;
        let info: any = ctx.request.body;
        info.user = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.add(info, (ctx as any).io));
    });

    userAuth.post('/feedback/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.update(ctx.request.body));
    });


    router.use('/user/auth', userAuth.routes(), userAuth.allowedMethods());
}