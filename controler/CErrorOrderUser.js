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
const ErrorOrderUser_1 = require("../entity/ErrorOrderUser");
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
const ProductTypeBase_1 = require("../entity/ProductTypeBase");
const COrderUser_1 = require("./COrderUser");
const MessageUser_1 = require("../entity/MessageUser");
const MessageBase_1 = require("../entity/MessageBase");
class CErrorOrderUser {
    static platformAll(productIds, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.platformAll(productIds, page);
        });
    }
    static getWaitCount(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.getWaitCount(productIds);
        });
    }
    static getSiteWaitCount(productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.getSiteWaitCount(productIds);
        });
    }
    static siteAll(productIds, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.siteAll(productIds, page);
        });
    }
    static dealError(info, user, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, dealContent } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let error = yield tem.createQueryBuilder()
                    .select('error')
                    .from(ErrorOrderUser_1.ErrorOrderUser, 'error')
                    .where('error.id = :id', { id: id })
                    .leftJoinAndSelect('error.order', 'order')
                    .leftJoinAndSelect('order.user', 'user')
                    .getOne();
                let order = error.order;
                order.newErrorDeal = true;
                order = yield tem.save(order);
                error.isDeal = true;
                error.dealContent = dealContent;
                error.dealTime = utils_1.now();
                if (error.type === ProductTypeBase_1.WitchType.Platform) {
                    error.userAdmin = user;
                    io.emit("minusOrderErrorBadge", { fingerprint: 'orderErrorPlatform', productId: error.productId });
                    io.emit("dealOrderError", error);
                }
                else {
                    error.userSite = user;
                    io.emit(error.siteId + "minusOrderErrorBadge", { fingerprint: 'orderErrorSite', productId: error.productId });
                    io.emit(error.siteId + "dealOrderError", error);
                }
                yield tem.save(error);
                io.emit(order.productSiteId + "hasErrorDeal", order);
                let message = new MessageUser_1.MessageUser();
                message.user = order.user;
                message.title = MessageBase_1.MessageTitle.OrderError;
                message.content = `${order.name} -- ${error.dealContent}`;
                message.frontUrl = `/product/${order.productSiteId}`;
                message.aimId = order.id;
                yield tem.save(message);
                io.emit(order.user.id + 'plusMessageNum');
            }));
        });
    }
    static dealErrorOrderRefund(info, user, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let error = yield tem.createQueryBuilder()
                    .select('error')
                    .from(ErrorOrderUser_1.ErrorOrderUser, 'error')
                    .where('error.id = :id', { id: info.errorId })
                    .leftJoinAndSelect('error.order', 'order')
                    .leftJoinAndSelect('order.user', 'user')
                    .getOne();
                let order = error.order;
                order.newErrorDeal = true;
                yield tem.save(order);
                error.isDeal = true;
                error.dealContent = info.refundMsg;
                error.dealTime = utils_1.now();
                if (error.type === ProductTypeBase_1.WitchType.Platform) {
                    error.userAdmin = user;
                    io.emit("minusOrderErrorBadge", { fingerprint: 'orderErrorPlatform', productId: error.productId });
                    io.emit("dealOrderError", error);
                }
                else {
                    error.userSite = user;
                    io.emit(error.siteId + "minusOrderErrorBadge", { fingerprint: 'orderErrorSite', productId: error.productId });
                    io.emit(error.siteId + "dealOrderError", error);
                }
                yield tem.save(error);
                io.emit(order.productSiteId + "hasErrorDeal", order);
            }));
            yield COrderUser_1.COrderUser.backout({
                id: info.orderId,
                executeNum: info.executeNum,
                refundMsg: info.refundMsg
            }, io);
        });
    }
    static dealErrorOrderAccount(info, user, io) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let error = yield tem.createQueryBuilder()
                    .select('error')
                    .from(ErrorOrderUser_1.ErrorOrderUser, 'error')
                    .where('error.id = :id', { id: info.errorId })
                    .leftJoinAndSelect('error.order', 'order')
                    .leftJoinAndSelect('order.user', 'user')
                    .getOne();
                let order = error.order;
                order.newErrorDeal = true;
                yield tem.save(order);
                error.isDeal = true;
                error.dealContent = info.dealContent;
                error.dealTime = utils_1.now();
                yield tem.save(error);
                if (error.type === ProductTypeBase_1.WitchType.Platform) {
                    error.userAdmin = user;
                    io.emit("minusOrderErrorBadge", { fingerprint: 'orderErrorPlatform', productId: error.productId });
                    io.emit("dealOrderError", error);
                }
                else {
                    error.userSite = user;
                    io.emit(error.siteId + "minusOrderErrorBadge", { fingerprint: 'orderErrorSite', productId: error.productId });
                    io.emit(error.siteId + "dealOrderError", error);
                }
                io.emit(order.productSiteId + "hasErrorDeal", order);
                let message = new MessageUser_1.MessageUser();
                message.user = order.user;
                message.title = MessageBase_1.MessageTitle.OrderError;
                message.content = `${order.name} -- ${error.dealContent}`;
                message.frontUrl = `/product/${order.productSiteId}`;
                message.aimId = order.id;
                yield tem.save(message);
                io.emit(order.user.id + 'plusMessageNum');
            }));
            yield COrderUser_1.COrderUser.handleAccount(info.orderId, io);
        });
    }
}
exports.CErrorOrderUser = CErrorOrderUser;
//# sourceMappingURL=CErrorOrderUser.js.map