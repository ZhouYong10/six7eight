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
const UserSite_1 = require("../entity/UserSite");
class CUserSite {
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new UserSite_1.UserSite();
            user.site = info.site;
            user.username = info.username;
            user.password = info.password;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            user.role = info.role;
            return yield user.save();
        });
    }
    static updateLoginTime(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new UserSite_1.UserSite();
            user.lastLoginTime = info.time;
            return yield UserSite_1.UserSite.update(info.id, user);
        });
    }
}
exports.CUserSite = CUserSite;
//# sourceMappingURL=CUserSite.js.map