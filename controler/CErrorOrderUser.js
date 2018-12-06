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
const OrderUser_1 = require("../entity/OrderUser");
const utils_1 = require("../utils");
const ProductTypeBase_1 = require("../entity/ProductTypeBase");
class CErrorOrderUser {
    static platformAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.platformAll();
        });
    }
    static siteAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ErrorOrderUser_1.ErrorOrderUser.siteAll(siteId);
        });
    }
    static dealError(info, user, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, dealContent } = info;
            return typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let error = yield tem.createQueryBuilder()
                    .select('error')
                    .from(ErrorOrderUser_1.ErrorOrderUser, 'error')
                    .where('error.id = :id', { id: id })
                    .leftJoinAndSelect('error.order', 'order')
                    .leftJoinAndSelect('order.productSite', 'product')
                    .getOne();
                let order = error.order;
                let product = order.productSite;
                error.isDeal = true;
                error.dealContent = dealContent;
                error.dealTime = utils_1.now();
                if (error.type === ProductTypeBase_1.WitchType.Platform) {
                    error.userAdmin = user;
                }
                else {
                    error.userSite = user;
                }
                error = yield tem.save(error);
                yield tem.update(OrderUser_1.OrderUser, order.id, { newErrorDeal: true });
                io.emit(product.id + "hasErrorDeal", order.id);
                return error;
            }));
        });
    }
}
exports.CErrorOrderUser = CErrorOrderUser;
//# sourceMappingURL=CErrorOrderUser.js.map