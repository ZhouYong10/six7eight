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
const UserAdmin_1 = require("../entity/UserAdmin");
const RoleUserAdmin_1 = require("../entity/RoleUserAdmin");
class CUserAdmin {
    static allAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.getAll();
        });
    }
    static updateLoginTime(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = new UserAdmin_1.UserAdmin();
            admin.lastLoginTime = info.time;
            return yield UserAdmin_1.UserAdmin.update(info.id, admin);
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UserAdmin_1.UserAdmin.findByName(username);
        });
    }
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new UserAdmin_1.UserAdmin();
            user.username = info.username;
            user.password = info.password;
            user.role = (yield RoleUserAdmin_1.RoleUserAdmin.findById(info.role));
            user.setState = info.state;
            user.phone = info.phone;
            user.weixin = info.weixin;
            user.qq = info.qq;
            user.email = info.email;
            return yield user.save();
        });
    }
}
exports.CUserAdmin = CUserAdmin;
//# sourceMappingURL=CUserAdmin.js.map