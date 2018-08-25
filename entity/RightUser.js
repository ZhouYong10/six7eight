"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var RightUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const RightBase_1 = require("./RightBase");
let RightUser = RightUser_1 = class RightUser extends RightBase_1.RightBase {
    static p() {
        return typeorm_1.getRepository(RightUser_1);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.p().save(this);
        });
    }
    static findByName(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.p().findOne({ name: username });
        });
    }
    ;
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.p().findOne(id);
        });
    }
    ;
    static delById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.p().delete(id);
        });
    }
    static update(id, right) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.p().update(id, right);
        });
    }
    static treeP() {
        return typeorm_1.getManager().getTreeRepository(RightUser_1);
    }
    static findTrees() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.treeP().findTrees();
        });
    }
    static getAllLeaf() {
        return __awaiter(this, void 0, void 0, function* () {
            let tree = yield RightUser_1.treeP().findTrees();
            let leaves = [];
            function filterLeaf(tree) {
                tree.forEach((right) => {
                    if (!right.children || right.children.length < 1) {
                        leaves.push(right);
                    }
                    else {
                        filterLeaf(right.children);
                    }
                });
            }
            filterLeaf(tree);
            return leaves;
        });
    }
    findDescendantsTree() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.treeP().findDescendantsTree(this);
        });
    }
    findDescendants() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.treeP().findDescendants(this);
        });
    }
    findAncestors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.treeP().findAncestors(this);
        });
    }
    findAncestorsTree() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RightUser_1.treeP().findAncestorsTree(this);
        });
    }
};
__decorate([
    typeorm_1.TreeParent(),
    __metadata("design:type", RightUser)
], RightUser.prototype, "parent", void 0);
__decorate([
    typeorm_1.TreeChildren({
        cascade: true
    }),
    __metadata("design:type", Array)
], RightUser.prototype, "children", void 0);
RightUser = RightUser_1 = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Tree('materialized-path')
], RightUser);
exports.RightUser = RightUser;
//# sourceMappingURL=RightUser.js.map