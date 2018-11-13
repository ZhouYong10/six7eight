import {Product} from "../entity/Product";
import {CProductTypes} from "./CProductTypes";
import {EntityManager, getManager} from "typeorm";
import {ProductSite} from "../entity/ProductSite";
import {ProductType} from "../entity/ProductType";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {WitchType} from "../entity/ProductTypeBase";
import {Site} from "../entity/Site";
import {decimal} from "../utils";


export class CProduct {
    static async getAll() {
        return await Product.getAll();
    }

    static async findByNameAndTypeId(typeId: string, name: string) {
        return await Product.findByNameAndTypeId(typeId, name);
    }

    static async add(info: any) {
        let product = new Product();
        product.name = info.name;
        product.price = info.price;
        product.sitePrice = info.sitePrice;
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;
        product.orderTip = info.orderTip;
        product.onSale = info.onSale;
        product.minNum = info.minNum;
        product.attrs = info.attrs;
        await getManager().transaction(async tem => {
            let productType = <ProductType>await tem.findOne(ProductType, info.productTypeId);
            product.productType = productType;
            product = await tem.save(product);

            let productTypeSites = <Array<ProductTypeSite>>await tem.createQueryBuilder()
                .select('typeSite')
                .from(ProductTypeSite, 'typeSite')
                .innerJoin('typeSite.productType', 'productType', 'productType.id = :id', {id: productType.id})
                .leftJoinAndSelect('typeSite.site', 'site')
                .getMany();

            if (productTypeSites.length > 0) {
                for(let i = 0; i < productTypeSites.length; i++){
                    let productTypeSite = productTypeSites[i];
                    let site = <Site>productTypeSite.site;
                    let productSite = new ProductSite();
                    productSite.type = WitchType.Platform;
                    productSite.name = product.name;
                    productSite.price = product.price;
                    productSite.sitePrice = product.sitePrice;
                    productSite.topPrice = product.topPrice;
                    productSite.superPrice = product.superPrice;
                    productSite.goldPrice = product.goldPrice;
                    productSite.orderTip = product.orderTip;
                    productSite.onSale = product.onSale;
                    productSite.minNum = product.minNum;
                    productSite.attrs = product.attrs;
                    productSite.product = product;
                    productSite.site = site;
                    productSite.productTypeSite = productTypeSite;
                    await tem.save(productSite);
                }
            }
        });
        return product;
    }

    static async findByIdWithProductSites(id: string, tem: EntityManager) {
        let product = <Product>await tem.createQueryBuilder()
            .select('product')
            .from(Product, 'product')
            .leftJoinAndSelect('product.productSites', 'productSites')
            .where('product.id = :id', {id: id})
            .getOne();
        let productSites = <Array<ProductSite>>product.productSites;

        return {product: product, productSites: productSites};
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        await getManager().transaction(async tem => {
            let {product, productSites} = await CProduct.findByIdWithProductSites(id, tem);
            if (productSites.length > 0) {
                for(let i = 0; i < productSites.length; i++){
                    let productSite = productSites[i];
                    await tem.update(ProductSite, productSite.id, {onSale: onSale});
                }
            }
            await tem.update(Product, product.id, {onSale: onSale});
        });
    }

    static async update(info: any) {
        await getManager().transaction(async tem => {
            let {product, productSites} = await CProduct.findByIdWithProductSites(info.id, tem);

            let valSitePrice = decimal(info.sitePrice).minus(product.sitePrice);
            let valTopPrice = decimal(info.topPrice).minus(product.topPrice);
            let valSuperPrice = decimal(info.superPrice).minus(product.superPrice);
            let valGoldPrice = decimal(info.goldPrice).minus(product.goldPrice);

            product.name = info.name;
            product.price = info.price;
            product.sitePrice = info.sitePrice;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.orderTip = info.orderTip;
            product.onSale = info.onSale;
            product.minNum = info.minNum;
            product.attrs = info.attrs;
            await tem.save(product);

            if (productSites.length > 0) {
                for(let i = 0; i < productSites.length; i++){
                    let productSite = productSites[i];
                    productSite.name = info.name;
                    productSite.orderTip = info.orderTip;
                    productSite.onSale = info.onSale;
                    productSite.minNum = info.minNum;
                    productSite.attrs = info.attrs;
                    productSite.price = info.price;
                    productSite.sitePrice = parseFloat(decimal(productSite.sitePrice).plus(valSitePrice).toFixed(4));
                    productSite.topPrice = parseFloat(decimal(productSite.topPrice).plus(valTopPrice).toFixed(4));
                    productSite.superPrice = parseFloat(decimal(productSite.superPrice).plus(valSuperPrice).toFixed(4));
                    productSite.goldPrice = parseFloat(decimal(productSite.goldPrice).plus(valGoldPrice).toFixed(4));
                    await tem.save(productSite);
                }
            }
        });
    }

    static async delById(id: string) {
        await getManager().transaction(async tem => {
            let {product, productSites} = await CProduct.findByIdWithProductSites(id, tem);
            if (productSites.length > 0) {
                await tem.remove(productSites);
            }
            await tem.remove(product);
        });
    }
}
