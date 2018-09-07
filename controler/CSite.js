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
const Site_1 = require("../entity/Site");
const CUserSite_1 = require("./CUserSite");
const CRoleUserSite_1 = require("./CRoleUserSite");
const RightSite_1 = require("../entity/RightSite");
class CSite {
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let site = new Site_1.Site();
            site.name = info.name;
            site.address = info.address;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            let siteSaved = yield site.save();
            let roleUserSite = yield CRoleUserSite_1.CRoleUserSite.save({
                site: siteSaved,
                name: '系统管理员',
                rights: [yield RightSite_1.RightSite.findTrees(), yield RightSite_1.RightSite.getAllLeaf()]
            });
            let userSite = yield CUserSite_1.CUserSite.save({
                site: siteSaved,
                username: 'admin',
                password: '1234',
                phone: '',
                weixin: '',
                qq: '',
                email: '',
                role: roleUserSite
            });
            return siteSaved;
        });
    }
}
exports.CSite = CSite;
//# sourceMappingURL=CSite.js.map