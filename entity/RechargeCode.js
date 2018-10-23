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
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
const User_1 = require("./User");
const utils_1 = require("../utils");
const Recharge_1 = require("./Recharge");
var rechargeType;
(function (rechargeType) {
    rechargeType["Site"] = "site_recharge";
    rechargeType["User"] = "user_recharge";
})(rechargeType = exports.rechargeType || (exports.rechargeType = {}));
let RechargeCode = class RechargeCode {
    constructor() {
        this.beUsed = false;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], RechargeCode.prototype, "id", void 0);
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
], RechargeCode.prototype, "createTime", void 0);
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
], RechargeCode.prototype, "usedTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 10,
        unique: true
    }),
    __metadata("design:type", String)
], RechargeCode.prototype, "code", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 16,
        unique: true
    }),
    __metadata("design:type", String)
], RechargeCode.prototype, "type", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], RechargeCode.prototype, "beUsed", void 0);
__decorate([
    typeorm_1.OneToOne(type => Recharge_1.Recharge, recharge => recharge.rechargeCode),
    __metadata("design:type", Recharge_1.Recharge)
], RechargeCode.prototype, "recharge", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.rechargeCodes),
    __metadata("design:type", UserSite_1.UserSite)
], RechargeCode.prototype, "userSite", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.rechargeCodes),
    __metadata("design:type", User_1.User)
], RechargeCode.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.rechargeCodes),
    __metadata("design:type", Site_1.Site)
], RechargeCode.prototype, "site", void 0);
RechargeCode = __decorate([
    typeorm_1.Entity()
], RechargeCode);
exports.RechargeCode = RechargeCode;
//# sourceMappingURL=RechargeCode.js.map