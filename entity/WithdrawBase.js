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
class WithdrawBase {
    constructor() {
        this.createTime = utils_1.now();
    }
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], WithdrawBase.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 20,
        readonly: true
    }),
    __metadata("design:type", Object)
], WithdrawBase.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], WithdrawBase.prototype, "alipayCount", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], WithdrawBase.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], WithdrawBase.prototype, "userOldFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], WithdrawBase.prototype, "userNewFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 100
    }),
    __metadata("design:type", String)
], WithdrawBase.prototype, "username", void 0);
exports.WithdrawBase = WithdrawBase;
//# sourceMappingURL=WithdrawBase.js.map