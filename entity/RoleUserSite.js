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
var RoleUserSite_1;
"use strict";
const typeorm_1 = require("typeorm");
const RoleBase_1 = require("./RoleBase");
const UserSite_1 = require("./UserSite");
const Site_1 = require("./Site");
var RoleUserSiteType;
(function (RoleUserSiteType) {
    RoleUserSiteType["Site"] = "role_site";
    RoleUserSiteType["User"] = "role_user";
})(RoleUserSiteType = exports.RoleUserSiteType || (exports.RoleUserSiteType = {}));
let RoleUserSite = RoleUserSite_1 = class RoleUserSite extends RoleBase_1.RoleBase {
    constructor() {
        super(...arguments);
        this.type = RoleUserSiteType.User;
    }
    static p() {
        return typeorm_1.getRepository(RoleUserSite_1);
    }
    static query(name) {
        return RoleUserSite_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.p().save(this);
        });
    }
    static getAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.query('role')
                .innerJoin('role.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .orderBy('role.createTime', 'DESC')
                .getMany();
        });
    }
    static typeUserAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.query('role')
                .innerJoin('role.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .where('role.type = :type', { type: RoleUserSiteType.User })
                .orderBy('role.createTime', 'DESC')
                .getMany();
        });
    }
    static update(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.p().update(id, role);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.p().findOne(id);
        });
    }
    ;
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.p().delete(id);
        });
    }
    static findByIdWithRelations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserSite_1.p().findOne(id, { relations: ['users'] });
        });
    }
};
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: RoleUserSiteType,
        readonly: true
    }),
    __metadata("design:type", String)
], RoleUserSite.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 60
    }),
    __metadata("design:type", String)
], RoleUserSite.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(type => UserSite_1.UserSite, userSite => userSite.role),
    __metadata("design:type", Array)
], RoleUserSite.prototype, "users", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.rolesUserSite),
    __metadata("design:type", Site_1.Site)
], RoleUserSite.prototype, "site", void 0);
RoleUserSite = RoleUserSite_1 = __decorate([
    typeorm_1.Entity()
], RoleUserSite);
exports.RoleUserSite = RoleUserSite;
//# sourceMappingURL=RoleUserSite.js.map