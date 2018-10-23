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
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
const User_1 = require("./User");
const RechargeCode_1 = require("./RechargeCode");
var RechargeType;
(function (RechargeType) {
    RechargeType["Site"] = "site_recharge";
    RechargeType["User"] = "user_recharge";
})(RechargeType = exports.RechargeType || (exports.RechargeType = {}));
let Recharge = class Recharge {
    constructor() {
        this.isDone = false;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Recharge.prototype, "id", void 0);
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
], Recharge.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'timestamp',
        transformer: { from(dVal) {
                return utils_1.myDateFromat(dVal);
            }, to(eVal) {
                return eVal;
            } },
        nullable: true
    }),
    __metadata("design:type", String)
], Recharge.prototype, "intoAccountTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Recharge.prototype, "alipayCount", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Recharge.prototype, "alipayId", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Recharge.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Recharge.prototype, "userOldFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Recharge.prototype, "userNewFunds", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Recharge.prototype, "isDone", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Recharge.prototype, "type", void 0);
__decorate([
    typeorm_1.OneToOne(type => RechargeCode_1.RechargeCode, rechargeCode => rechargeCode.recharge),
    __metadata("design:type", RechargeCode_1.RechargeCode)
], Recharge.prototype, "rechargeCode", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.recharges),
    __metadata("design:type", UserSite_1.UserSite)
], Recharge.prototype, "userSite", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.recharges),
    __metadata("design:type", User_1.User)
], Recharge.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.recharges),
    __metadata("design:type", Site_1.Site)
], Recharge.prototype, "site", void 0);
Recharge = __decorate([
    typeorm_1.Entity()
], Recharge);
exports.Recharge = Recharge;
//# sourceMappingURL=Recharge.js.map