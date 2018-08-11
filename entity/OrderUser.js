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
const ConsumeUser_1 = require("./ConsumeUser");
const ProfitUser_1 = require("./ProfitUser");
const ProfitSite_1 = require("./ProfitSite");
let OrderUser = class OrderUser {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], OrderUser.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        readonly: true
    }),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Number)
], OrderUser.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column('timestamp'),
    __metadata("design:type", Number)
], OrderUser.prototype, "dealTime", void 0);
__decorate([
    typeorm_1.Column('timestamp'),
    __metadata("design:type", Number)
], OrderUser.prototype, "completeTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "price", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], OrderUser.prototype, "num", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], OrderUser.prototype, "totalPrice", void 0);
__decorate([
    typeorm_1.OneToOne(type => ConsumeUser_1.ConsumeUser, consumeUser => consumeUser.order),
    typeorm_1.JoinColumn(),
    __metadata("design:type", ConsumeUser_1.ConsumeUser)
], OrderUser.prototype, "consume", void 0);
__decorate([
    typeorm_1.OneToMany(type => ProfitUser_1.ProfitUser, profitUser => profitUser.order),
    __metadata("design:type", Array)
], OrderUser.prototype, "profitsUser", void 0);
__decorate([
    typeorm_1.OneToOne(type => ProfitSite_1.ProfitSite, profitSite => profitSite.order),
    typeorm_1.JoinColumn(),
    __metadata("design:type", ProfitSite_1.ProfitSite)
], OrderUser.prototype, "profitSite", void 0);
OrderUser = __decorate([
    typeorm_1.Entity()
], OrderUser);
exports.OrderUser = OrderUser;
//# sourceMappingURL=OrderUser.js.map