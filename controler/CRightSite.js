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
class CRightSite {
    static show() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightSite_1.RightSite.findTrees();
        });
    }
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let right = new RightSite_1.RightSite();
            right.type = RightBase_1.getRightType(info.type);
            right.icon = info.icon;
            right.name = info.name;
            right.componentName = info.componentName;
            let parent = yield RightSite_1.RightSite.findById(info.parent);
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
            yield RightSite_1.RightSite.update(info.id, {
                name: info.name,
                type: RightBase_1.getRightType(info.type),
                icon: info.icon,
                componentName: info.componentName
            });
        });
    }
}
exports.CRightSite = CRightSite;
//# sourceMappingURL=CRightSite.js.map