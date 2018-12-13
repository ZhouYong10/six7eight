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
class ProductBase {
    constructor() {
        this.attrs = [];
    }
    menuRightItem() {
        return {
            id: this.id,
            name: this.name,
            onSale: this.onSale,
            fingerprint: this.id,
            type: 'product',
            waitCount: 0
        };
    }
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], ProductBase.prototype, "id", void 0);
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
], ProductBase.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 50
    }),
    __metadata("design:type", String)
], ProductBase.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 6,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProductBase.prototype, "sitePrice", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProductBase.prototype, "topPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProductBase.prototype, "superPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProductBase.prototype, "goldPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 1000
    }),
    __metadata("design:type", String)
], ProductBase.prototype, "orderTip", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], ProductBase.prototype, "onSale", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ProductBase.prototype, "minNum", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], ProductBase.prototype, "speed", void 0);
__decorate([
    typeorm_1.Column('simple-json'),
    __metadata("design:type", Array)
], ProductBase.prototype, "attrs", void 0);
exports.ProductBase = ProductBase;
//# sourceMappingURL=ProductBase.js.map