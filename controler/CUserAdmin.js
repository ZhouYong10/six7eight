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
const utils_1 = require("../utils");
class CUserAdmin {
    static allAdmins() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return new utils_1.MsgRes(true, '', yield UserAdmin_1.UserAdmin.getAll());
            }
            catch (e) {
                return new utils_1.MsgRes(false, e.message);
            }
        });
    }
    static updateLoginTime(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = new UserAdmin_1.UserAdmin();
            admin.lastLoginTime = info.time;
            return yield UserAdmin_1.UserAdmin.update(info.id, admin);
        });
    }
}
exports.CUserAdmin = CUserAdmin;
//# sourceMappingURL=CUserAdmin.js.map