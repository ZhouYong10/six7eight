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
const RechargeBase_1 = require("./RechargeBase");
const User_1 = require("./User");
const Site_1 = require("./Site");
let RechargeUser = class RechargeUser extends RechargeBase_1.RechargeBase {
};
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.recharges),
    __metadata("design:type", User_1.User)
], RechargeUser.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.rechargesUser),
    __metadata("design:type", Site_1.Site)
], RechargeUser.prototype, "site", void 0);
RechargeUser = __decorate([
    typeorm_1.Entity()
], RechargeUser);
exports.RechargeUser = RechargeUser;
//# sourceMappingURL=RechargeUser.js.map