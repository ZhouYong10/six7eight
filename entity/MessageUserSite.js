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
var MessageUserSite_1;
"use strict";
const typeorm_1 = require("typeorm");
const MessageBase_1 = require("./MessageBase");
const UserSite_1 = require("./UserSite");
let MessageUserSite = MessageUserSite_1 = class MessageUserSite extends MessageBase_1.MessageBase {
    static p() {
        return typeorm_1.getRepository(MessageUserSite_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUserSite_1.p().save(this);
        });
    }
    static query(name) {
        return MessageUserSite_1.p().createQueryBuilder(name);
    }
    static getWaitCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUserSite_1.query('msg')
                .innerJoin('msg.user', 'user', 'user.id = :id', { id: userId })
                .getCount();
        });
    }
    static loadMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUserSite_1.query('msg')
                .innerJoin('msg.user', 'user', 'user.id = :id', { id: userId })
                .orderBy('msg.createTime', 'ASC')
                .getManyAndCount();
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUserSite_1.p().delete(id);
        });
    }
};
__decorate([
    typeorm_1.ManyToOne(type => UserSite_1.UserSite, userSite => userSite.messages),
    __metadata("design:type", UserSite_1.UserSite)
], MessageUserSite.prototype, "user", void 0);
MessageUserSite = MessageUserSite_1 = __decorate([
    typeorm_1.Entity()
], MessageUserSite);
exports.MessageUserSite = MessageUserSite;
//# sourceMappingURL=MessageUserSite.js.map