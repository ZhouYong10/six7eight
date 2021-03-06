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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var FeedbackUser_1;
"use strict";
const FeedbackBase_1 = require("./FeedbackBase");
const typeorm_1 = require("typeorm");
const Site_1 = require("./Site");
const User_1 = require("./User");
const UserSite_1 = require("./UserSite");
const UserAdmin_1 = require("./UserAdmin");
let FeedbackUser = FeedbackUser_1 = class FeedbackUser extends FeedbackBase_1.FeedbackBase {
    static p() {
        return typeorm_1.getRepository(FeedbackUser_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.p().save(this);
        });
    }
    static query(name) {
        return FeedbackUser_1.p().createQueryBuilder(name);
    }
    static getWaitCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.query('feedback')
                .where('feedback.isDeal = :isDeal', { isDeal: false })
                .getCount();
        });
    }
    static getSiteWaitCount(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.query('feedback')
                .innerJoin('feedback.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .where('feedback.isDeal = :isDeal', { isDeal: false })
                .getCount();
        });
    }
    static getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.query('feedback')
                .leftJoinAndSelect('feedback.site', 'site')
                .leftJoinAndSelect('feedback.user', 'user')
                .leftJoinAndSelect('feedback.dealUserAdmin', 'dealUser')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('feedback.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static siteGetAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.query('feedback')
                .innerJoin('feedback.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .leftJoinAndSelect('feedback.user', 'user')
                .leftJoinAndSelect('feedback.dealUserSite', 'dealUser')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('feedback.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static userGetAll(userId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.query('feedback')
                .innerJoin('feedback.user', 'user', 'user.id = :userId', { userId: userId })
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('feedback.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static update(id, feedback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.p().update(id, feedback);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.p().delete(id);
        });
    }
    static findByIdPlain(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.p().findOne(id);
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield FeedbackUser_1.p().findOne(id, { relations: ['site', 'user'] });
        });
    }
    ;
    static clearFeedbackUser(day) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .delete()
                .from(FeedbackUser_1)
                .where('DATE_ADD(createTime, INTERVAL :day DAY) < NOW()', { day: day })
                .execute();
        });
    }
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
    typeorm_1.ManyToOne(type => UserAdmin_1.UserAdmin, userAdmin => userAdmin.dealUserFeedbacks),
    __metadata("design:type", UserAdmin_1.UserAdmin)
], FeedbackUser.prototype, "dealUserAdmin", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.dealUserFeedbacks),
    __metadata("design:type", UserSite_1.UserSite)
], FeedbackUser.prototype, "dealUserSite", void 0);
FeedbackUser = FeedbackUser_1 = __decorate([
    typeorm_1.Entity()
], FeedbackUser);
exports.FeedbackUser = FeedbackUser;
//# sourceMappingURL=FeedbackUser.js.map