import {PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp} from "typeorm";
import * as bcrypt from "bcryptjs";

export enum UserState {
    Normal = 'normal',  // 正常
    Freeze = 'freeze',  // 冻结
    Ban = 'ban'         // 禁用
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
    @Column({
        type: "timestamp",
        readonly: true
    })
    @CreateDateColumn()
    readonly registerTime!: Timestamp;

    // 账户最近登录时间
    @Column({
        type: "timestamp",
        nullable: true
    })
    lastLoginTime?: Timestamp;

    // 账户状态
    @Column({
        type: "enum",
        enum: UserState
    })
    state: UserState = UserState.Normal;

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



