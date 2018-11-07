import * as Router from "koa-router";
import {Context} from "koa";
import * as passport from "passport";
import * as debuger from "debug";
import {UserType} from "../entity/UserBase";
import {comparePass, MsgRes, now} from "../utils";
import {CUser} from "../controler/CUser";
import {CFeedbackUser} from "../controler/CFeedbackUser";
import {CRechargeCode} from "../controler/CRechargeCode";
import {RechargeType, RechargeWay} from "../entity/Recharge";
import {CRecharge} from "../controler/CRecharge";
import {CWithdraw} from "../controler/CWithdraw";
import {WithdrawType} from "../entity/Withdraw";
import {CSite} from "../controler/CSite";
import c = require("koa-session/lib/context");
import {CRightUser} from "../controler/CRightUser";
import {RightUser} from "../entity/RightUser";
import {CProductTypeSite} from "../controler/CProductTypeSite";

const debug = debuger('six7eight:route-user');
const userAuth = new Router();


export async function userRoutes(router: Router){

    /* 登录入口 */
    router.post('/user/login', async (ctx: Context) => {
        const params:any = ctx.request.body;
        const captcha = ctx.session!.captcha;
        if (captcha === params.securityCode) {
            return passport.authenticate('user', async (err, user, info, status) => {
                if (user) {
                    ctx.login(user);
                    await CUser.updateLoginTime({id: user.id, time: now()});
                    ctx.body = new MsgRes(true, '登录成功！', user);
                } else {
                    ctx.body = new MsgRes(false, '用户名或密码错误！');
                }
            })(ctx, () => {
                return new Promise((resolve, reject) => {
                    resolve();
                });
            });
        }else {
            ctx.body = new MsgRes(false, '验证码错误！');
        }
    });

    router.get('/user/init/data', async (ctx: Context) => {
        let site = await CSite.findByAddress(ctx.request.hostname);
        let siteName = site!.name;
        let rights = await RightUser.findTrees();
        let products: any = await CProductTypeSite.getAllWithProducts(site!.id);
        console.log(JSON.stringify(products), '----------------------------')
        let result = products.concat(rights[0].children);
        ctx.body = new MsgRes(true, '', {siteName: siteName, rights: result});
    });
    
    /* 拦截需要登录的所有路由 */
    router.use('/user/auth/*',(ctx: Context, next) => {
        if (ctx.isAuthenticated() && ctx.state.user.type === UserType.User) {
            return next();
        } else {
            ctx.body = new MsgRes(false, '请登录后操作！');
        }
    });

    /* 退出登录 */
    userAuth.get('/logout', (ctx: Context) => {
        ctx.logout();
        ctx.body = new MsgRes(true, '退出登录');
    });

    /* 账户信息 */
    userAuth.get('/user/info/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findById(ctx.params.id));
    });

    userAuth.post('/user/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.updateInfo(ctx.request.body));
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
        let info:any= ctx.request.body;
        let user = ctx.state.user;
        let params = {
            alipayId: info.alipayId,
            type: RechargeType.User,
            way: RechargeWay.Hand,
            user: user,
            userSite: null,
            site: user.site
        };
        ctx.body = new MsgRes(true, '', await CRecharge.addOrRecharge(params));
    });

    // 充值记录
    userAuth.get('/recharge/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CRecharge.userAll(ctx.state.user.id));
    });

    // 获取用户可提现金额
    userAuth.get('/user/funds', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', ctx.state.user.funds);
    });

    // 申请提现
    userAuth.post('/withdraw/add', async (ctx: Context) => {
        let info:any = ctx.request.body;
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
        ctx.body = new MsgRes(true, '', await CWithdraw.add(params));
    });

    // 提现记录
    userAuth.get('/withdraw/records', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CWithdraw.userAll(ctx.state.user.id));
    });

    /* 下级用户管理 */
    userAuth.get('/lower/users', async (ctx: Context) => {
        let user = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CUser.lowerUserAll(user.id, user.site.id));
    });

    userAuth.get('/lower/user/:username/exist', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.findByNameAndSiteId(ctx.params.username, ctx.state.user.site.id))
    });

    userAuth.post('/lower/user/save', async (ctx: Context) => {
        let user = ctx.state.user;
        let info:any = ctx.request.body;
        info.parent = user;
        info.site = user.site;
        info.role = await user.role.getLowerRole(user.site.id);
        ctx.body = new MsgRes(true, '', await CUser.saveLower(info));
    });

    userAuth.post('/lower/user/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.updateLower(ctx.request.body));
    });

    userAuth.get('/lower/user/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CUser.delById(ctx.params.id));
    });

    /* 用户问题反馈 */
    userAuth.get('/feedbacks', async (ctx: Context) => {
        let user = ctx.state.user;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.userGetAll(user.id, user.site.id));
    });

    userAuth.post('/feedback/add', async (ctx: Context) => {
        let user = ctx.state.user;
        let info:any = ctx.request.body;
        info.user = user;
        info.site = user.site;
        ctx.body = new MsgRes(true, '', await CFeedbackUser.add(info));
    });

    userAuth.post('/feedback/update', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.update(ctx.request.body));
    });

    userAuth.get('/feedback/del/:id', async (ctx: Context) => {
        ctx.body = new MsgRes(true, '', await CFeedbackUser.delById(ctx.params.id));
    });


    router.use('/user/auth', userAuth.routes(), userAuth.allowedMethods());
}