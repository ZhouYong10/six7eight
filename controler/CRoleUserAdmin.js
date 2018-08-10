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
const RoleUserAdmin_1 = require("../entity/RoleUserAdmin");
class CRoleUserAdmin {
    static allRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.RoleUserAdmin.getAll();
        });
    }
    static saveOne(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = new RoleUserAdmin_1.RoleUserAdmin();
            role.name = info.name;
            role.rights = info.rights;
            return yield role.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield RoleUserAdmin_1.RoleUserAdmin.findByIdWithRelations(id);
            console.log(role);
            if (role.users && role.users.length > 0) {
                return false;
            }
            else {
                yield RoleUserAdmin_1.RoleUserAdmin.delById(id);
                return true;
            }
        });
    }
}
exports.CRoleUserAdmin = CRoleUserAdmin;
//# sourceMappingURL=CRoleUserAdmin.js.map