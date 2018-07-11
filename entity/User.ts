import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    constructor(id: number, name: string, password: string) {
        this.id = id
        this.name = name
        this.password = password;
    }
}
