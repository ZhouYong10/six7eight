import {Column, PrimaryGeneratedColumn} from "typeorm";

export abstract class ProductBase {
    // 产品ID
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    // 产品名称
    @Column({
        type: 'char',
        length: 50
    })
    title!: string;

    // 产品成本价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    price!: number;

    // 产品分站价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    sitePrice!: number;

    // 产品顶级代理价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    topPrice!: number;

    // 产品超级代理价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    superPrice!: number;

    // 产品金牌代理价格
    @Column({
        type: 'decimal',
        precision: 6,
        scale: 4
    })
    goldPrice!: number;
}