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
const FundsRecordUser_1 = require("../entity/FundsRecordUser");
const utils_1 = require("../utils");
const ErrorOrderUser_1 = require("../entity/ErrorOrderUser");
const ProductTypeBase_1 = require("../entity/ProductTypeBase");
const FundsRecordBase_1 = require("../entity/FundsRecordBase");
const User_1 = require("../entity/User");
class COrderUser {
    static getWaitAndBackoutCount(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.getWaitAndBackoutCount(productId);
        });
    }
    static getSiteWaitAndBackoutCount(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.getSiteWaitAndBackoutCount(productId);
        });
    }
    static findUserOrdersByProductId(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findUserOrdersByProductId(productId, userId);
        });
    }
    static findPlatformOrdersByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findPlatformOrdersByProductId(productId);
        });
    }
    static findSiteOrdersByProductId(productId, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findSiteOrdersByProductId(productId, siteId);
        });
    }
    static countOrderProfits(tem, site, user, product, num, profits) {
        return __awaiter(this, void 0, void 0, function* () {
            let userNow = yield tem.createQueryBuilder()
                .select('user')
                .from(User_1.User, 'user')
                .where('user.id = :id', { id: user.id })
                .innerJoinAndSelect('user.parent', 'parent')
                .leftJoinAndSelect('parent.role', 'parentRole')
                .getOne();
            if (userNow) {
                let parent = userNow.parent;
                if (parent.role.type !== user.role.type) {
                    let profitPrice = utils_1.decimal(product.getPriceByUserRole(user.role)).minus(product.getPriceByUserRole(parent.role));
                    profits.push({
                        type: 'user',
                        id: parent.id,
                        name: parent.username,
                        profit: parseFloat(utils_1.decimal(profitPrice).times(num).toFixed(4))
                    });
                }
                yield COrderUser.countOrderProfits(tem, site, parent, product, num, profits);
            }
            else {
                if (product.type === ProductTypeBase_1.WitchType.Platform) {
                    let profitPriceSite = utils_1.decimal(product.topPrice).minus(product.sitePrice);
                    profits.push({
                        type: 'site',
                        id: site.id,
                        name: site.name,
                        profit: parseFloat(utils_1.decimal(profitPriceSite).times(num).toFixed(4))
                    });
                    let profitPricePlatform = utils_1.decimal(product.getPriceByUserRole(user.role)).minus(product.price).minus(profitPriceSite);
                    profits.push({
                        type: 'platform',
                        id: null,
                        name: '平台',
                        profit: parseFloat(utils_1.decimal(profitPricePlatform).times(num).toFixed(4))
                    });
                }
                else {
                    let profitPriceSite = utils_1.decimal(product.getPriceByUserRole(user.role)).minus(product.sitePrice);
                    profits.push({
                        type: 'site',
                        id: site.id,
                        name: site.name,
                        profit: parseFloat(utils_1.decimal(profitPriceSite).times(num).toFixed(4))
                    });
                }
            }
        });
    }
    static add(info, user, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let order = new OrderUser_1.OrderUser();
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let productSite = yield tem.createQueryBuilder()
                    .select('productSite')
                    .from(ProductSite_1.ProductSite, 'productSite')
                    .where('productSite.id = :id', { id: info.productId })
                    .leftJoinAndSelect('productSite.product', 'product')
                    .leftJoinAndSelect('productSite.productTypeSite', 'productTypeSite')
                    .leftJoinAndSelect('productTypeSite.productType', 'productType')
                    .getOne();
                let productTypeSite = productSite.productTypeSite;
                let product = productSite.product;
                let productType = productSite.productTypeSite.productType;
                order.name = productTypeSite.name + ' / ' + productSite.name;
                order.type = productSite.type;
                order.speed = productSite.speed;
                order.num = info.num;
                order.price = productSite.getPriceByUserRole(user.role);
                order.totalPrice = parseFloat(utils_1.decimal(order.price).times(order.num).toFixed(4));
                utils_1.assert(user.funds >= order.totalPrice, '账户余额不足，请充值！');
                order.fields = {};
                for (let i = 0; i < productSite.attrs.length; i++) {
                    let item = productSite.attrs[i];
                    order.fields[item.type] = { name: item.name, value: info[item.type] };
                }
                yield COrderUser.countOrderProfits(tem, user.site, user, productSite, order.num, order.profits = []);
                if (order.type === ProductTypeBase_1.WitchType.Platform) {
                    order.basePrice = parseFloat(utils_1.decimal(productSite.price).times(order.num).toFixed(4));
                }
                else {
                    order.basePrice = parseFloat(utils_1.decimal(productSite.sitePrice).times(order.num).toFixed(4));
                }
                order.user = user;
                order.site = user.site;
                order.productSite = productSite;
                order.productTypeSite = productTypeSite;
                order.productType = productType;
                order.product = product;
                order = yield tem.save(order);
                let userOldFunds = user.funds;
                user.funds = parseFloat(utils_1.decimal(userOldFunds).minus(order.totalPrice).toFixed(4));
                user.freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).plus(order.totalPrice).toFixed(4));
                yield tem.save(user);
                let consume = new FundsRecordUser_1.FundsRecordUser();
                consume.oldFunds = userOldFunds;
                consume.funds = order.totalPrice;
                consume.newFunds = user.funds;
                consume.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                consume.type = FundsRecordBase_1.FundsRecordType.Order;
                consume.description = productTypeSite.name + ' / ' + productSite.name + ', 单价： ￥' + order.price + ', 下单数量： ' + order.num;
                consume.user = user;
                yield tem.save(consume);
                if (order.type === ProductTypeBase_1.WitchType.Site) {
                    io.emit(user.site.id + 'plusBadge', productSite.id);
                    io.emit(user.site.id + 'addOrder', { productId: productSite.id, order: order });
                }
                else {
                    io.emit('plusBadge', product.id);
                    io.emit('addOrder', { productId: product.id, order: order });
                }
            }));
            return order;
        });
    }
    static getOrderInfo(tem, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tem.createQueryBuilder()
                .select('order')
                .from(OrderUser_1.OrderUser, 'order')
                .where('order.id = :id', { id: orderId })
                .leftJoinAndSelect('order.site', 'site')
                .leftJoinAndSelect('order.user', 'user')
                .leftJoinAndSelect('order.product', 'product')
                .leftJoinAndSelect('order.productSite', 'productSite')
                .getOne();
        });
    }
    static execute(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let order = yield COrderUser.getOrderInfo(tem, info.id);
                if (order.status === OrderUser_1.OrderStatus.Wait) {
                    order.status = OrderUser_1.OrderStatus.Execute;
                    order.startNum = info.startNum;
                    order.dealTime = utils_1.now();
                    order = yield tem.save(order);
                    if (order.type === ProductTypeBase_1.WitchType.Platform) {
                        io.emit('minusBadge', order.product.id);
                        io.emit('executeOrder', { productId: order.product.id, order: order });
                    }
                    else {
                        io.emit(order.site.id + 'minusBadge', order.productSite.id);
                        io.emit(order.site.id + 'executeOrder', { productId: order.productSite.id, order: order });
                    }
                    io.emit(order.productSite.id + 'executeOrder', order);
                }
            }));
        });
    }
    static refund(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let order = yield COrderUser.getOrderInfo(tem, info.id);
                utils_1.assert(order.status !== OrderUser_1.OrderStatus.Finish, '订单已经执行结束，不能撤销');
                order.executeNum = info.executeNum;
                order.refundMsg = info.refundMsg;
                let site = order.site;
                let user = order.user;
                let product = order.product;
                let productSite = order.productSite;
                if (order.executeNum < 1) {
                }
                else {
                }
            }));
        });
    }
    static orderRefundTatio(tem, ratio, order, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let refundFunds = parseFloat(utils_1.decimal(order.totalPrice).times(ratio).toFixed(4));
            let userOldFunds = user.funds;
            user.funds = parseFloat(utils_1.decimal(userOldFunds).plus(refundFunds).toFixed(4));
            user.freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).minus(refundFunds).toFixed(4));
            user = yield tem.save(user);
            let consume = new FundsRecordUser_1.FundsRecordUser();
            consume.oldFunds = userOldFunds;
            consume.funds = refundFunds;
            consume.newFunds = user.funds;
            consume.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
            consume.type = FundsRecordBase_1.FundsRecordType.Order;
            consume.description = order.name + ',撤销订单。 单价： ￥' + order.price + ', 下单数量： ' + order.num + ', 执行数量： 0';
            consume.user = user;
            yield tem.save(consume);
        });
    }
    static applyRefund(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let order = yield COrderUser.getOrderInfo(tem, info.id);
                utils_1.assert(order.status !== OrderUser_1.OrderStatus.Finish, '当前订单已经执行完毕，不能撤销');
                let site = order.site;
                let user = order.user;
                let product = order.product;
                let productSite = order.productSite;
                if (order.status === OrderUser_1.OrderStatus.Wait) {
                    yield COrderUser.orderRefundTatio(tem, 1, order, user);
                    order.executeNum = 0;
                    order.status = OrderUser_1.OrderStatus.Finish;
                    order.refundMsg = '未开始执行，用户撤销。';
                    order.finishTime = utils_1.now();
                    order.user = user;
                    order = yield tem.save(order);
                    if (order.type === ProductTypeBase_1.WitchType.Site) {
                        io.emit(site.id + 'refundOrder', { productId: productSite.id, order: order });
                        io.emit(site.id + 'minusBadge', productSite.id);
                    }
                    else {
                        io.emit('refundOrder', { productId: product.id, order: order });
                        io.emit('minusBadge', product.id);
                    }
                    return order;
                }
                else {
                    order.status = OrderUser_1.OrderStatus.Refund;
                    order = yield tem.save(order);
                    let error = new ErrorOrderUser_1.ErrorOrderUser();
                    error.type = order.type;
                    error.content = '申请撤销订单';
                    error.order = order;
                    error.site = site;
                    error = yield tem.save(error);
                    if (error.type === ProductTypeBase_1.WitchType.Site) {
                        io.emit(site.id + 'plusBadge', 'orderErrorSite');
                        io.emit(site.id + 'addOrderError', error);
                    }
                    else {
                        io.emit('plusBadge', 'orderErrorPlatform');
                        io.emit('addOrderError', error);
                    }
                    return order;
                }
            }));
        });
    }
    static addError(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { orderId, content } = info;
            let order = yield OrderUser_1.OrderUser.findByIdWithSite(orderId);
            let error = new ErrorOrderUser_1.ErrorOrderUser();
            error.type = order.type;
            error.content = content;
            error.order = order;
            error.site = order.site;
            error = yield error.save();
            if (error.type === ProductTypeBase_1.WitchType.Site) {
                io.emit(error.site.id + 'plusBadge', 'orderErrorSite');
                io.emit(error.site.id + 'addOrderError', error);
            }
            else {
                io.emit('plusBadge', 'orderErrorPlatform');
                io.emit('addOrderError', error);
            }
        });
    }
    static getErrors(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.allByOrderId(orderId);
        });
    }
    static seeErrors(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield OrderUser_1.OrderUser.update(orderId, { newErrorDeal: false });
        });
    }
}
exports.COrderUser = COrderUser;
//# sourceMappingURL=COrderUser.js.map