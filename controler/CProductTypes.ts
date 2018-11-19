import {ProductType} from "../entity/ProductType";
import {EntityManager, getManager} from "typeorm";
import {Site} from "../entity/Site";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {WitchType} from "../entity/ProductTypeBase";
import {ProductSite} from "../entity/ProductSite";
import {Product} from "../entity/Product";


export class CProductTypes {
    static async productsRight() {
        function productToRight(types:Array<any>, rights:Array<any>) {
            for(let i = 0; i < types.length; i++){
                let type = types[i];
                let item = type.menuRightItem();
                if (type.products && type.products.length > 0) {
                    productToRight(type.products, item.children);
                }
                rights.push(item);
            }
            return rights;
        }

        let typeProducts = await ProductType.allWithProducts();
        return productToRight(typeProducts, []);;
    }

    static async getAll() {
        return await ProductType.getAll();
    }

    static async findByName(name: string) {
        return await ProductType.findByName(name);
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

    private static async getTypeAndTypeSite(id: string, tem: EntityManager) {
        let type = <ProductType>await tem.createQueryBuilder()
            .select('type')
            .from(ProductType, 'type')
            .leftJoinAndSelect('type.productTypeSites', 'productTypeSites')
            .where('type.id = :id', {id: id})
            .getOne();
        let productTypeSites = <Array<ProductTypeSite>>type.productTypeSites;
        return {type: type, productTypeSites: productTypeSites}

    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await getManager().transaction(async tem => {
            let {type, productTypeSites} = await CProductTypes.getTypeAndTypeSite(id, tem);
            if (productTypeSites.length > 0) {
                for(let i = 0; i < productTypeSites.length; i++){
                    let productTypeSite = productTypeSites[i];
                    await tem.update(ProductTypeSite, productTypeSite.id, {onSale: onSale})
                }
            }
            await tem.update(ProductType, type.id, {onSale: onSale});
        });
    }

    static async update(info: any) {
        let {id, name, onSale} = info;
        await getManager().transaction(async tem => {
            let {type, productTypeSites} = await CProductTypes.getTypeAndTypeSite(id, tem);
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
        await getManager().transaction(async tem => {
            let type = <ProductType>await tem.createQueryBuilder()
                .select('type')
                .from(ProductType, 'type')
                .leftJoinAndSelect('type.productTypeSites', 'productTypeSites')
                .leftJoinAndSelect('type.products', 'products')
                .where('type.id = :id', {id: id})
                .getOne();
            let productTypeSites = <Array<ProductTypeSite>>type.productTypeSites;
            let products = <Array<Product>>type.products;
            if (productTypeSites.length > 0) {
                for(let i = 0; i < productTypeSites.length; i++){
                    let productTypeSite = <ProductTypeSite>await tem.createQueryBuilder()
                        .select('typeSite')
                        .from(ProductTypeSite, 'typeSite')
                        .leftJoinAndSelect('typeSite.productSites', 'productSites')
                        .where('typeSite.id = :id', {id: productTypeSites[i].id})
                        .getOne();
                    let productSites = <Array<ProductSite>>productTypeSite.productSites;
                    if (productSites.length > 0) {
                        await tem.remove(productSites);
                    }
                }
                await tem.remove(productTypeSites);
            }
            if (products.length > 0) {
                await tem.remove(products);
            }
            await tem.remove(type);
        });
    }
}
