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
const utils_1 = require("../utils");
const typeorm_1 = require("typeorm");
const ProductType_1 = require("../entity/ProductType");
const RightAdmin_1 = require("../entity/RightAdmin");
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
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let role = yield tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUserAdmin_1.RoleUserAdmin, 'role')
                    .where('role.id = :id', { id: info.id })
                    .getOne();
                role.name = info.name;
                role.rights = info.rights;
                let typeProducts = yield tem.createQueryBuilder()
                    .select('type')
                    .from(ProductType_1.ProductType, 'type')
                    .leftJoinAndSelect('type.products', 'product')
                    .orderBy('type.createTime', 'DESC')
                    .getMany();
                let productRights = utils_1.productToRight(typeProducts, []);
                let rights = yield tem.getTreeRepository(RightAdmin_1.RightAdmin).findTrees();
                utils_1.sortRights(rights);
                let treeRights = role.treeRights(productRights.concat(rights));
                io.emit(role.id + 'changeRights', { menuRights: treeRights, rights: role.rights });
                yield tem.save(role);
            }));
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