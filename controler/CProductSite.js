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
class CProductSite {
    static getAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductSite_1.ProductSite.getAll(siteId);
        });
    }
    static setOnSale(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            yield ProductSite_1.ProductSite.update(id, { onSale: !onSale });
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
            product.price = info.price;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.onSale = info.onSale;
            product.attrs = info.attrs;
            product.productTypeSite = yield CProductTypeSite_1.CProductTypeSite.findById(info.productTypeId);
            return yield product.save();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CProductSite.editInfo(new ProductSite_1.ProductSite(), info);
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CProductSite.editInfo(yield ProductSite_1.ProductSite.findById(info.id), info);
        });
    }
    static updatePlatform(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield ProductSite_1.ProductSite.findById(info.id);
            product.price = info.price;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.onSale = info.onSale;
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