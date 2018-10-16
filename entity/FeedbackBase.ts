import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export abstract class FeedbackBase {
    // 反馈ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 反馈内容
    @Column({
        type: 'varchar',
        length: 1000
    })
    content!: string;

    // 反馈时间
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

    // 反馈处理时间
    @Column({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        nullable: true
    })
    dealTime?: string;

    // 反馈处理内容
    @Column({
        type: 'varchar',
        length: 1000,
        nullable: true
    })
    dealContent?: string;



}