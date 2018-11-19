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
const ProductTypeSite_1 = require("../entity/ProductTypeSite");
const ProductSite_1 = require("../entity/ProductSite");
const typeorm_1 = require("typeorm");
const RoleUserSite_1 = require("../entity/RoleUserSite");
const utils_1 = require("../utils");
class CProductTypeSite {
    static getAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.ProductTypeSite.getAll(siteId);
        });
    }
    static productsRight(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let types = yield ProductTypeSite_1.ProductTypeSite.allWithProducts(siteId);
            return utils_1.productToRight(types, []);
        });
    }
    static setOnSale(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            let type = yield ProductTypeSite_1.ProductTypeSite.findById(id);
            type.onSale = onSale;
            return yield type.save();
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.ProductTypeSite.findByName(name);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductTypeSite_1.ProductTypeSite.findById(id);
        });
    }
    static add(info, site, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = new ProductTypeSite_1.ProductTypeSite();
            type.site = site;
            type.name = info.name;
            type.onSale = info.onSale;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                type = yield tem.save(type);
                let roleUserSite = yield tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUserSite_1.RoleUserSite, 'role')
                    .innerJoin('role.site', 'site', 'site.id = :id', { id: site.id })
                    .where('role.type = :type', { type: RoleUserSite_1.RoleUserSiteType.Site })
                    .getOne();
                roleUserSite.addProductTypeToRights(type.id);
                yield tem.save(roleUserSite);
                let typeMenuRight = type.menuRightItem();
                io.emit(roleUserSite.id + 'type', typeMenuRight);
                io.emit(site.id + 'type', typeMenuRight);
            }));
            return type;
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = yield ProductTypeSite_1.ProductTypeSite.findById(info.id);
            type.name = info.name;
            type.onSale = info.onSale;
            return yield type.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let type = yield ProductTypeSite_1.ProductTypeSite.findByIdWithProducts(id);
            let products = type.productSites;
            products.forEach((product) => __awaiter(this, void 0, void 0, function* () {
                yield ProductSite_1.ProductSite.delById(product.id);
            }));
            yield ProductTypeSite_1.ProductTypeSite.delById(id);
        });
    }
}
exports.CProductTypeSite = CProductTypeSite;
//# sourceMappingURL=CProductTypeSite.js.map