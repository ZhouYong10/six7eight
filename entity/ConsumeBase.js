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
var ConsumeType;
(function (ConsumeType) {
    ConsumeType["Plus"] = "plus_consume";
    ConsumeType["Minus"] = "minus_consume";
})(ConsumeType = exports.ConsumeType || (exports.ConsumeType = {}));
class ConsumeBase {
    constructor() {
        this.state = ConsumeType.Minus;
    }
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ConsumeBase.prototype, "id", void 0);
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
], ConsumeBase.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], ConsumeBase.prototype, "userOldFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], ConsumeBase.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 20,
        scale: 4
    }),
    __metadata("design:type", Number)
], ConsumeBase.prototype, "userNewFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: ConsumeType
    }),
    __metadata("design:type", String)
], ConsumeBase.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 60
    }),
    __metadata("design:type", String)
], ConsumeBase.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 200
    }),
    __metadata("design:type", String)
], ConsumeBase.prototype, "description", void 0);
exports.ConsumeBase = ConsumeBase;
//# sourceMappingURL=ConsumeBase.js.map