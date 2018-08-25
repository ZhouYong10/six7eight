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
const Site_1 = require("../entity/Site");
const CUserSite_1 = require("./CUserSite");
const CRoleUserSite_1 = require("./CRoleUserSite");
class CSite {
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(info, '==============');
            let site = new Site_1.Site();
            let roleUserSite = yield CRoleUserSite_1.CRoleUserSite.save({});
            let userSite = yield CUserSite_1.CUserSite.save({});
            userSite.role = roleUserSite;
            site.usersSite = [userSite];
            return yield site.save();
        });
    }
}
exports.CSite = CSite;
//# sourceMappingURL=CSite.js.map