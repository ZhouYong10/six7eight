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
class CRightAdmin {
    static show() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightAdmin_1.RightAdmin.findTrees();
        });
    }
    static add(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { type, name, icon, path, fingerprint, parentId } = info;
            let right = new RightAdmin_1.RightAdmin();
            right.setType = type;
            right.name = name;
            right.icon = icon;
            right.path = path;
            right.fingerprint = fingerprint;
            if (parentId) {
                right.parent = yield RightAdmin_1.RightAdmin.findById(parentId);
            }
            if (right.getType === RightBase_1.RightType.MenuGroup || right.getType === RightBase_1.RightType.Menu) {
                right.children = [];
            }
            return yield right.save();
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let { id, name, icon, fingerprint, path } = info;
            yield RightAdmin_1.RightAdmin.update(id, {
                name: name,
                icon: icon,
                fingerprint: fingerprint,
                path: path
            });
        });
    }
}
exports.CRightAdmin = CRightAdmin;
//# sourceMappingURL=CRightAdmin.js.map