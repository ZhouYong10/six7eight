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
class CErrorOrderUser {
    static platformAll(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.platformAll(info);
        });
    }
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.getWaitCount();
        });
    }
    static getSiteWaitCount(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.getSiteWaitCount(siteId);
        });
    }
    static siteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.siteAll(siteId, page);
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
                    .leftJoinAndSelect('error.site', 'site')
                    .leftJoinAndSelect('order.productSite', 'product')
                    .getOne();
                let order = error.order;
                let product = order.productSite;
                order.newErrorDeal = true;
                error.isDeal = true;
                error.dealContent = dealContent;
                error.dealTime = utils_1.now();
                if (error.type === ProductTypeBase_1.WitchType.Platform) {
                    error.userAdmin = user;
                    io.emit("minusBadge", 'orderErrorPlatform');
                    io.emit("dealOrderError", error);
                }
                else {
                    error.userSite = user;
                    io.emit(error.site.id + "minusBadge", 'orderErrorSite');
                    io.emit(error.site.id + "dealOrderError", error);
                }
                yield tem.save(error);
                order = yield tem.save(order);
                io.emit(product.id + "hasErrorDeal", order);
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
                    .leftJoinAndSelect('error.site', 'site')
                    .leftJoinAndSelect('order.productSite', 'product')
                    .getOne();
                let site = error.site;
                let order = error.order;
                let product = order.productSite;
                order.newErrorDeal = true;
                yield tem.save(order);
                error.isDeal = true;
                error.dealContent = info.refundMsg;
                error.dealTime = utils_1.now();
                if (error.type === ProductTypeBase_1.WitchType.Platform) {
                    error.userAdmin = user;
                    io.emit("minusBadge", 'orderErrorPlatform');
                    io.emit("dealOrderError", error);
                }
                else {
                    error.userSite = user;
                    io.emit(site.id + "minusBadge", 'orderErrorSite');
                    io.emit(site.id + "dealOrderError", error);
                }
                yield tem.save(error);
                io.emit(product.id + "hasErrorDeal", order);
            }));
            yield COrderUser_1.COrderUser.refund({
                id: info.orderId,
                executeNum: info.executeNum,
                refundMsg: info.refundMsg
            }, io);
        });
    }
}
exports.CErrorOrderUser = CErrorOrderUser;
//# sourceMappingURL=CErrorOrderUser.js.map