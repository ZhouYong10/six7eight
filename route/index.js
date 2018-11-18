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
        user_1.userRoutes(router);
        site_1.siteRoute(router);
        platform_1.platformRoute(router);
    });
}
exports.appRoutes = appRoutes;
//# sourceMappingURL=index.js.map