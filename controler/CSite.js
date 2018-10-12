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
const CRoleUser_1 = require("./CRoleUser");
const RoleUser_1 = require("../entity/RoleUser");
const RightUser_1 = require("../entity/RightUser");
class CSite {
    static all() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Site_1.Site.getAll();
        });
    }
    static editInfo(site, info) {
        return __awaiter(this, void 0, void 0, function* () {
            site.name = info.name;
            site.address = info.address;
            site.phone = info.phone;
            site.weixin = info.weixin;
            site.qq = info.qq;
            site.email = info.email;
            return yield site.save();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let siteSaved = yield CSite.editInfo(new Site_1.Site(), info);
            yield CRoleUser_1.CRoleUser.save({
                name: '顶级代理',
                type: RoleUser_1.RoleType.Top,
                rights: [yield RightUser_1.RightUser.findTrees(), yield RightUser_1.RightUser.getAllLeaf()],
                site: siteSaved
            });
            yield CRoleUser_1.CRoleUser.save({
                name: '超级代理',
                type: RoleUser_1.RoleType.Super,
                rights: [yield RightUser_1.RightUser.findTrees(), yield RightUser_1.RightUser.getAllLeaf()],
                site: siteSaved
            });
            yield CRoleUser_1.CRoleUser.save({
                name: '金牌代理',
                type: RoleUser_1.RoleType.Gold,
                rights: [yield RightUser_1.RightUser.findTrees(), yield RightUser_1.RightUser.getAllLeaf()],
                site: siteSaved
            });
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
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CSite.editInfo(yield Site_1.Site.findById(info.id), info);
        });
    }
}
exports.CSite = CSite;
//# sourceMappingURL=CSite.js.map