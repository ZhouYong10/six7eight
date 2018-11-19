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


    addProductTypeToRights(type: TypeRightItem){

    }

    addProductToRights(typeId: string, product: ProductRightItem){

    }
}