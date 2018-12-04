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
const PlacardUserSite_1 = require("../entity/PlacardUserSite");
class CPlacardUserSite {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.PlacardUserSite.getAll();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = new PlacardUserSite_1.PlacardUserSite();
            placard.content = info.content;
            placard.userSee = info.userSee;
            placard.user = info.user;
            placard.sites = info.sites;
            return yield placard.save();
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = yield PlacardUserSite_1.PlacardUserSite.findById(info.id);
            placard.content = info.content;
            placard.userSee = info.userSee;
            placard.sites = info.sites;
            return yield placard.save();
        });
    }
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.PlacardUserSite.delById(id);
        });
    }
    static getPlacardsOf(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.PlacardUserSite.findOf(siteId);
        });
    }
}
exports.CPlacardUserSite = CPlacardUserSite;
//# sourceMappingURL=CPlacardUserSite.js.map