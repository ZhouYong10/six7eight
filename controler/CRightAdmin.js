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
const RightAdmin_1 = require("../entity/RightAdmin");
const RightBase_1 = require("../entity/RightBase");
const typeorm_1 = require("typeorm");
const RoleUserAdmin_1 = require("../entity/RoleUserAdmin");
class CRightAdmin {
    static show() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightAdmin_1.RightAdmin.findTrees();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { type, name, icon, path, fingerprint, parentId } = info;
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let right = new RightAdmin_1.RightAdmin();
                right.setType = type;
                right.name = name;
                right.icon = icon;
                right.path = path;
                right.fingerprint = fingerprint;
                if (parentId) {
                    right.parent = (yield tem.findOne(RightAdmin_1.RightAdmin, parentId));
                    right.pId = right.parent.id;
                }
                else {
                    right.pId = '0';
                }
                if (right.getType === RightBase_1.RightType.MenuGroup || right.getType === RightBase_1.RightType.Menu) {
                    right.children = [];
                }
                yield CRightAdmin.updateRoleUserAdminFingerprint(tem, fingerprint);
                return yield tem.save(right);
            }));
        });
    }
    static updateRoleUserAdminFingerprint(tem, fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleAdmins = yield tem.createQueryBuilder()
                .select('role')
                .from(RoleUserAdmin_1.RoleUserAdmin, 'role')
                .where('role.type = :type', { type: RoleUserAdmin_1.RoleUserAdminType.Developer })
                .getMany();
            for (let i = 0; i < roleAdmins.length; i++) {
                let roleAdmin = roleAdmins[i];
                roleAdmin.rights.push(fingerprint);
                roleAdmin.editRights.push(fingerprint);
                yield tem.save(roleAdmin);
            }
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, name, icon, fingerprint, path } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let rightAdmin = yield tem.findOne(RightAdmin_1.RightAdmin, id);
                rightAdmin.name = name;
                rightAdmin.icon = icon;
                rightAdmin.fingerprint = fingerprint;
                rightAdmin.path = path;
                yield CRightAdmin.updateRoleUserAdminFingerprint(tem, fingerprint);
                yield tem.save(rightAdmin);
            }));
        });
    }
    static changeRightSort(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { rightDrag, rightDrop } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                yield tem.update(RightAdmin_1.RightAdmin, rightDrag.id, { num: rightDrag.num, pId: rightDrag.parentId });
                yield tem.createQueryBuilder()
                    .relation(RightAdmin_1.RightAdmin, 'parent')
                    .of(rightDrag.id)
                    .set(rightDrag.parentId === '0' ? null : rightDrag.parentId);
                yield tem.update(RightAdmin_1.RightAdmin, rightDrop.id, { num: rightDrop.num });
            }));
        });
    }
}
exports.CRightAdmin = CRightAdmin;
//# sourceMappingURL=CRightAdmin.js.map