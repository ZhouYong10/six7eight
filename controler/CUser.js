"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
class CUser {
    constructor(query) {
        this.query = query;
    }
    saveUser() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = new User_1.User();
            user.username = this.query.name;
            user.setPassword(this.query.password);
            const userRepository = typeorm_1.getRepository(User_1.User);
            yield userRepository.save(user);
            return user;
        });
    }
}
exports.CUser = CUser;
//# sourceMappingURL=CUser.js.map