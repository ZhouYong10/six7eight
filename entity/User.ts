import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";

@Entity()
export class User extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    // constructor(id: number, name: string, password: string) {
    //     super();
    //     this.id = id
    //     this.name = name
    //     this.password = password;
    // }
}
