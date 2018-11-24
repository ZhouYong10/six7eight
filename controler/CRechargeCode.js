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
const RechargeCode_1 = require("../entity/RechargeCode");
class CRechargeCode {
    static getOne(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let rechargeCode = yield RechargeCode_1.RechargeCode.getCode(info);
            return rechargeCode.code;
        });
    }
}
exports.CRechargeCode = CRechargeCode;
//# sourceMappingURL=CRechargeCode.js.map