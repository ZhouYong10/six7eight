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
const RightUser_1 = require("../entity/RightUser");
const typeorm_1 = require("typeorm");
const RoleUser_1 = require("../entity/RoleUser");
class CRightUser {
    static show() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.RightUser.findTrees();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { type, name, icon, path, fingerprint, parentId } = info;
            return yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let right = new RightUser_1.RightUser();
                right.setType = type;
                right.name = name;
                right.icon = icon;
                right.path = path;
                right.fingerprint = fingerprint;
                if (parentId) {
                    right.parent = (yield tem.findOne(RightUser_1.RightUser, parentId));
                    right.pId = right.parent.id;
                }
                else {
                    right.pId = '0';
                }
                if (right.getType === RightBase_1.RightType.MenuGroup || right.getType === RightBase_1.RightType.Menu) {
                    right.children = [];
                }
                yield CRightUser.updateRoleUserFingerprint(tem, fingerprint);
                return yield tem.save(right);
            }));
        });
    }
    static updateRoleUserFingerprint(tem, fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            let roleUsers = yield tem.createQueryBuilder()
                .select('role')
                .from(RoleUser_1.RoleUser, 'role')
                .getMany();
            for (let i = 0; i < roleUsers.length; i++) {
                let roleUser = roleUsers[i];
                roleUser.rights.push(fingerprint);
                roleUser.editRights.push(fingerprint);
                yield tem.save(roleUser);
            }
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, name, icon, fingerprint, path } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                let rightUser = yield tem.findOne(RightUser_1.RightUser, id);
                rightUser.name = name;
                rightUser.icon = icon;
                rightUser.fingerprint = fingerprint;
                rightUser.path = path;
                yield CRightUser.updateRoleUserFingerprint(tem, fingerprint);
                yield tem.save(rightUser);
            }));
        });
    }
    static changeRightSort(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { rightDrag, rightDrop } = info;
            yield typeorm_1.getManager().transaction((tem) => __awaiter(this, void 0, void 0, function* () {
                yield tem.update(RightUser_1.RightUser, rightDrag.id, { num: rightDrag.num, pId: rightDrag.parentId });
                yield tem.createQueryBuilder()
                    .relation(RightUser_1.RightUser, 'parent')
                    .of(rightDrag.id)
                    .set(rightDrag.parentId === '0' ? null : rightDrag.parentId);
                yield tem.update(RightUser_1.RightUser, rightDrop.id, { num: rightDrop.num });
            }));
        });
    }
}
exports.CRightUser = CRightUser;
//# sourceMappingURL=CRightUser.js.map