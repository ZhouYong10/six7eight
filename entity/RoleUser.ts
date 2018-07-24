import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {RoleBase} from "./RoleBase";
import {User} from "./User";

@Entity()
export class RoleUser extends RoleBase{
    // 角色类型
    @Column()
    type!: string;

    // 角色权限
    @Column({
        type: "simple-json"
    })
    jurisdiction!: any;

    @OneToMany(type => User, user => user.role)
    users?: User[];
}