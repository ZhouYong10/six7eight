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
const ProductSite_1 = require("../entity/ProductSite");
const CProductTypeSite_1 = require("./CProductTypeSite");
const typeorm_1 = require("typeorm");
const RoleUserSite_1 = require("../entity/RoleUserSite");
class CProductSite {
    static getAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.getAll(siteId);
        });
    }
    static setOnSale(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            yield ProductSite_1.ProductSite.update(id, { onSale: onSale });
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.findById(id);
        });
    }
    static findByNameAndTypeId(typeId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.findByNameAndTypeId(typeId, name);
        });
    }
    static getPrototypeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.getPrototypeById(id);
        });
    }
    static editInfo(product, info) {
        return __awaiter(this, void 0, void 0, function* () {
            product.name = info.name;
            product.sitePrice = info.sitePrice;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.orderTip = info.orderTip;
            product.onSale = info.onSale;
            product.minNum = info.minNum;
            product.attrs = info.attrs;
            product.productTypeSite = (yield CProductTypeSite_1.CProductTypeSite.findById(info.productTypeId));
        });
    }
    static add(info, site, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = new ProductSite_1.ProductSite();
            yield CProductSite.editInfo(product, info);
            product.site = site;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                product = yield tem.save(product);
                let productMenuRight = product.menuRightItem();
                let roleUserSite = yield tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUserSite_1.RoleUserSite, 'role')
                    .innerJoin('role.site', 'site', 'site.id = :id', { id: site.id })
                    .where('role.type = :type', { type: RoleUserSite_1.RoleUserSiteType.Site })
                    .getOne();
                roleUserSite.addProductToRights(product.productTypeSite.id, productMenuRight);
                yield tem.save(roleUserSite);
                io.emit(roleUserSite.id + 'product', { typeId: product.productTypeSite.id, product: productMenuRight });
                io.emit(site.id + 'product', { typeId: product.productTypeSite.id, product: productMenuRight });
            }));
            return product;
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield ProductSite_1.ProductSite.findById(info.id);
            yield CProductSite.editInfo(product, info);
            return yield product.save();
        });
    }
    static updatePlatform(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield ProductSite_1.ProductSite.findById(info.id);
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            return yield product.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.delById(id);
        });
    }
}
exports.CProductSite = CProductSite;
//# sourceMappingURL=CProductSite.js.map