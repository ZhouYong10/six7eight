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
const PlacardUser_1 = require("../entity/PlacardUser");
class CPlacardUser {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.PlacardUser.getAll();
        });
    }
    static editInfo(placard, info) {
        return __awaiter(this, void 0, void 0, function* () {
            placard.content = info.content;
            placard.user = info.user;
            placard.site = info.site;
            return yield placard.save();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = new PlacardUser_1.PlacardUser();
            placard.content = info.content;
            placard.user = info.user;
            placard.site = info.site;
            return yield placard.save();
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = yield PlacardUser_1.PlacardUser.findById(info.id);
            placard.content = info.content;
            return yield placard.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.PlacardUser.delById(id);
        });
    }
}
exports.CPlacardUser = CPlacardUser;
//# sourceMappingURL=CPlacardUser.js.map