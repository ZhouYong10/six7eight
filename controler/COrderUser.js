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
const Site_1 = require("../entity/Site");
const Platform_1 = require("../entity/Platform");
const FundsRecordSite_1 = require("../entity/FundsRecordSite");
const FundsRecordPlatform_1 = require("../entity/FundsRecordPlatform");
class COrderUser {
    static getWaitCount(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.getWaitCount(productId);
        });
    }
    static getSiteWaitCount(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.getSiteWaitCount(productId);
        });
    }
    static findUserOrdersByProductId(productId, userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findUserOrdersByProductId(productId, userId, page);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findByIdPlain(id);
        });
    }
    static findPlatformOrdersByProductId(productId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findPlatformOrdersByProductId(productId, page);
        });
    }
    static findSiteOrdersByProductId(productId, siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield OrderUser_1.OrderUser.findSiteOrdersByProductId(productId, siteId, page);
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
                if (parent.role.greaterThan(user.role)) {
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
                    let profitPriceSite = utils_1.decimal(product.getPriceByUserRole(user.role)).minus(product.sitePrice);
                    profits.push({
                        type: 'site',
                        id: site.id,
                        name: site.name,
                        profit: parseFloat(utils_1.decimal(profitPriceSite).times(num).toFixed(4))
                    });
                    let profitPricePlatform = utils_1.decimal(product.sitePrice).minus(product.price);
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
                consume.description = order.name + ', 单价: ￥' + order.price + ', 下单数量: ' + order.num;
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
                utils_1.assert(order.status === OrderUser_1.OrderStatus.Wait, '当前订单' + order.status + ', 不可执行');
                order.status = OrderUser_1.OrderStatus.Execute;
                order.startNum = info.startNum;
                order.dealTime = utils_1.now();
                let site = order.site;
                let user = order.user;
                let product = order.product;
                let productSite = order.productSite;
                for (let i = 0; i < order.profits.length; i++) {
                    let aim = order.profits[i];
                    switch (aim.type) {
                        case 'user':
                            let user = yield tem.findOne(User_1.User, aim.id);
                            let userOldFunds = user.funds;
                            user.funds = parseFloat(utils_1.decimal(userOldFunds).plus(aim.profit).toFixed(4));
                            yield tem.save(user);
                            let userFundsRecord = new FundsRecordUser_1.FundsRecordUser();
                            userFundsRecord.oldFunds = userOldFunds;
                            userFundsRecord.funds = aim.profit;
                            userFundsRecord.newFunds = user.funds;
                            userFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                            userFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                            userFundsRecord.profitUsername = order.user.username;
                            userFundsRecord.description = '下级: ' + userFundsRecord.profitUsername + ', 订单: ' + order.name +
                                ' , 返利: ￥' + userFundsRecord.funds;
                            userFundsRecord.user = user;
                            yield tem.save(userFundsRecord);
                            io.emit(user.id + 'changeFunds', user.funds);
                            break;
                        case 'site':
                            let siteProfitFunds = aim.profit;
                            if (order.type === ProductTypeBase_1.WitchType.Site) {
                                siteProfitFunds = parseFloat(utils_1.decimal(siteProfitFunds).plus(order.basePrice).toFixed(4));
                            }
                            let site = yield tem.findOne(Site_1.Site, aim.id);
                            let siteOldFunds = site.funds;
                            site.funds = parseFloat(utils_1.decimal(siteOldFunds).plus(siteProfitFunds).toFixed(4));
                            yield tem.save(site);
                            let siteFundsRecord = new FundsRecordSite_1.FundsRecordSite();
                            siteFundsRecord.oldFunds = siteOldFunds;
                            siteFundsRecord.funds = siteProfitFunds;
                            siteFundsRecord.newFunds = site.funds;
                            siteFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                            siteFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                            siteFundsRecord.profitUsername = order.user.username;
                            siteFundsRecord.description = '用户: ' + siteFundsRecord.profitUsername + ', 订单: ' + order.name +
                                ' , 返利: ￥' + siteFundsRecord.funds;
                            if (order.type === ProductTypeBase_1.WitchType.Site) {
                                siteFundsRecord.baseFunds = order.basePrice;
                            }
                            siteFundsRecord.site = site;
                            yield tem.save(siteFundsRecord);
                            io.emit(site.id + 'changeFunds', site.funds);
                            break;
                        case 'platform':
                            let platform = yield tem.findOne(Platform_1.Platform);
                            let platformOldFunds = platform.allProfit;
                            platform.allProfit = parseFloat(utils_1.decimal(platformOldFunds).plus(aim.profit).toFixed(4));
                            platform.baseFunds = parseFloat(utils_1.decimal(platform.baseFunds).plus(order.basePrice).toFixed(4));
                            yield tem.save(platform);
                            let pFundsRecord = new FundsRecordPlatform_1.FundsRecordPlatform();
                            pFundsRecord.oldFunds = platformOldFunds;
                            pFundsRecord.funds = aim.profit;
                            pFundsRecord.newFunds = platform.allProfit;
                            pFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                            pFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                            pFundsRecord.profitUsername = order.user.username;
                            pFundsRecord.description = '用户: ' + pFundsRecord.profitUsername + ', 订单: ' + order.name +
                                ' , 返利: ￥' + pFundsRecord.funds;
                            pFundsRecord.baseFunds = order.basePrice;
                            yield tem.save(pFundsRecord);
                            io.emit('platformChangeFunds', { baseFunds: platform.baseFunds, profit: platform.allProfit });
                            break;
                    }
                }
                user.freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).minus(order.totalPrice).toFixed(4));
                yield tem.save(user);
                yield tem.save(order);
                io.emit(user.id + 'changeFreezeFunds', user.freezeFunds);
                if (order.type === ProductTypeBase_1.WitchType.Platform) {
                    io.emit('minusBadge', product.id);
                    io.emit('executeOrder', { productId: product.id, order: order });
                }
                else {
                    io.emit(site.id + 'minusBadge', productSite.id);
                    io.emit(site.id + 'executeOrder', { productId: productSite.id, order: order });
                }
                io.emit(productSite.id + 'executeOrder', order);
            }));
        });
    }
    static refund(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let order = yield COrderUser.getOrderInfo(tem, info.id);
                utils_1.assert(order.status !== OrderUser_1.OrderStatus.Refunded, '订单已经撤销了，不能再次撤销');
                utils_1.assert(info.executeNum <= order.num, '订单执行数量不能大于下单数量');
                order.executeNum = info.executeNum;
                order.refundMsg = info.refundMsg;
                order.finishTime = utils_1.now();
                let site = order.site;
                let user = order.user;
                let product = order.product;
                let productSite = order.productSite;
                if (order.status === OrderUser_1.OrderStatus.Wait) {
                    order.executeNum = 0;
                    order.profits = [];
                    order.basePrice = 0;
                    let userOldFunds = user.funds;
                    user.funds = parseFloat(utils_1.decimal(userOldFunds).plus(order.totalPrice).toFixed(4));
                    user.freezeFunds = parseFloat(utils_1.decimal(user.freezeFunds).minus(order.totalPrice).toFixed(4));
                    yield tem.save(user);
                    let userFundsRecord = new FundsRecordUser_1.FundsRecordUser();
                    userFundsRecord.oldFunds = userOldFunds;
                    userFundsRecord.funds = order.totalPrice;
                    userFundsRecord.newFunds = user.funds;
                    userFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                    userFundsRecord.type = FundsRecordBase_1.FundsRecordType.Order;
                    userFundsRecord.description = '撤销订单: ' + order.name + '. 单价: ￥' + order.price +
                        ', 下单数量: ' + order.num + ', 执行数量: ' + order.executeNum;
                    userFundsRecord.user = user;
                    yield tem.save(userFundsRecord);
                    if (order.type === ProductTypeBase_1.WitchType.Platform) {
                        io.emit('minusBadge', product.id);
                    }
                    else {
                        io.emit(site.id + 'minusBadge', productSite.id);
                    }
                }
                else {
                    let refundRatio = parseFloat(utils_1.decimal(order.num - order.executeNum).div(order.num).toFixed(4));
                    let refundBasePrice = parseFloat(utils_1.decimal(order.basePrice).times(refundRatio).toFixed(4));
                    order.basePrice = parseFloat(utils_1.decimal(order.basePrice).minus(refundBasePrice).toFixed(4));
                    for (let i = 0; i < order.profits.length; i++) {
                        let aim = order.profits[i];
                        let refundProfitFunds = parseFloat(utils_1.decimal(aim.profit).times(refundRatio).toFixed(4));
                        aim.profit = parseFloat(utils_1.decimal(aim.profit).minus(refundProfitFunds).toFixed(4));
                        switch (aim.type) {
                            case 'user':
                                let user = yield tem.findOne(User_1.User, aim.id);
                                let userOldFunds = user.funds;
                                user.funds = parseFloat(utils_1.decimal(userOldFunds).minus(refundProfitFunds).toFixed(4));
                                yield tem.save(user);
                                let userFundsRecord = new FundsRecordUser_1.FundsRecordUser();
                                userFundsRecord.oldFunds = userOldFunds;
                                userFundsRecord.funds = refundProfitFunds;
                                userFundsRecord.newFunds = user.funds;
                                userFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                                userFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                                userFundsRecord.profitUsername = order.user.username;
                                userFundsRecord.description = '下级: ' + userFundsRecord.profitUsername + ', 订单: ' + order.name +
                                    ' 撤销, 退款: ￥' + userFundsRecord.funds;
                                userFundsRecord.user = user;
                                yield tem.save(userFundsRecord);
                                io.emit(user.id + 'changeFunds', user.funds);
                                break;
                            case 'site':
                                if (order.type === ProductTypeBase_1.WitchType.Site) {
                                    refundProfitFunds = parseFloat(utils_1.decimal(refundProfitFunds).plus(refundBasePrice).toFixed(4));
                                }
                                let site = yield tem.findOne(Site_1.Site, aim.id);
                                let siteOldFunds = site.funds;
                                site.funds = parseFloat(utils_1.decimal(siteOldFunds).minus(refundProfitFunds).toFixed(4));
                                yield tem.save(site);
                                let siteFundsRecord = new FundsRecordSite_1.FundsRecordSite();
                                siteFundsRecord.oldFunds = siteOldFunds;
                                siteFundsRecord.funds = refundProfitFunds;
                                siteFundsRecord.newFunds = site.funds;
                                siteFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                                siteFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                                siteFundsRecord.profitUsername = order.user.username;
                                siteFundsRecord.description = '用户: ' + siteFundsRecord.profitUsername + ', 订单: ' + order.name +
                                    ' 撤销, 退款: ￥' + siteFundsRecord.funds;
                                if (order.type === ProductTypeBase_1.WitchType.Site) {
                                    siteFundsRecord.baseFunds = refundBasePrice;
                                }
                                siteFundsRecord.site = site;
                                yield tem.save(siteFundsRecord);
                                io.emit(site.id + 'changeFunds', site.funds);
                                break;
                            case 'platform':
                                let platform = yield tem.findOne(Platform_1.Platform);
                                let platformOldFunds = platform.allProfit;
                                platform.allProfit = parseFloat(utils_1.decimal(platformOldFunds).minus(refundProfitFunds).toFixed(4));
                                platform.baseFunds = parseFloat(utils_1.decimal(platform.baseFunds).minus(refundBasePrice).toFixed(4));
                                yield tem.save(platform);
                                let pFundsRecord = new FundsRecordPlatform_1.FundsRecordPlatform();
                                pFundsRecord.oldFunds = platformOldFunds;
                                pFundsRecord.funds = refundProfitFunds;
                                pFundsRecord.newFunds = platform.allProfit;
                                pFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Minus;
                                pFundsRecord.type = FundsRecordBase_1.FundsRecordType.Profit;
                                pFundsRecord.profitUsername = order.user.username;
                                pFundsRecord.description = '用户: ' + pFundsRecord.profitUsername + ', 订单: ' + order.name +
                                    ' 撤销, 退款: ￥' + pFundsRecord.funds;
                                pFundsRecord.baseFunds = refundBasePrice;
                                yield tem.save(pFundsRecord);
                                io.emit('platformChangeFunds', { baseFunds: platform.baseFunds, profit: platform.allProfit });
                                break;
                        }
                    }
                    let userRefundPrice = parseFloat(utils_1.decimal(order.totalPrice).times(refundRatio).toFixed(4));
                    let userOldFunds = user.funds;
                    user.funds = parseFloat(utils_1.decimal(userOldFunds).plus(userRefundPrice).toFixed(4));
                    yield tem.save(user);
                    let userFundsRecord = new FundsRecordUser_1.FundsRecordUser();
                    userFundsRecord.oldFunds = userOldFunds;
                    userFundsRecord.funds = userRefundPrice;
                    userFundsRecord.newFunds = user.funds;
                    userFundsRecord.upOrDown = FundsRecordBase_1.FundsUpDown.Plus;
                    userFundsRecord.type = FundsRecordBase_1.FundsRecordType.Order;
                    userFundsRecord.description = '撤销订单: ' + order.name + '. 单价: ￥' + order.price +
                        ', 下单数量: ' + order.num + ', 执行数量: ' + order.executeNum;
                    userFundsRecord.user = user;
                    yield tem.save(userFundsRecord);
                }
                order.status = OrderUser_1.OrderStatus.Refunded;
                yield tem.save(order);
                io.emit(user.id + 'changeFundsAndFreezeFunds', { funds: user.funds, freezeFunds: user.freezeFunds });
                if (order.type === ProductTypeBase_1.WitchType.Platform) {
                    io.emit('refundOrder', { productId: product.id, order: order });
                }
                else {
                    io.emit(site.id + 'refundOrder', { productId: productSite.id, order: order });
                }
                io.emit(productSite.id + 'refundOrder', order);
            }));
        });
    }
    static applyRefund(orderId, io) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let order = yield tem.createQueryBuilder()
                    .select('order')
                    .from(OrderUser_1.OrderUser, 'order')
                    .where('order.id = :id', { id: orderId })
                    .leftJoinAndSelect('order.site', 'site')
                    .getOne();
                utils_1.assert((order.status !== OrderUser_1.OrderStatus.Refunded), '当前订单已经撤销了, 不能再次申请撤销');
                let site = order.site;
                let error = new ErrorOrderUser_1.ErrorOrderUser();
                error.type = order.type;
                error.content = '用户申请撤销订单';
                error.order = order;
                error.productId = (order.type === ProductTypeBase_1.WitchType.Site ? order.productSiteId : order.productId);
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
            }));
        });
    }
    static addError(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { orderId, content } = info;
            let order = yield OrderUser_1.OrderUser.findByIdWithSite(orderId);
            let error = new ErrorOrderUser_1.ErrorOrderUser();
            error.type = order.type;
            error.productId = (order.type === ProductTypeBase_1.WitchType.Site ? order.productSiteId : order.productId);
            error.content = content;
            error.order = order;
            error.site = order.site;
            error = yield error.save();
            if (error.type === ProductTypeBase_1.WitchType.Site) {
                io.emit(error.site.id + 'plusOrderErrorBadge', { fingerprint: 'orderErrorSite', productId: error.productId });
                io.emit(error.site.id + 'addOrderError', error);
            }
            else {
                io.emit('plusOrderErrorBadge', { fingerprint: 'orderErrorPlatform', productId: error.productId });
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