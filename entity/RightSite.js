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
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const RightBase_1 = require("./RightBase");
let RightSite = class RightSite extends RightBase_1.RightBase {
};
__decorate([
    typeorm_1.TreeParent(),
    __metadata("design:type", RightSite)
], RightSite.prototype, "parent", void 0);
__decorate([
    typeorm_1.TreeChildren(),
    __metadata("design:type", Array)
], RightSite.prototype, "children", void 0);
RightSite = __decorate([
    typeorm_1.Entity(),
    typeorm_1.Tree('closure-table')
], RightSite);
exports.RightSite = RightSite;
//# sourceMappingURL=RightSite.js.map