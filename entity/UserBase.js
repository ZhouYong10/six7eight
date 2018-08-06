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
var UserState;
(function (UserState) {
    UserState["Normal"] = "normal";
    UserState["Freeze"] = "freeze";
    UserState["Ban"] = "ban";
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
    typeorm_1.Column({
        type: "timestamp",
        readonly: true
    }),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", typeorm_1.Timestamp)
], UserBase.prototype, "registerTime", void 0);
__decorate([
    typeorm_1.Column({
        type: "timestamp",
        nullable: true
    }),
    __metadata("design:type", typeorm_1.Timestamp)
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
        length: 18,
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