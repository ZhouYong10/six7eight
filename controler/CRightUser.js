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
class CRightUser {
    static show() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.RightUser.findTrees();
        });
    }
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let right = new RightUser_1.RightUser();
            right.type = RightBase_1.getRightType(info.type);
            right.icon = info.icon;
            right.name = info.name;
            right.componentName = info.componentName;
            let parent = yield RightUser_1.RightUser.findById(info.parent);
            if (parent) {
                right.parent = parent;
            }
            let rightSaved = yield right.save();
            rightSaved.children = [];
            return rightSaved;
        });
    }
    static update(info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield RightUser_1.RightUser.update(info.id, {
                name: info.name,
                type: RightBase_1.getRightType(info.type),
                icon: info.icon,
                componentName: info.componentName
            });
        });
    }
}
exports.CRightUser = CRightUser;
//# sourceMappingURL=CRightUser.js.map