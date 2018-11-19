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
    static allRoles(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.RoleUserSite.getAll(siteId);
        });
    }
    static typeUserRoles(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.RoleUserSite.typeUserAll(siteId);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.RoleUserSite.findByName(name);
        });
    }
    static saveOne(info, site) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = new RoleUserSite_1.RoleUserSite();
            role.name = info.name;
            role.rights = info.rights;
            role.site = site;
            return yield role.save();
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.RoleUserSite.update(info.id, {
                name: info.name,
                rights: info.rights
            });
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let role = yield RoleUserSite_1.RoleUserSite.findByIdWithRelations(id);
            if (role.users && role.users.length > 0) {
                throw (new Error('该角色上有关联的账户，不能删除！'));
            }
            else {
                yield RoleUserSite_1.RoleUserSite.delById(id);
            }
        });
    }
}
exports.CRoleUserSite = CRoleUserSite;
//# sourceMappingURL=CRoleUserSite.js.map