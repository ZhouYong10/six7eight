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
var PlacardUserSite_1;
"use strict";
const typeorm_1 = require("typeorm");
const PlacardBase_1 = require("./PlacardBase");
const UserAdmin_1 = require("./UserAdmin");
const Site_1 = require("./Site");
let PlacardUserSite = PlacardUserSite_1 = class PlacardUserSite extends PlacardBase_1.PlacardBase {
    static p() {
        return typeorm_1.getRepository(PlacardUserSite_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.p().save(this);
        });
    }
    static query(name) {
        return PlacardUserSite_1.p().createQueryBuilder(name);
    }
    static getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.query('placard')
                .leftJoinAndSelect('placard.user', 'user')
                .leftJoinAndSelect('placard.sites', 'site')
                .skip((page.currentPage - 1) * page.pageSize)
                .take(page.pageSize)
                .orderBy('placard.createTime', 'DESC')
                .getManyAndCount();
        });
    }
    static update(id, placard) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.p().update(id, placard);
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.p().delete(id);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.p().findOne(id);
        });
    }
    ;
    static findOf(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return PlacardUserSite_1.query('placard')
                .innerJoin('placard.sites', 'site', 'site.id = :id', { id: siteId })
                .where('placard.siteSee = :siteSee', { siteSee: true })
                .limit(8)
                .orderBy('placard.createTime', 'DESC')
                .getMany();
        });
    }
    static getUserPlacards(siteAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.query('placard')
                .innerJoin('placard.sites', 'site', 'site.address = :address', { address: siteAddress })
                .where('placard.userSee = :userSee', { userSee: true })
                .orderBy('placard.createTime', 'DESC')
                .limit(3)
                .getMany();
        });
    }
    static clearPlacardUserSite(day) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .delete()
                .from(PlacardUserSite_1)
                .where('DATE_ADD(createTime, INTERVAL :day DAY) < NOW()', { day: day })
                .execute();
        });
    }
};
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], PlacardUserSite.prototype, "userSee", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], PlacardUserSite.prototype, "siteSee", void 0);
__decorate([
    typeorm_1.ManyToOne(type => UserAdmin_1.UserAdmin, userAdmin => userAdmin.placards),
    __metadata("design:type", UserAdmin_1.UserAdmin)
], PlacardUserSite.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Site_1.Site, site => site.platformPlacards),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], PlacardUserSite.prototype, "sites", void 0);
PlacardUserSite = PlacardUserSite_1 = __decorate([
    typeorm_1.Entity()
], PlacardUserSite);
exports.PlacardUserSite = PlacardUserSite;
//# sourceMappingURL=PlacardUserSite.js.map