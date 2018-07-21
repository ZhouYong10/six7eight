import {Entity, Column, ManyToMany, JoinTable} from "typeorm";
import {UserBase} from "./UserBase";
import {UserRole} from "./UserRole";

@Entity()
export class User extends UserBase{
    // 账户可用资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    funds: number = 0;

    // 账户冻结资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    freezeFunds: number = 0;

    // 账户返利金额
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    profit: number = 0;

    // 账户角色
    role!: UserRole

    // 账户上级

    // 账户下级

    // 账户所属分站

    //





    // constructor(id: number, name: string, password: string) {
    //     super();
    //     this.id = id
    //     this.name = name
    //     this.password = password;
    // }
}


