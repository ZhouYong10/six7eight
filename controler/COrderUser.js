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
const ConsumeUser_1 = require("../entity/ConsumeUser");
const utils_1 = require("../utils");
const Product_1 = require("../entity/Product");
class COrderUser {
    static findOrdersByUserAndProduct(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findOrdersByUserAndProduct(productId, userId);
        });
    }
    static findOrdersByProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield Product_1.Product.findById(productId);
            return yield OrderUser_1.OrderUser.findOrdersByProductName(product.name);
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { productId, num, user, site } = info;
            let order = new OrderUser_1.OrderUser();
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let product = yield tem.createQueryBuilder()
                    .select('product')
                    .from(ProductSite_1.ProductSite, 'product')
                    .where('product.id = :id', { id: productId })
                    .innerJoinAndSelect('product.productTypeSite', 'productType')
                    .getOne();
                let productType = product.productTypeSite;
                let fields = {};
                for (let i = 0; i < product.attrs.length; i++) {
                    let item = product.attrs[i];
                    fields[item.type] = { name: item.name, value: info[item.type] };
                }
                order.countTotalPriceAndProfit(product.getPriceByUserRole(user.role), num, product);
                if (order.totalPrice > user.funds) {
                    throw new Error('账户余额不足，请充值！');
                }
                order.fields = fields;
                order.site = site;
                order.user = user;
                order.productType = productType;
                order.product = product;
                order = yield tem.save(order);
                let userOldFunds = user.funds;
                user.funds = parseFloat(utils_1.decimal(userOldFunds).minus(order.totalPrice).toFixed(4));
                user.freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).plus(order.totalPrice).toFixed(4));
                yield tem.save(user);
                let consume = new ConsumeUser_1.ConsumeUser();
                consume.userOldFunds = userOldFunds;
                consume.funds = order.totalPrice;
                consume.userNewFunds = user.funds;
                consume.type = productType.name + '/' + product.name;
                consume.description = productType.name + '/' + product.name + ', 下单数量： ' + order.num;
                consume.user = user;
                consume.order = order;
                yield tem.save(consume);
            }));
            return order;
        });
    }
}
exports.COrderUser = COrderUser;
//# sourceMappingURL=COrderUser.js.map