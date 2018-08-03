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
const ProfitBase_1 = require("./ProfitBase");
const OrderUser_1 = require("./OrderUser");
const Site_1 = require("./Site");
const User_1 = require("./User");
let ProfitSite = class ProfitSite extends ProfitBase_1.ProfitBase {
};
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 50
    }),
    __metadata("design:type", String)
], ProfitSite.prototype, "siteName", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProfitSite.prototype, "siteOldProfit", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], ProfitSite.prototype, "siteNewProfit", void 0);
__decorate([
    typeorm_1.OneToOne(type => OrderUser_1.OrderUser, orderUser => orderUser.profitSite),
    __metadata("design:type", OrderUser_1.OrderUser)
], ProfitSite.prototype, "order", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.giveProfitsSite),
    __metadata("design:type", User_1.User)
], ProfitSite.prototype, "profitUser", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.profits),
    __metadata("design:type", Site_1.Site)
], ProfitSite.prototype, "site", void 0);
ProfitSite = __decorate([
    typeorm_1.Entity()
], ProfitSite);
exports.ProfitSite = ProfitSite;
//# sourceMappingURL=ProfitSite.js.map