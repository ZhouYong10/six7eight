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
const Recharge_1 = require("../entity/Recharge");
class CRecharge {
    static findByAlipayId(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.findHandCommited(info.alipayId);
        });
    }
    static handAdd(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let recharge = yield Recharge_1.Recharge.findAutoCommited(info.alipayId);
            if (recharge) {
            }
            else {
                recharge = new Recharge_1.Recharge();
                recharge.alipayId = info.alipayId;
                recharge.type = Recharge_1.RechargeType.User;
                recharge.way = Recharge_1.RechargeWay.Hand;
                recharge.user = info.user;
                recharge.site = info.site;
                yield recharge.save();
            }
        });
    }
    static userAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Recharge_1.Recharge.userAllRecords(userId);
        });
    }
}
exports.CRecharge = CRecharge;
//# sourceMappingURL=CRecharge.js.map