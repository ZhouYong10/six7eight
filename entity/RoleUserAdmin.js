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
var RoleUserAdmin_1;
"use strict";
const typeorm_1 = require("typeorm");
const RoleBase_1 = require("./RoleBase");
const UserAdmin_1 = require("./UserAdmin");
let RoleUserAdmin = RoleUserAdmin_1 = class RoleUserAdmin extends RoleBase_1.RoleBase {
    static p() {
        return typeorm_1.getRepository(RoleUserAdmin_1);
    }
    static query(name) {
        return RoleUserAdmin_1.p().createQueryBuilder(name);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.p().save(this);
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.query('role')
                .orderBy('role.createTime', 'DESC')
                .getMany();
        });
    }
    static findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.p().findOne({ name: name });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RoleUserAdmin_1.p().findOne(id);
        });
    }
    ;
};
__decorate([
    typeorm_1.OneToMany(type => UserAdmin_1.UserAdmin, userAdmin => userAdmin.role),
    __metadata("design:type", Array)
], RoleUserAdmin.prototype, "users", void 0);
RoleUserAdmin = RoleUserAdmin_1 = __decorate([
    typeorm_1.Entity()
], RoleUserAdmin);
exports.RoleUserAdmin = RoleUserAdmin;
//# sourceMappingURL=RoleUserAdmin.js.map