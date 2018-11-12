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
const OrderUser_1 = require("../entity/OrderUser");
const typeorm_1 = require("typeorm");
const ProductSite_1 = require("../entity/ProductSite");
class COrderUser {
    static findOrdersByUserAndProduct(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findOrdersByUserAndProduct(productId, userId);
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { productId, user, site } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let product = yield tem.createQueryBuilder()
                    .select('product')
                    .from(ProductSite_1.ProductSite, 'product')
                    .where('product.id = :id', { id: productId })
                    .innerJoinAndSelect('product.productTypeSite', 'productType')
                    .getOne();
                let productType = product.productTypeSite;
            }));
        });
    }
}
exports.COrderUser = COrderUser;
//# sourceMappingURL=COrderUser.js.map