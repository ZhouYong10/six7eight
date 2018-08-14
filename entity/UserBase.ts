import {PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm";
import * as bcrypt from "bcryptjs";
import {myDateFromat} from "../utils";

export enum UserState {
    Normal = '正常',  // 正常
    Freeze = '冻结',  // 冻结
    Ban = '禁用'         // 禁用
}

export enum UserType {
    Platform = 'platform',
    Site = 'site',
    User = 'user',
}

export abstract class UserBase{
    // 账户ID
    @PrimaryGeneratedColumn("uuid")
    readonly id!: string;

    // 账户名
    @Column({
        type: "char",
        length: 100,
        unique: true
    })
    username!: string;

    // 账户密码
    @Column({
        type: "char",
        length: 100
    })
    protected _password!: string;

    set password(password: string) {
        this._password = bcrypt.hashSync(password, 10);
    }

    get password() {
        return this._password;
    }

    // 账户注册时间
    @CreateDateColumn({
        type: 'timestamp',
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        readonly: true
    })
    readonly registerTime!:string;

    // 账户最近登录时间
    @Column({
        type: "timestamp",
        transformer: {from(dVal){
                return myDateFromat(dVal);
            }, to(eVal){
                return eVal;
            }},
        nullable: true
    })
    lastLoginTime?: string;

    // 账户状态
    @Column({
        type: "enum",
        enum: UserState
    })
    protected state: UserState = UserState.Normal;

    set setState(state: string) {
        switch (state) {
            case 'normal':
                this.state = UserState.Normal;
                break;
            case 'freeze':
                this.state = UserState.Freeze;
                break;
            default:
                this.state = UserState.Ban;
        }
    }

    get getState() {
        return this.state;
    }

    // 账户QQ
    @Column({
        type: "char",
        length: 16,
        nullable: true
    })
    qq?: string;

    // 账户电话
    @Column({
        type: "char",
        length: 14,
        nullable: true
    })
    phone?: string;

    // 账户Email
    @Column({
        type: "char",
        length: 18,
        nullable: true
    })
    email?: string;

    // 账户微信
    @Column({
        type: "char",
        length: 18,
        nullable: true
    })
    weixin?: string;

}



