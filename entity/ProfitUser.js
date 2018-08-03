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
const OrderUser_1 = require("./OrderUser");
const User_1 = require("./User");
const ProfitBase_1 = require("./ProfitBase");
let ProfitUser = class ProfitUser extends ProfitBase_1.ProfitBase {
};
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 100
    }),
    __metadata("design:type", String)
], ProfitUser.prototype, "profitToUsername", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProfitUser.prototype, "userOldProfit", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProfitUser.prototype, "userNewProfit", void 0);
__decorate([
    typeorm_1.ManyToOne(type => OrderUser_1.OrderUser, orderUser => orderUser.profitsUser),
    __metadata("design:type", OrderUser_1.OrderUser)
], ProfitUser.prototype, "order", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.giveProfitsUser),
    __metadata("design:type", User_1.User)
], ProfitUser.prototype, "profitUser", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.getProfits),
    __metadata("design:type", User_1.User)
], ProfitUser.prototype, "profitToUser", void 0);
ProfitUser = __decorate([
    typeorm_1.Entity()
], ProfitUser);
exports.ProfitUser = ProfitUser;
//# sourceMappingURL=ProfitUser.js.map