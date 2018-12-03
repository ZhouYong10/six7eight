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
const ConsumeBase_1 = require("./ConsumeBase");
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
let ConsumeSite = class ConsumeSite extends ConsumeBase_1.ConsumeBase {
};
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.consumes),
    __metadata("design:type", Site_1.Site)
], ConsumeSite.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.consumes),
    __metadata("design:type", UserSite_1.UserSite)
], ConsumeSite.prototype, "userSite", void 0);
ConsumeSite = __decorate([
    typeorm_1.Entity()
], ConsumeSite);
exports.ConsumeSite = ConsumeSite;
//# sourceMappingURL=ConsumeSite.js.map