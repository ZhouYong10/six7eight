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
const debuger = require("debug");
const RoleUserAdmin_1 = require("../entity/RoleUserAdmin");
const debug = (info, msg) => {
    const debug = debuger('six7eight:CRoleUserAdmin_saveOne ');
    debug(JSON.stringify(info) + '  ' + msg);
};
class CRoleUserAdmin {
    static typeUserRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.RoleUserAdmin.typeUserRoles();
        });
    }
    static allRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.RoleUserAdmin.getAll();
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.RoleUserAdmin.findByName(name);
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
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = new RoleUserAdmin_1.RoleUserAdmin();
            role.name = info.name;
            role.rights = info.rights;
            return yield RoleUserAdmin_1.RoleUserAdmin.update(info.id, role);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield RoleUserAdmin_1.RoleUserAdmin.findByIdWithRelations(id);
            if (role.users && role.users.length > 0) {
                throw (new Error('该角色上有关联的账户，不能删除！'));
            }
            else {
                yield RoleUserAdmin_1.RoleUserAdmin.delById(id);
            }
        });
    }
}
exports.CRoleUserAdmin = CRoleUserAdmin;
//# sourceMappingURL=CRoleUserAdmin.js.map