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
const typeorm_1 = require("typeorm");
const RightSite_1 = require("../entity/RightSite");
const ProductTypeSite_1 = require("../entity/ProductTypeSite");
const utils_1 = require("../utils");
const CProductTypeSite_1 = require("./CProductTypeSite");
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
            role.editRights = info.editRights;
            role.rights = info.rights;
            role.site = site;
            let productMenus = yield CProductTypeSite_1.CProductTypeSite.productsRight(site.id);
            let { productTypes, products } = utils_1.getMyProducts(role.treeRights(productMenus));
            role.productTypes = productTypes;
            role.products = products;
            return yield role.save();
        });
    }
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let role = yield tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUserSite_1.RoleUserSite, 'role')
                    .innerJoinAndSelect('role.site', 'site')
                    .where('role.id = :id', { id: info.id })
                    .getOne();
                role.name = info.name;
                role.editRights = info.editRights;
                role.rights = info.rights;
                let site = role.site;
                let typeProducts = yield tem.createQueryBuilder()
                    .select('type')
                    .from(ProductTypeSite_1.ProductTypeSite, 'type')
                    .innerJoin('type.site', 'site', 'site.id = :id', { id: site.id })
                    .leftJoinAndSelect('type.productSites', 'product')
                    .orderBy('type.createTime', 'DESC')
                    .getMany();
                let productRights = utils_1.productToRight(typeProducts, []);
                let rights = yield tem.createQueryBuilder()
                    .select('right')
                    .from(RightSite_1.RightSite, 'right')
                    .where('right.pId = :pId', { pId: '0' })
                    .leftJoinAndSelect('right.children', 'menu')
                    .leftJoinAndSelect('menu.children', 'menuItem')
                    .getMany();
                utils_1.sortRights(rights);
                let treeRights = role.treeRights(productRights.concat(rights));
                let { productTypes, products } = utils_1.getMyProducts(treeRights);
                role.productTypes = productTypes;
                role.products = products;
                yield utils_1.siteGetMenuWaitCount(treeRights, site.id, role.products);
                io.emit(role.id + 'changeRights', { menuRights: treeRights, rights: role.rights, roleName: role.name });
                yield tem.save(role);
            }));
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