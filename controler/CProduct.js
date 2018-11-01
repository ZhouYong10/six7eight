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
const Product_1 = require("../entity/Product");
const CProductTypes_1 = require("./CProductTypes");
class CProduct {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.Product.getAll();
        });
    }
    static setOnSale(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, onSale } = info;
            yield Product_1.Product.update(id, { onSale: !onSale });
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.Product.findByName(name);
        });
    }
    static editInfo(product, info) {
        return __awaiter(this, void 0, void 0, function* () {
            product.name = info.name;
            product.price = info.price;
            product.sitePrice = info.sitePrice;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.onSale = info.onSale;
            product.attrs = info.attrs;
            product.productType = yield CProductTypes_1.CProductTypes.findByName(info.productType.name);
            return yield product.save();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CProduct.editInfo(new Product_1.Product(), info);
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CProduct.editInfo(yield Product_1.Product.findById(info.id), info);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Product_1.Product.delById(id);
        });
    }
}
exports.CProduct = CProduct;
//# sourceMappingURL=CProduct.js.map