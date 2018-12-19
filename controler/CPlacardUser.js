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
    static getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.PlacardUser.getAll(page);
        });
    }
    static getSiteAll(siteId, page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUser_1.PlacardUser.getSiteAll(siteId, page);
        });
    }
    static add(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = new PlacardUser_1.PlacardUser();
            placard.content = info.content;
            placard.user = info.user;
            placard.site = info.site;
            placard = yield placard.save();
            io.emit(info.site.id + 'addPlacardToFrontUser', placard);
            return placard;
        });
    }
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = yield PlacardUser_1.PlacardUser.findById(info.id);
            placard.content = info.content;
            placard = yield placard.save();
            io.emit(info.siteId + 'editPlacardToFrontUser', placard);
            return placard;
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