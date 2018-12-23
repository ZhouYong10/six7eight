import {Column, CreateDateColumn, PrimaryGeneratedColumn} from "typeorm";
import {myDateFromat} from "../utils";

export enum MessageTitle {
    OrderError = '订单报错处理',
    OrderRefund = '订单退款处理',
    Recharge = '充值到账',
    RechargeError = '充值失败',
    Withdraw = '提现到账',
    WithdrawError = '提现失败',
    Feedback = '问题反馈处理',
    PlatformMsg = '系统消息'
}

export abstract class MessageBase {
    // ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 创建时间
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

    // 消息类型
    @Column({
        type: "enum",
        enum: MessageTitle,
        readonly: true
    })
    title!: MessageTitle;

    // 消息状态（标志用户是否已经查看了该条消息）
    @Column()
    state: boolean = false;

    // 消息内容
    @Column()
    content!: string;

    // 消息前端路由
    @Column()
    frontUrl!: string;

    // 消息目标id
    @Column()
    aimId!: string;

}