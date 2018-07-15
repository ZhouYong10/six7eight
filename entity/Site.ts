import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp} from "typeorm";

export enum SiteFrontLayout {
    Normal = 'normal'
}

export enum SiteBackLayout {
    Normal = 'normal'
}

@Entity()
export class Site {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({
        type: "varchar",
        length: 100
    })
    name!: string;

    @Column("simple-array")
    seoKey!: string[];

    @Column({
        type: "varchar",
        length: 1000
    })
    description!: string;

    @Column({
        type: "varchar",
        length: 20
    })
    qq!: string;

    @Column({
        type: "varchar",
        length: 15
    })
    phone!:string;

    @Column({
        type: "enum",
        enum: SiteFrontLayout
    })
    frontLayout: SiteFrontLayout = SiteFrontLayout.Normal;

    @Column({
        type: "enum",
        enum: SiteBackLayout
    })
    backLayout: SiteBackLayout = SiteBackLayout.Normal;

    @Column({
        type: "timestamp",
        readonly: true
    })
    @CreateDateColumn()
    createTime!: Timestamp;

    @Column({
        type: 'varchar',
        length: 50
    })
    logo!: string;

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
    freezeFunds: number = 0;



}

