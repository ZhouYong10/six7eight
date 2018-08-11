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
const bcrypt = require("bcryptjs");
const moment = require("moment");
function authenticated(todo) {
    return (ctx, next) => __awaiter(this, void 0, void 0, function* () {
        if (ctx.isAuthenticated()) {
            yield todo(ctx, next);
        }
        else {
            ctx.body = '您还没有登录，请登录后在操作！！';
        }
    });
}
exports.authenticated = authenticated;
function comparePass(userPass, databasePass) {
    return bcrypt.compareSync(userPass, databasePass);
}
exports.comparePass = comparePass;
function now() {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}
exports.now = now;
class LoginRes {
    constructor(isLogin, msg, data) {
        this.isLogin = isLogin;
        this.msg = msg;
        this.data = data;
    }
}
exports.LoginRes = LoginRes;
//# sourceMappingURL=utils.js.map