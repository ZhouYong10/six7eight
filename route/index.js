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
const svgCaptcha = require("svg-captcha");
const debuger = require("debug");
const utils_1 = require("../utils");
const user_1 = require("./user");
const platform_1 = require("./platform");
const site_1 = require("./site");
const crypto_1 = require("crypto");
const iconv = require("iconv-lite");
const debug = debuger('six7eight:route_index');
function appRoutes(router) {
    return __awaiter(this, void 0, void 0, function* () {
        router.get('/security/code', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let captcha = svgCaptcha.create({
                width: 106,
                height: 40,
                fontSize: 50
            });
            ctx.session.captcha = captcha.text.toLowerCase();
            ctx.body = new utils_1.MsgRes(true, '', captcha.data);
        }));
        router.get('/', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('siteFront');
        }));
        router.get('/admin', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('siteEnd');
        }));
        router.get('/platform', (ctx) => __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('platform');
        }));
        router.post('/yzf/auto/recharge', (ctx) => __awaiter(this, void 0, void 0, function* () {
            let info = ctx.request.body;
            let titleBuf = iconv.encode(info.title, 'GB2312');
            let title = iconv.decode(titleBuf, 'GB2312');
            console.log(title, ' 333333333333333333');
            console.log(info, ' =======================');
            let signStr = `1000112${info.tradeNo}${info.Money}${info.title}${info.memo}`;
            console.log(signStr, ' 2222222222222222222');
            let md5Str = crypto_1.createHash('md5').update(info.title).digest('hex');
            console.log(md5Str, ' -------------------');
            if (info.key === 'chong@zhi@3.141592653') {
            }
            else {
                ctx.body = '你是假冒的充值记录，别以为我真的不知道! 等着被查水表吧!';
            }
            ctx.body = 'Success';
        }));
        user_1.userRoutes(router);
        site_1.siteRoute(router);
        platform_1.platformRoute(router);
    });
}
exports.appRoutes = appRoutes;
//# sourceMappingURL=index.js.map