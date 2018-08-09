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
const RoleBase_1 = require("./RoleBase");
const UserSite_1 = require("./UserSite");
let RoleUserSite = class RoleUserSite extends RoleBase_1.RoleBase {
};
__decorate([
    typeorm_1.OneToMany(type => UserSite_1.UserSite, userSite => userSite.role),
    __metadata("design:type", Array)
], RoleUserSite.prototype, "users", void 0);
RoleUserSite = __decorate([
    typeorm_1.Entity()
], RoleUserSite);
exports.RoleUserSite = RoleUserSite;
//# sourceMappingURL=RoleUserSite.js.map