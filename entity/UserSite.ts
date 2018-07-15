import {Entity, Column, ManyToMany, JoinTable} from "typeorm";
import {UserBase} from "./UserBase";

@Entity()
export class User extends UserBase{

    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    funds: number = 0;

    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    profit: number = 0;

    // constructor(id: number, name: string, password: string) {
    //     super();
    //     this.id = id
    //     this.name = name
    //     this.password = password;
    // }
}