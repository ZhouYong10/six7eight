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
class ProfitBase {
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProfitBase.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        readonly: true
    }),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Number)
], ProfitBase.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 100
    }),
    __metadata("design:type", String)
], ProfitBase.prototype, "profitUsername", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProfitBase.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 400
    }),
    __metadata("design:type", String)
], ProfitBase.prototype, "description", void 0);
exports.ProfitBase = ProfitBase;
//# sourceMappingURL=ProfitBase.js.map