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
const ConsumeBase_1 = require("./ConsumeBase");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const OrderUser_1 = require("./OrderUser");
let ConsumeUser = class ConsumeUser extends ConsumeBase_1.ConsumeBase {
};
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.consumes),
    __metadata("design:type", User_1.User)
], ConsumeUser.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => OrderUser_1.OrderUser, orderUser => orderUser.consumes),
    __metadata("design:type", OrderUser_1.OrderUser)
], ConsumeUser.prototype, "order", void 0);
ConsumeUser = __decorate([
    typeorm_1.Entity()
], ConsumeUser);
exports.ConsumeUser = ConsumeUser;
//# sourceMappingURL=ConsumeUser.js.map