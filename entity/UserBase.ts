import {PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp} from "typeorm";

export enum UserState {
    Normal,
    Freeze,
    Ban
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

    @Column("timestamp")
    lastLoginTime!: Timestamp;

    @Column({
        type: "enum",
        enum: UserState
    })
    state: UserState = UserState.Normal;
}



