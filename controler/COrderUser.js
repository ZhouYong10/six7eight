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
class COrderUser {
    static findOrdersByUserAndProduct(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findOrdersByUserAndProduct(productId, userId);
        });
    }
    static findPlatformOrdersByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findPlatformOrdersByProductId(productId);
        });
    }
    static siteOrdersByProductId(productId, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findOrdersByProductIdAndSiteId(productId, siteId);
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { productId, num, user, site } = info;
            let order = new OrderUser_1.OrderUser();
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let productSite = yield tem.createQueryBuilder()
                    .select('productSite')
                    .from(ProductSite_1.ProductSite, 'productSite')
                    .where('productSite.id = :id', { id: productId })
                    .leftJoinAndSelect('productSite.product', 'product')
                    .leftJoinAndSelect('productSite.productTypeSite', 'productTypeSite')
                    .leftJoinAndSelect('productTypeSite.productType', 'productType')
                    .getOne();
                let productTypeSite = productSite.productTypeSite;
                let product = productSite.product;
                let productType = productSite.productTypeSite.productType;
                order.countTotalPriceAndProfit(productSite.getPriceByUserRole(user.role), num, productSite);
                if (order.totalPrice > user.funds) {
                    throw new Error('账户余额不足，请充值！');
                }
                let fields = {};
                for (let i = 0; i < productSite.attrs.length; i++) {
                    let item = productSite.attrs[i];
                    fields[item.type] = { name: item.name, value: info[item.type] };
                }
                order.fields = fields;
                order.type = productSite.type;
                order.site = site;
                order.user = user;
                order.productSite = productSite;
                order.productTypeSite = productTypeSite;
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
                consume.type = productTypeSite.name + '/' + productSite.name;
                consume.description = productTypeSite.name + '/' + productSite.name + ', 单价： ￥' + order.price + ', 下单数量： ' + order.num;
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