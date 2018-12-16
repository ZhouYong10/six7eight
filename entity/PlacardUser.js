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
var PlacardUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const PlacardBase_1 = require("./PlacardBase");
const Site_1 = require("./Site");
const UserSite_1 = require("./UserSite");
let PlacardUser = PlacardUser_1 = class PlacardUser extends PlacardBase_1.PlacardBase {
    static p() {
        return typeorm_1.getRepository(PlacardUser_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.p().save(this);
        });
    }
    static query(name) {
        return PlacardUser_1.p().createQueryBuilder(name);
    }
    static getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.query('placard')
                .leftJoinAndSelect('placard.site', 'site')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('placard.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static getSiteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.query('placard')
                .innerJoin('placard.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .leftJoinAndSelect('placard.user', 'user')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('placard.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static update(id, placard) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.p().update(id, placard);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.p().delete(id);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.placards),
    __metadata("design:type", Site_1.Site)
], PlacardUser.prototype, "site", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.placards),
    __metadata("design:type", UserSite_1.UserSite)
], PlacardUser.prototype, "user", void 0);
PlacardUser = PlacardUser_1 = __decorate([
    typeorm_1.Entity()
], PlacardUser);
exports.PlacardUser = PlacardUser;
//# sourceMappingURL=PlacardUser.js.map