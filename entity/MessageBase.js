"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
var MessageTitle;
(function (MessageTitle) {
    MessageTitle["OrderError"] = "\u8BA2\u5355\u62A5\u9519\u5904\u7406";
    MessageTitle["OrderRefund"] = "\u8BA2\u5355\u9000\u6B3E\u5904\u7406";
    MessageTitle["Recharge"] = "\u5145\u503C\u5230\u8D26";
    MessageTitle["RechargeError"] = "\u5145\u503C\u5931\u8D25";
    MessageTitle["Withdraw"] = "\u63D0\u73B0\u5230\u8D26";
    MessageTitle["WithdrawError"] = "\u63D0\u73B0\u5931\u8D25";
    MessageTitle["Feedback"] = "\u95EE\u9898\u53CD\u9988\u5904\u7406";
    MessageTitle["PlatformMsg"] = "\u7CFB\u7EDF\u6D88\u606F";
})(MessageTitle = exports.MessageTitle || (exports.MessageTitle = {}));
class MessageBase {
    constructor() {
        this.state = false;
    }
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], MessageBase.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamp',
        transformer: { from(dVal) {
                return utils_1.myDateFromat(dVal);
            }, to(eVal) {
                return eVal;
            } },
        readonly: true
    }),
    __metadata("design:type", String)
], MessageBase.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: MessageTitle,
        readonly: true
    }),
    __metadata("design:type", String)
], MessageBase.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], MessageBase.prototype, "state", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MessageBase.prototype, "content", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MessageBase.prototype, "frontUrl", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], MessageBase.prototype, "aimId", void 0);
exports.MessageBase = MessageBase;
//# sourceMappingURL=MessageBase.js.map