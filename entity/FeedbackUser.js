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
const FeedbackBase_1 = require("./FeedbackBase");
const typeorm_1 = require("typeorm");
const Site_1 = require("./Site");
const User_1 = require("./User");
const UserSite_1 = require("./UserSite");
let FeedbackUser = class FeedbackUser extends FeedbackBase_1.FeedbackBase {
};
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.feedbacksUser),
    __metadata("design:type", Site_1.Site)
], FeedbackUser.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.feedbacks),
    __metadata("design:type", User_1.User)
], FeedbackUser.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.dealFeedbacks),
    __metadata("design:type", UserSite_1.UserSite)
], FeedbackUser.prototype, "dealUser", void 0);
FeedbackUser = __decorate([
    typeorm_1.Entity()
], FeedbackUser);
exports.FeedbackUser = FeedbackUser;
//# sourceMappingURL=FeedbackUser.js.map