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
//# sourceMappingURL=utils.js.map