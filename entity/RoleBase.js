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
const utils_1 = require("../utils");
class RoleBase {
    constructor() {
        this.rights = [];
    }
    addProductTypeToRights(type) {
        let rightTree = this.rights[0][0].children;
        let rightLeaf = this.rights[1];
        rightTree.unshift(type);
        rightLeaf.unshift(type);
    }
    addProductToRights(typeId, product) {
        let rightTree = this.rights[0][0].children;
        let rightLeaf = this.rights[1];
        for (let i = 0; i < rightTree.length; i++) {
            let item = rightTree[i];
            if (item.id === typeId) {
                item.children.unshift(product);
                break;
            }
        }
        for (let i = 0; i < rightLeaf.length; i++) {
            let item = rightLeaf[i];
            if (item.id === typeId) {
                rightLeaf.splice(i, 1);
                break;
            }
        }
        rightLeaf.unshift(product);
    }
}
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], RoleBase.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({
        type: 'timestamp',
        transformer: { from(dVal) {
                return utils_1.myDateFromat(dVal);
            }, to(eVal) {
                return eVal;
            } },
        readonly: true
    }),
    __metadata("design:type", String)
], RoleBase.prototype, "createTime", void 0);
__decorate([
    typeorm_1.Column('simple-json'),
    __metadata("design:type", Array)
], RoleBase.prototype, "rights", void 0);
exports.RoleBase = RoleBase;
//# sourceMappingURL=RoleBase.js.map