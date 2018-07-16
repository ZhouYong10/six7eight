import {PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp} from "typeorm";

export enum UserState {
    Normal = 'normal',
    Freeze = 'freeze',
    Ban = 'ban'
}

export abstract class UserBase{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        unique: true
    })
    name!: string;

    @Column()
    password!: string;

    @Column({
        type: "timestamp",
        readonly: true
    })
    @CreateDateColumn()
    readonly registerTime!: Timestamp;

    @Column({
        type: "timestamp",
        nullable: true
    })
    lastLoginTime?: Timestamp;

    @Column({
        type: "enum",
        enum: UserState
    })
    state: UserState = UserState.Normal;
}



