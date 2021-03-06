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
var MessageUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const MessageBase_1 = require("./MessageBase");
const User_1 = require("./User");
let MessageUser = MessageUser_1 = class MessageUser extends MessageBase_1.MessageBase {
    static p() {
        return typeorm_1.getRepository(MessageUser_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUser_1.p().save(this);
        });
    }
    static query(name) {
        return MessageUser_1.p().createQueryBuilder(name);
    }
    static getWaitCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUser_1.query('msg')
                .innerJoin('msg.user', 'user', 'user.id = :id', { id: userId })
                .getCount();
        });
    }
    static loadMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUser_1.query('msg')
                .innerJoin('msg.user', 'user', 'user.id = :id', { id: userId })
                .orderBy('msg.createTime', 'ASC')
                .getManyAndCount();
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield MessageUser_1.p().delete(id);
        });
    }
    static clearMessageUser(day) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection()
                .createQueryBuilder()
                .delete()
                .from(MessageUser_1)
                .where('DATE_ADD(createTime, INTERVAL :day DAY) < NOW()', { day: day })
                .execute();
        });
    }
};
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, user => user.messages),
    __metadata("design:type", User_1.User)
], MessageUser.prototype, "user", void 0);
MessageUser = MessageUser_1 = __decorate([
    typeorm_1.Entity()
], MessageUser);
exports.MessageUser = MessageUser;
//# sourceMappingURL=MessageUser.js.map