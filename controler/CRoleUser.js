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
const RoleUser_1 = require("../entity/RoleUser");
const typeorm_1 = require("typeorm");
const RightUser_1 = require("../entity/RightUser");
const utils_1 = require("../utils");
class CRoleUser {
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.RoleUser.findById(id);
        });
    }
    static allRoles(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.RoleUser.getAll(siteId);
        });
    }
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let role = yield tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUser_1.RoleUser, 'role')
                    .where('role.id = :id', { id: info.id })
                    .getOne();
                role.name = info.name;
                role.editRights = info.editRights;
                role.rights = info.rights;
                let rights = yield tem.createQueryBuilder()
                    .select('right')
                    .from(RightUser_1.RightUser, 'right')
                    .where('right.pId = :pId', { pId: '0' })
                    .leftJoinAndSelect('right.children', 'menu')
                    .leftJoinAndSelect('menu.children', 'menuItem')
                    .getMany();
                utils_1.sortRights(rights);
                let treeRights = role.treeRights(rights);
                io.emit(role.id + 'changeRights', { menuRights: treeRights, rights: role.rights, roleName: role.name });
                yield tem.save(role);
            }));
        });
    }
    static productPriceRoles(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let roles = yield RoleUser_1.RoleUser.getAll(siteId);
            roles = roles.map((role) => {
                return {
                    name: role.name,
                    type: role.type,
                };
            });
            return roles;
        });
    }
}
exports.CRoleUser = CRoleUser;
//# sourceMappingURL=CRoleUser.js.map