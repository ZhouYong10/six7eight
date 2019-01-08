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
var Platform_1;
"use strict";
const typeorm_1 = require("typeorm");
let Platform = Platform_1 = class Platform {
    constructor() {
        this.name = '678网络营销平台';
        this.canRegister = true;
        this.canAddUser = true;
        this.userWithdrawScale = 0;
        this.siteWithdrawScale = 0;
    }
    static p() {
        return typeorm_1.getRepository(Platform_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Platform_1.p().save(this);
        });
    }
    static query(name) {
        return Platform_1.p().createQueryBuilder(name);
    }
    static update(id, platform) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Platform_1.p().update(id, platform);
        });
    }
    static find() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Platform_1.p().findOne();
        });
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Platform.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Platform.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Platform.prototype, "canRegister", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Boolean)
], Platform.prototype, "canAddUser", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Platform.prototype, "siteYearPrice", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Platform.prototype, "baseFunds", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Platform.prototype, "allProfit", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Platform.prototype, "userWithdrawMin", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Platform.prototype, "userWithdrawScale", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Platform.prototype, "siteWithdrawMin", void 0);
__decorate([
    typeorm_1.Column({
        type: "decimal",
        precision: 13,
        scale: 4
    }),
    __metadata("design:type", Number)
], Platform.prototype, "siteWithdrawScale", void 0);
Platform = Platform_1 = __decorate([
    typeorm_1.Entity()
], Platform);
exports.Platform = Platform;
//# sourceMappingURL=Platform.js.map