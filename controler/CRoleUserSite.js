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
const RoleUserSite_1 = require("../entity/RoleUserSite");
class CRoleUserSite {
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = new RoleUserSite_1.RoleUserSite();
            role.name = info.name;
            role.rights = info.rights;
            role.site = info.site;
            return yield role.save();
        });
    }
}
exports.CRoleUserSite = CRoleUserSite;
//# sourceMappingURL=CRoleUserSite.js.map