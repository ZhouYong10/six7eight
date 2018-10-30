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
const bcrypt = require("bcryptjs");
const utils_1 = require("../utils");
var UserState;
(function (UserState) {
    UserState["Normal"] = "\u6B63\u5E38";
    UserState["Freeze"] = "\u51BB\u7ED3";
    UserState["Ban"] = "\u7981\u7528";
})(UserState = exports.UserState || (exports.UserState = {}));
var UserType;
(function (UserType) {
    UserType["Platform"] = "platform";
    UserType["Site"] = "site";
    UserType["User"] = "user";
})(UserType = exports.UserType || (exports.UserType = {}));
class UserBase {
    constructor() {
        this.state = UserState.Normal;
    }
    set password(password) {
        this._password = bcrypt.hashSync(password, 10);
    }
    get password() {
        return this._password;
    }
    set setState(state) {
        switch (state) {
            case 'normal':
                this.state = UserState.Normal;
                break;
            case 'freeze':
                this.state = UserState.Freeze;
                break;
            default:
                this.state = UserState.Ban;
        }
    }
    get getState() {
        return this.state;
    }
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], UserBase.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 100,
        unique: true
    }),
    __metadata("design:type", String)
], UserBase.prototype, "username", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 100
    }),
    __metadata("design:type", String)
], UserBase.prototype, "_password", void 0);
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
], UserBase.prototype, "registerTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "timestamp",
        transformer: { from(dVal) {
                return utils_1.myDateFromat(dVal);
            }, to(eVal) {
                return eVal;
            } },
        nullable: true
    }),
    __metadata("design:type", String)
], UserBase.prototype, "lastLoginTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: UserState
    }),
    __metadata("design:type", String)
], UserBase.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 16,
        nullable: true
    }),
    __metadata("design:type", String)
], UserBase.prototype, "qq", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 14,
        nullable: true
    }),
    __metadata("design:type", String)
], UserBase.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 32,
        nullable: true
    }),
    __metadata("design:type", String)
], UserBase.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({
        type: "char",
        length: 18,
        nullable: true
    }),
    __metadata("design:type", String)
], UserBase.prototype, "weixin", void 0);
exports.UserBase = UserBase;
//# sourceMappingURL=UserBase.js.map