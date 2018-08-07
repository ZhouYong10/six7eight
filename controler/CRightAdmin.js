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
class CRightAdmin {
    static show() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightAdmin_1.RightAdmin.find({ parent: null });
        });
    }
    static getChild(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightAdmin_1.RightAdmin.find({ parent: id });
        });
    }
    static save(info) {
        return __awaiter(this, void 0, void 0, function* () {
            let right = new RightAdmin_1.RightAdmin();
            right.name = info.name;
            right.path = info.path;
            right.componentName = info.componentName;
            right.hasChild = info.hasChild;
            if (right.hasChild) {
                right.children = [];
            }
            let parent = yield RightAdmin_1.RightAdmin.findById(info.parent);
            if (parent) {
                right.parent = parent;
            }
            return yield right.save();
        });
    }
    static del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield RightAdmin_1.RightAdmin.delById(id);
        });
    }
}
exports.CRightAdmin = CRightAdmin;
//# sourceMappingURL=CRightAdmin.js.map