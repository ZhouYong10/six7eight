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
var ConsumeUpDown;
(function (ConsumeUpDown) {
    ConsumeUpDown["Plus"] = "plus_consume";
    ConsumeUpDown["Minus"] = "minus_consume";
})(ConsumeUpDown = exports.ConsumeUpDown || (exports.ConsumeUpDown = {}));
var ConsumeType;
(function (ConsumeType) {
    ConsumeType["Order"] = "\u8BA2\u5355\u6D88\u8D39";
    ConsumeType["Profit"] = "\u4E0B\u7EA7\u8FD4\u5229";
    ConsumeType["Recharge"] = "\u5145\u503C";
    ConsumeType["Withdraw"] = "\u63D0\u73B0";
    ConsumeType["Handle"] = "\u5E73\u53F0\u4FEE\u6539";
})(ConsumeType = exports.ConsumeType || (exports.ConsumeType = {}));
class FundsRecordBase {
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], FundsRecordBase.prototype, "id", void 0);
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
], FundsRecordBase.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], FundsRecordBase.prototype, "oldFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], FundsRecordBase.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], FundsRecordBase.prototype, "newFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: ConsumeUpDown
    }),
    __metadata("design:type", String)
], FundsRecordBase.prototype, "upOrDown", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: ConsumeType
    }),
    __metadata("design:type", String)
], FundsRecordBase.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 200
    }),
    __metadata("design:type", String)
], FundsRecordBase.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 100
    }),
    __metadata("design:type", String)
], FundsRecordBase.prototype, "profitUsername", void 0);
exports.FundsRecordBase = FundsRecordBase;
//# sourceMappingURL=FundsRecordBase.js.map