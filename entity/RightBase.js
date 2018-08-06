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
class RightBase {
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], RightBase.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 36,
        unique: true
    }),
    __metadata("design:type", String)
], RightBase.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 60,
        unique: true
    }),
    __metadata("design:type", String)
], RightBase.prototype, "nameDec", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 60,
        nullable: true
    }),
    __metadata("design:type", String)
], RightBase.prototype, "path", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], RightBase.prototype, "isParent", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], RightBase.prototype, "isChild", void 0);
__decorate([
    typeorm_1.Column({
        type: 'simple-json'
    }),
    __metadata("design:type", Object)
], RightBase.prototype, "funcs", void 0);
exports.RightBase = RightBase;
//# sourceMappingURL=RightBase.js.map