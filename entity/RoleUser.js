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
var RoleUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const RoleBase_1 = require("./RoleBase");
const User_1 = require("./User");
const Site_1 = require("./Site");
var RoleType;
(function (RoleType) {
    RoleType["Top"] = "top";
    RoleType["Super"] = "super";
    RoleType["Gold"] = "gold";
})(RoleType = exports.RoleType || (exports.RoleType = {}));
let RoleUser = RoleUser_1 = class RoleUser extends RoleBase_1.RoleBase {
    static p() {
        return typeorm_1.getRepository(RoleUser_1);
    }
    static query(name) {
        return RoleUser_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.p().save(this);
        });
    }
    getLowerRole(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleType;
            switch (this.type) {
                case RoleType.Top:
                    roleType = RoleType.Super;
                    break;
                case RoleType.Super:
                    roleType = RoleType.Gold;
                    break;
                default:
                    roleType = RoleType.Gold;
                    break;
            }
            return yield RoleUser_1.query('role')
                .innerJoin('role.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .where('role.type = :roleType', { roleType: roleType })
                .getOne();
        });
    }
    static getAll(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.query('role')
                .innerJoin('role.site', 'site', 'site.id = :siteId', { siteId: siteId })
                .orderBy('role.createTime', 'DESC')
                .getMany();
        });
    }
    static update(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.p().update(id, role);
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.p().findOne(id);
        });
    }
    ;
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.p().delete(id);
        });
    }
    static findByIdWithRelations(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUser_1.p().findOne(id, { relations: ['users'] });
        });
    }
};
__decorate([
    typeorm_1.Column({
        type: 'char',
        length: 60
    }),
    __metadata("design:type", String)
], RoleUser.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({
        type: "enum",
        enum: RoleType
    }),
    __metadata("design:type", String)
], RoleUser.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Site_1.Site, site => site.rolesUser),
    __metadata("design:type", Site_1.Site)
], RoleUser.prototype, "site", void 0);
__decorate([
    typeorm_1.OneToMany(type => User_1.User, user => user.role),
    __metadata("design:type", Array)
], RoleUser.prototype, "users", void 0);
RoleUser = RoleUser_1 = __decorate([
    typeorm_1.Entity()
], RoleUser);
exports.RoleUser = RoleUser;
//# sourceMappingURL=RoleUser.js.map