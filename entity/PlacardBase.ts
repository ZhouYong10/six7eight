import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export abstract class PlacardBase {
    // 公告ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 公告标题
    // @Column({
    //     type: 'varchar',
    //     length: 100
    // })
    // title!: string;

    // 公告内容
    @Column({
        type: 'varchar',
        length: 1000
    })
    content!: string;

    // 公告发布时间
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

}