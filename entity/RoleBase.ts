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

    // 角色权限
    @Column('simple-json')
    rights: Array<any> = [];
}