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
const PlacardBase_1 = require("./PlacardBase");
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
let PlacardUser = class PlacardUser extends PlacardBase_1.PlacardBase {
};
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.placards),
    __metadata("design:type", Site_1.Site)
], PlacardUser.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.placards),
    __metadata("design:type", UserSite_1.UserSite)
], PlacardUser.prototype, "user", void 0);
PlacardUser = __decorate([
    typeorm_1.Entity()
], PlacardUser);
exports.PlacardUser = PlacardUser;
//# sourceMappingURL=PlacardUser.js.map