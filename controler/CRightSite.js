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
const RightBase_1 = require("../entity/RightBase");
const RightSite_1 = require("../entity/RightSite");
const typeorm_1 = require("typeorm");
const RoleUserSite_1 = require("../entity/RoleUserSite");
class CRightSite {
    static show() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightSite_1.RightSite.findTrees();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { type, name, icon, path, fingerprint, parentId } = info;
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let right = new RightSite_1.RightSite();
                right.setType = type;
                right.name = name;
                right.icon = icon;
                right.path = path;
                right.fingerprint = fingerprint;
                if (parentId) {
                    right.parent = (yield tem.findOne(RightSite_1.RightSite, parentId));
                    right.pId = right.parent.id;
                }
                else {
                    right.pId = '0';
                }
                if (right.getType === RightBase_1.RightType.MenuGroup || right.getType === RightBase_1.RightType.Menu) {
                    right.children = [];
                }
                yield CRightSite.updateRoleUserSiteFingerprint(tem, fingerprint);
                return yield tem.save(right);
            }));
        });
    }
    static updateRoleUserSiteFingerprint(tem, fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleSites = yield tem.createQueryBuilder()
                .select('role')
                .from(RoleUserSite_1.RoleUserSite, 'role')
                .where('role.type = :type', { type: RoleUserSite_1.RoleUserSiteType.Site })
                .getMany();
            for (let i = 0; i < roleSites.length; i++) {
                let roleSite = roleSites[i];
                roleSite.rights.push(fingerprint);
                roleSite.editRights.push(fingerprint);
                yield tem.save(roleSite);
            }
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, name, icon, fingerprint, path } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let rightSite = yield tem.findOne(RightSite_1.RightSite, id);
                rightSite.name = name;
                rightSite.icon = icon;
                rightSite.fingerprint = fingerprint;
                rightSite.path = path;
                yield CRightSite.updateRoleUserSiteFingerprint(tem, fingerprint);
                yield tem.save(rightSite);
            }));
        });
    }
    static changeRightSort(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { rightDrag, rightDrop } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                yield tem.update(RightSite_1.RightSite, rightDrag.id, { num: rightDrag.num, pId: rightDrag.parentId });
                yield tem.createQueryBuilder()
                    .relation(RightSite_1.RightSite, 'parent')
                    .of(rightDrag.id)
                    .set(rightDrag.parentId === '0' ? null : rightDrag.parentId);
                yield tem.update(RightSite_1.RightSite, rightDrop.id, { num: rightDrop.num });
            }));
        });
    }
}
exports.CRightSite = CRightSite;
//# sourceMappingURL=CRightSite.js.map