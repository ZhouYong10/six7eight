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
    @Column('simple-array')
    rights: string[] = [];


    treeRights(tree: Array<any>) {
        function tagRight(right:any, aim: any) {
            if (right.fingerprint === aim) {
                right.saved = true;
                return true;
            }else if (right.children && right.children.length > 0) {
                let children = right.children;
                for(let i = 0; i < children.length; i++){
                    if (tagRight(children[i], aim)) {
                        right.saved = true;
                        return true;
                    }
                }
            }
        }
        function delRight(rights: Array<any>) {
            return rights.filter((val) => {
                if (val.saved) {
                    if (val.children && val.children.length > 0) {
                        val.children = delRight(val.children);
                    }
                    return true;
                }
            });
        }

        for(let i = 0; i < this.rights.length; i++){
            let aim = this.rights[i];
            for(let j = 0; j < tree.length; j++){
                tagRight(tree[j], aim);
            }
        }
        return delRight(tree);
    }

    addProductTypeToRights(typeId: string){
        this.rights.unshift(typeId);
    }

    addProductToRights(typeId: string, productId: string){
        for(let i = 0; i < this.rights.length; i++){
            let id = this.rights[i];
            if (id === typeId) {
                this.rights.splice(i, 1);
                break;
            }
        }
        this.rights.unshift(productId);
    }
}