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
const User_1 = require("./User");
let RoleUser = class RoleUser extends RoleBase_1.RoleBase {
    constructor() {
        super(...arguments);
        this.rights = [];
    }
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], RoleUser.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        type: "simple-json"
    }),
    __metadata("design:type", Object)
], RoleUser.prototype, "rights", void 0);
__decorate([
    typeorm_1.OneToMany(type => User_1.User, user => user.role),
    __metadata("design:type", Array)
], RoleUser.prototype, "users", void 0);
RoleUser = __decorate([
    typeorm_1.Entity()
], RoleUser);
exports.RoleUser = RoleUser;
//# sourceMappingURL=RoleUser.js.map