import {Context} from "koa";
import * as Router from "koa-router";
import svgCaptcha = require("svg-captcha");
import * as debuger from "debug";
import {MsgRes} from "../utils";
import {userRoutes} from "./user";
import {platformRoute} from "./platform";
import {siteRoute} from "./site";
import {CRecharge} from "../controler/CRecharge";

const debug = debuger('six7eight:route_index');

export async function appRoutes(router:Router) {

    /* 验证码 */
    router.get('/security/code', async (ctx: Context) => {
        let captcha = svgCaptcha.create({
            width: 106,
            height: 40,
            fontSize: 50
        });
        ctx.session!.captcha = captcha.text.toLowerCase();
        ctx.body = new MsgRes(true, '', captcha.data);
    });

    router.get('/', async (ctx: Context) => {
        await ctx.render('siteFront');
    });

    router.get('/admin', async (ctx: Context) => {
        await ctx.render('siteEnd');
    });

    router.get('/platform', async (ctx: Context) => {
        await ctx.render('platform');
    });

    router.post('/yzf/auto/recharge', async (ctx: Context) => {
        // 交易号，金额，付款备注，附加信息
        let {tradeNo, Money, title, memo} = <any>ctx.request.body;
        if(memo === 'chong@zhi@3.141592653'){
            console.log(tradeNo, Money, title, memo, ' ===============')
            let titleArr = title.split('-');
            await CRecharge.yiZhiFuAutoRecharge({
                alipayId: tradeNo,
                money: parseFloat(Money),
                uid: titleArr[1]
            }, (ctx as any).io);
            ctx.body = 'Success';
        }else{
            ctx.body = '你是假冒的充值记录，别以为我真的不知道! 等着被查水表吧!';
        }
    });

    userRoutes(router);
    siteRoute(router);
    platformRoute(router);
}