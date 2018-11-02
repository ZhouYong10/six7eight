import {ProductType} from "../entity/ProductType";
import {getManager} from "typeorm";
import {Site} from "../entity/Site";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {types} from "util";
import {WitchType} from "../entity/ProductTypeBase";


export class CProductTypes {
    static async getAll() {
        return await ProductType.getAll();
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await getManager().transaction(async tem => {
            let type = <ProductType>await tem.createQueryBuilder()
                .select('type')
                .from(ProductType, 'type')
                .innerJoinAndSelect('type.productTypeSites', 'productTypeSites')
                .where('type.id = :id', {id: id})
                .getOne();
            let productTypeSites = <Array<ProductTypeSite>>type.productTypeSites;
            if (productTypeSites.length > 0) {
                for(let i = 0; i < productTypeSites.length; i++){
                    let productTypeSite = productTypeSites[i];
                    await tem.update(ProductTypeSite, productTypeSite.id, {onSale: !onSale})
                }
            }
            await tem.update(ProductType, id, {onSale: !onSale});
        });
    }

    static async findByName(name: string) {
        return await ProductType.findByName(name);
    }

    private static async editInfo(type: ProductType, info: any) {
        type.name = info.name;
        type.onSale = info.onSale;

        return await type.save();
    }

    static async add(info: any) {
        let type = new ProductType();
        type.name = info.name;
        type.onSale = info.onSale;
        await getManager().transaction(async tem => {
            type = await tem.save(type);
            let sites = await tem.createQueryBuilder()
                .select('site')
                .from(Site, 'site')
                .getMany();
            if (sites.length > 0) {
                for(let i = 0; i < sites.length; i++){
                    let site = sites[i];
                    let typeSite = new ProductTypeSite();
                    typeSite.type = WitchType.Platform;
                    typeSite.name = type.name;
                    typeSite.onSale = type.onSale;
                    typeSite.productType = type;
                    typeSite.site = site;
                    await tem.save(typeSite);
                }
            }
        });
        return type;
    }

    static async update(info: any) {
        let {id, name, onSale} = info;
        await getManager().transaction(async tem => {
            let type = <ProductType>await tem.createQueryBuilder()
                .select('type')
                .from(ProductType, 'type')
                .innerJoinAndSelect('type.productTypeSites', 'productTypeSites')
                .where('type.id = :id', {id: id})
                .getOne();
            let productTypeSites = <Array<ProductTypeSite>>type.productTypeSites;
            if (productTypeSites.length > 0) {
                for(let i = 0; i < productTypeSites.length; i++){
                    let productTypeSite = productTypeSites[i];
                    await tem.update(ProductTypeSite, productTypeSite.id, {name: name, onSale: onSale})
                }
            }
            await tem.update(ProductType, type.id, {name: name, onSale: onSale});
        });
    }

    static async delById(id: string) {
        return await ProductType.delById(id);
    }
}
