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
var RightUser_1;
"use strict";
const typeorm_1 = require("typeorm");
const RightBase_1 = require("./RightBase");
let RightUser = RightUser_1 = class RightUser extends RightBase_1.RightBase {
};
__decorate([
    typeorm_1.ManyToOne(type => RightUser_1, rightUser => rightUser.children),
    __metadata("design:type", RightUser)
], RightUser.prototype, "parent", void 0);
__decorate([
    typeorm_1.OneToMany(type => RightUser_1, rightUser => rightUser.parent),
    __metadata("design:type", Array)
], RightUser.prototype, "children", void 0);
RightUser = RightUser_1 = __decorate([
    typeorm_1.Entity()
], RightUser);
exports.RightUser = RightUser;
//# sourceMappingURL=RightUser.js.map