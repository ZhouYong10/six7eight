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
const ProductType_1 = require("../entity/ProductType");
const typeorm_1 = require("typeorm");
const Site_1 = require("../entity/Site");
const ProductTypeSite_1 = require("../entity/ProductTypeSite");
const ProductTypeBase_1 = require("../entity/ProductTypeBase");
const utils_1 = require("../utils");
const RoleUserSite_1 = require("../entity/RoleUserSite");
const RoleUserAdmin_1 = require("../entity/RoleUserAdmin");
class CProductTypes {
    static productsRight() {
        return __awaiter(this, void 0, void 0, function* () {
            let typeProducts = yield ProductType_1.ProductType.allWithProducts();
            return utils_1.productToRight(typeProducts, []);
        });
    }
    static getAll(productTypeIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.ProductType.getAll(productTypeIds);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductType_1.ProductType.findByName(name);
        });
    }
    static add(info, user, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let type = new ProductType_1.ProductType();
                type.name = info.name;
                type.createUser = user.username;
                type.onSale = info.onSale;
                type.sortNum = info.sortNum;
                type = yield tem.save(type);
                let sites = yield tem.createQueryBuilder()
                    .select('site')
                    .from(Site_1.Site, 'site')
                    .getMany();
                if (sites.length > 0) {
                    for (let i = 0; i < sites.length; i++) {
                        let site = sites[i];
                        let typeSite = new ProductTypeSite_1.ProductTypeSite();
                        typeSite.type = ProductTypeBase_1.WitchType.Platform;
                        typeSite.name = type.name;
                        typeSite.createUser = type.createUser;
                        typeSite.onSale = type.onSale;
                        typeSite.sortNum = type.sortNum;
                        typeSite.productType = type;
                        typeSite.site = site;
                        typeSite = yield tem.save(typeSite);
                        let roleUserSite = yield tem.createQueryBuilder()
                            .select('role')
                            .from(RoleUserSite_1.RoleUserSite, 'role')
                            .innerJoin('role.site', 'site', 'site.id = :id', { id: site.id })
                            .where('role.type = :type', { type: RoleUserSite_1.RoleUserSiteType.Site })
                            .getOne();
                        roleUserSite.addProductTypeToRights(typeSite.id);
                        yield tem.save(roleUserSite);
                        let typeSiteMenuRight = typeSite.menuRightItem();
                        io.emit(roleUserSite.id + 'type', typeSiteMenuRight);
                        io.emit(site.id + 'type', typeSiteMenuRight);
                        io.emit(roleUserSite.id + 'addType', typeSite);
                    }
                }
                user.role.addProductTypeToRights(type.id);
                yield tem.save(user.role);
                let typeMenuRight = type.menuRightItem();
                io.emit(user.role.id + 'type', typeMenuRight);
                io.emit(user.role.id + 'addType', type);
                if (user.role.type !== RoleUserAdmin_1.RoleUserAdminType.Developer) {
                    let roleUserAdmin = yield tem.createQueryBuilder()
                        .select('role')
                        .from(RoleUserAdmin_1.RoleUserAdmin, 'role')
                        .where('role.type = :type', { type: RoleUserAdmin_1.RoleUserAdminType.Developer })
                        .getOne();
                    roleUserAdmin.addProductTypeToRights(type.id);
                    yield tem.save(roleUserAdmin);
                    io.emit(roleUserAdmin.id + 'type', typeMenuRight);
                    io.emit(roleUserAdmin.id + 'addType', type);
                }
            }));
        });
    }
    static getTypeAndTypeSite(id, tem) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = yield tem.createQueryBuilder()
                .select('type')
                .from(ProductType_1.ProductType, 'type')
                .leftJoinAndSelect('type.productTypeSites', 'productTypeSite')
                .leftJoinAndSelect('productTypeSite.site', 'site')
                .where('type.id = :id', { id: id })
                .getOne();
            let productTypeSites = type.productTypeSites;
            return { type: type, productTypeSites: productTypeSites };
        });
    }
    static setOnSale(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let { type, productTypeSites } = yield CProductTypes.getTypeAndTypeSite(id, tem);
                if (productTypeSites.length > 0) {
                    for (let i = 0; i < productTypeSites.length; i++) {
                        let productTypeSite = productTypeSites[i];
                        productTypeSite.onSale = onSale;
                        productTypeSite = yield tem.save(productTypeSite);
                        productTypeSite.productType = { onSale: onSale };
                        let site = productTypeSite.site;
                        io.emit(site.id + 'typeOrProductUpdate', productTypeSite.menuRightItem());
                        io.emit(site.id + 'updateType', productTypeSite);
                    }
                }
                type.onSale = onSale;
                type = yield tem.save(type);
                io.emit('typeOrProductUpdate', type.menuRightItem());
                io.emit('updateType', type);
            }));
        });
    }
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, name, onSale, sortNum } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let { type, productTypeSites } = yield CProductTypes.getTypeAndTypeSite(id, tem);
                if (productTypeSites.length > 0) {
                    for (let i = 0; i < productTypeSites.length; i++) {
                        let productTypeSite = productTypeSites[i];
                        productTypeSite.name = name;
                        productTypeSite.onSale = onSale;
                        productTypeSite.sortNum = sortNum;
                        productTypeSite = yield tem.save(productTypeSite);
                        let site = productTypeSite.site;
                        io.emit(site.id + 'typeOrProductUpdate', productTypeSite.menuRightItem());
                        io.emit(site.id + 'updateType', productTypeSite);
                    }
                }
                type.name = name;
                type.onSale = onSale;
                type.sortNum = sortNum;
                type = yield tem.save(type);
                io.emit('typeOrProductUpdate', type.menuRightItem());
                io.emit('updateType', type);
            }));
        });
    }
}
exports.CProductTypes = CProductTypes;
//# sourceMappingURL=CProductTypes.js.map