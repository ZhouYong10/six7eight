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
const RoleUserSite_1 = require("../entity/RoleUserSite");
class CUserSite {
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new UserSite_1.UserSite();
            user.site = info.site;
            user.username = info.username;
            user.password = info.password;
            user.setState = info.state;
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
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.findById(id);
        });
    }
    static updateInfo(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserSite_1.UserSite.findById(info.id);
            user.username = info.username;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            return yield user.save();
        });
    }
    static changePass(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = info.user;
            user.password = info.pass;
            return yield user.save();
        });
    }
    static allAdmins(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.getAll(siteId);
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.findByName(username);
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield UserSite_1.UserSite.findById(info.id);
            user.username = info.username;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            if (user.getState !== info.state) {
                user.setState = info.state;
            }
            if (user.role.id !== info.role) {
                user.role = (yield RoleUserSite_1.RoleUserSite.findById(info.role));
            }
            return yield user.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserSite_1.UserSite.delById(id);
        });
    }
}
exports.CUserSite = CUserSite;
//# sourceMappingURL=CUserSite.js.map