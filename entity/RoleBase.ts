import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";
import {TypeRightItem} from "./ProductTypeBase";
import {ProductRightItem} from "./ProductBase";

export abstract class RoleBase {
    // 角色ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 角色创建时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly createTime!:string;

    // 角色权限
    @Column('simple-json')
    rights: Array<any> = [];


    addProductTypeToRights(type: TypeRightItem){
        let rightTree = this.rights[0][0].children;
        let rightLeaf = this.rights[1];

        rightTree.unshift(type);
        rightLeaf.unshift(type);
    }

    addProductToRights(typeId: string, product: ProductRightItem){
        let rightTree = this.rights[0][0].children;
        let rightLeaf = this.rights[1];

        for(let i = 0; i < rightTree.length; i++){
            let item = rightTree[i];
            if (item.id === typeId) {
                item.children.unshift(product);
                break;
            }
        }

        for(let i = 0; i < rightLeaf.length; i++){
            let item = rightLeaf[i];
            if (item.id === typeId) {
                rightLeaf.splice(i, 1);
                break;
            }
        }

        rightLeaf.unshift(product);
    }
}