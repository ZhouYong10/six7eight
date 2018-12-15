import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

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

    // 用于角色编辑显示的权限
    @Column('simple-array')
    editRights: string[] = [];

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
        this.editRights.unshift(typeId);
        this.rights.unshift(typeId);
    }

    addProductToRights(typeId: string, productId: string){
        let index = this.editRights.indexOf(typeId);
        if(index !== -1){
            this.editRights.splice(index, 1);
        }
        this.editRights.unshift(productId);
        this.rights.unshift(productId);
    }
}