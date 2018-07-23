import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Timestamp} from "typeorm";

export enum SiteFrontLayout {
    Normal = 'normal'
}

export enum SiteBackLayout {
    Normal = 'normal'
}

@Entity()
export class Site {
    // 站点ID
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // 站点名称
    @Column({
        type: "char",
        length: 50
    })
    name!: string;

    // 站点SEO关键字
    @Column({
        type: "simple-array",
        nullable: true
    })
    seoKey?: string[];

    // 站点描述
    @Column({
        type: "varchar",
        length: 1000,
        nullable: true
    })
    descriptio?: string;

    // 站点QQ
    @Column({
        type: "char",
        length: 16,
        nullable: true
    })
    qq?: string;

    // 站点电话
    @Column({
        type: "char",
        length: 14,
        nullable: true
    })
    phone?:string;

    // 站点Email
    @Column({
        type: "char",
        length: 18,
        nullable: true
    })
    email?: string;

    // 站点微信
    @Column({
        type: "varchar",
        length: 18,
        nullable: true
    })
    weixin?: string;

    // 站点前端布局
    @Column({
        type: "enum",
        enum: SiteFrontLayout
    })
    frontLayout: SiteFrontLayout = SiteFrontLayout.Normal;

    // 站点后端布局
    @Column({
        type: "enum",
        enum: SiteBackLayout
    })
    backLayout: SiteBackLayout = SiteBackLayout.Normal;

    // 站点创建时间
    @Column({
        type: "timestamp",
        readonly: true
    })
    @CreateDateColumn()
    readonly createTime!: Timestamp;

    // 站点logo
    @Column({
        type: 'varchar',
        length: 100
    })
    logo!: string;

    // 站点用户可用总资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    userFunds: number = 0;

    // 站点用户冻结总资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    userFreezeFunds: number = 0;

    // 站点可用资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    funds: number = 0;

    // 站点冻结资金
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    freezeFunds: number = 0;

    // 站点返利金额
    @Column({
        type: "decimal",
        precision: 20,
        scale: 4
    })
    profit: number = 0;



}

