import {Context} from "koa";
import * as Router from "koa-router";
import svgCaptcha = require("svg-captcha");
import * as debuger from "debug";
import {MsgRes} from "../utils";
import {userRoutes} from "./user";
import {platformRoute} from "./platform";
import {siteRoute} from "./site";
import {createHash} from 'crypto';
import * as iconv from 'iconv-lite';

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
        let info:any = ctx.request.body;
        let titleBuf = iconv.encode(info.title, 'GB2312');
        let title = iconv.decode(titleBuf, 'GB2312');
        console.log(title, ' 333333333333333333');
        console.log(info, ' =======================');
        let signStr = `1000112${info.tradeNo}${info.Money}${info.title}${info.memo}`;
        console.log(signStr, ' 2222222222222222222')
        let md5Str = createHash('md5').update(info.title).digest('hex');
        console.log(md5Str, ' -------------------');
        if(info.key === 'chong@zhi@3.141592653'){

        }else{
            ctx.body = '你是假冒的充值记录，别以为我真的不知道! 等着被查水表吧!';
        }
        ctx.body = 'Success';
    });

    userRoutes(router);
    siteRoute(router);
    platformRoute(router);
}