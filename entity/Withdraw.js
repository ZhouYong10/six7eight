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
const User_1 = require("./User");
const UserSite_1 = require("./UserSite");
var WithdrawState;
(function (WithdrawState) {
    WithdrawState["Wait"] = "wait_withdraw";
    WithdrawState["Success"] = "success_withdraw";
    WithdrawState["Fail"] = "fail_withdraw";
})(WithdrawState = exports.WithdrawState || (exports.WithdrawState = {}));
var WithdrawType;
(function (WithdrawType) {
    WithdrawType["User"] = "user_withdraw";
    WithdrawType["Site"] = "site_withdraw";
})(WithdrawType = exports.WithdrawType || (exports.WithdrawType = {}));
let Withdraw = class Withdraw {
    constructor() {
        this.state = WithdrawState.Wait;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Withdraw.prototype, "id", void 0);
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
], Withdraw.prototype, "createTime", void 0);
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
], Withdraw.prototype, "dealTime", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "alipayCount", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "alipayName", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Withdraw.prototype, "funds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Withdraw.prototype, "oldFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 10,
        scale: 4
    }),
    __metadata("design:type", Number)
], Withdraw.prototype, "newFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: WithdrawState
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 100,
        nullable: true
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "failMsg", void 0);
__decorate([
    typeorm_1.Column({
        type: 'enum',
        enum: WithdrawType
    }),
    __metadata("design:type", String)
], Withdraw.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.withdraws),
    __metadata("design:type", User_1.User)
], Withdraw.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.withdraws),
    __metadata("design:type", UserSite_1.UserSite)
], Withdraw.prototype, "userSite", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.withdraws),
    __metadata("design:type", Site_1.Site)
], Withdraw.prototype, "site", void 0);
Withdraw = __decorate([
    typeorm_1.Entity()
], Withdraw);
exports.Withdraw = Withdraw;
//# sourceMappingURL=Withdraw.js.map