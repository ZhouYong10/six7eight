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
    static clear(day) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("开始清除" + day + "天前的平台公告记录");
            yield PlacardUserSite_1.PlacardUserSite.clearPlacardUserSite(day);
            console.log("清除平台公告记录完成");
        });
    }
    static getAll(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield PlacardUserSite_1.PlacardUserSite.getAll(page);
        });
    }
    static add(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = new PlacardUserSite_1.PlacardUserSite();
            placard.content = info.content;
            placard.siteSee = info.siteSee;
            placard.userSee = info.userSee;
            placard.user = info.user;
            placard.sites = info.sites;
            placard = yield placard.save();
            for (let i = 0; i < info.sites.length; i++) {
                let site = info.sites[i];
                if (placard.userSee) {
                    io.emit(site.id + 'addPlacardToFrontUser', placard);
                }
                if (placard.siteSee) {
                    io.emit(site.id + 'addPlacardToSiteAdmin', placard);
                }
            }
            return placard;
        });
    }
    static update(info, io) {
        return __awaiter(this, void 0, void 0, function* () {
            let placard = yield PlacardUserSite_1.PlacardUserSite.findById(info.id);
            placard.content = info.content;
            placard.siteSee = info.siteSee;
            placard.userSee = info.userSee;
            placard.sites = info.sites;
            placard = yield placard.save();
            for (let i = 0; i < info.sites.length; i++) {
                let site = info.sites[i];
                if (placard.userSee) {
                    io.emit(site.id + 'editPlacardToFrontUser', placard);
                }
                if (placard.siteSee) {
                    io.emit(site.id + 'editPlacardToSiteAdmin', placard);
                }
            }
            return placard;
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