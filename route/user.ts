import * as Router from "koa-router";
import {Context} from "koa";
import * as passport from "passport";
import * as debuger from "debug";
import {UserType} from "../entity/UserBase";
import {assert, comparePass, default as upload, MsgRes, now} from "../utils";
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
import {CConsumeUser} from "../controler/CConsumeUser";
import {Platform} from "../entity/Platform";

const debug = debuger('six7eight:route-user');
const userAuth = new Router();


export async function userRoutes(router: Router) {

    /* 检测注册用户名是否存在 */
    router.get('/user/check/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findByName(ctx.params.username));
    });

    /* 用户注册 */
    router.post('/user/register', async (ctx: Context) => {
        let {username, password, rePassword, securityCode} = <any>ctx.request.body;
        assert(username, '用户名不能为空!');
        assert(password, '账户密码不能为空!');
        assert(securityCode, '验证码不能为空!');
        assert(password === rePassword, '两次输入的密码不一致!');

        const captcha = ctx.session!.captcha;
        assert(captcha === securityCode, '验证码错误!');

        let site = await CSite.findByAddress(ctx.request.hostname);
        assert(site, '你访问的分站不存在!');

        let user = await CUser.saveLower({
            username: username,
            password: password,
            parent: null,
            site: site
        });
        await ctx.login(user);
        ctx.body = new MsgRes(true, '', await CUser.getUserLoginInitData(user));
    });

    router.post('/user/login', passport.authenticate('user'), async (ctx: Context) => {
        let user = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CUser.getUserLoginInitData(user));
    });

    router.get('/user/init/data', async (ctx: Context) => {
        let site = await CSite.findByAddress(ctx.request.hostname);
        if (!site) {
            throw new Error('您访问的分站不存在！');
        }
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
            canRegister: platform.canRegister,
            canAddUser: platform.canAddUser,
            goldUpPrice: platform.goldUpPrice,
            superUpPrice: platform.superUpPrice,
        });
    });

    router.get('/user/product/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CProductSite.findById(ctx.params.id));
    });

    /* 文件上传 */
    router.post('/file/upload', upload.single('file'), async (ctx: Context) => {
        let req: any = ctx.req;
        ctx.body = ctx.origin + '/uploads/' + req.file.filename;
    });

    /* 判断是否登录(用于管控前端路由的访问) */
    router.get('/user/logined', (ctx: Context) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.User) {
            ctx.body = new MsgRes(true);
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 拦截需要登录的所有路由 */
    router.use('/user/auth/*', (ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.User) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 退出登录 */
    userAuth.get('/logout', async (ctx: Context) => {
        ctx.logout();
        ctx.body = new MsgRes(false, '退出登录！');
    });


    /* 订单管理 */
    userAuth.get('/orders/:productId', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.findUserOrdersByProductId(ctx.params.productId, ctx.state.user.id));
    });

    userAuth.post('/order/add', async (ctx: Context) => {
        let user = ctx.state.user;
        let info: any = ctx.request.body;
        info.user = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await COrderUser.add(ctx.request.body, (ctx as any).io));
    });

    userAuth.post('/order/add/error', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.addError(ctx.request.body, (ctx as any).io));
    });

    userAuth.get('/order/:orderId/errors', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await COrderUser.getErrors(ctx.params.orderId));
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
        ctx.body = new MsgRes(true, '', await CRecharge.userAll(ctx.state.user.id));
    });

    // 消费记录
    userAuth.get('/consume/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CConsumeUser.all(ctx.state.user.id));
    });

    // 获取用户可提现金额
    userAuth.get('/user/funds', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', ctx.state.user.funds);
    });

    // 申请提现
    userAuth.post('/withdraw/add', async (ctx: Context) => {
        let info: any = ctx.request.body;
        let user = ctx.state.user;
        let params = {
            alipayCount: info.alipayCount,
            alipayName: info.alipayName,
            funds: info.funds,
            type: WithdrawType.User,
            user: user,
            userSite: undefined,
            site: user.site
        };
        ctx.body = new MsgRes(true, '', await CWithdraw.add(params, (ctx as any).io));
    });

    // 提现记录
    userAuth.get('/withdraw/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.userAll(ctx.state.user.id));
    });

    /* 下级用户管理 */
    userAuth.get('/lower/users', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.lowerUserAll(ctx.state.user.id));
    });

    userAuth.get('/lower/user/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findByName(ctx.params.username))
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
        let user = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.userGetAll(user.id, user.site.id));
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