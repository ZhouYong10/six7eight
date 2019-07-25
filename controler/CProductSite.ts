import {ProductSite} from "../entity/ProductSite";
import {CProductTypeSite} from "./CProductTypeSite";
import {Site} from "../entity/Site";
import {getManager} from "typeorm";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {assert, decimal} from "../utils";
import {Product} from "../entity/Product";
import {UserSite} from "../entity/UserSite";


export class CProductSite {
    static async getAll(productIds: Array<string>) {
        return await ProductSite.getAll(productIds);
    }

    static async getByTypeId(productIds: Array<string>, typeId: string) {
        let result;
        switch (typeId) {
            case 'allTypeProducts':
                result = await ProductSite.getAll(productIds);
                break;
            case 'siteSelfProducts':
                result = await ProductSite.getSiteSelf(productIds);
                break;
            case 'platformProducts':
                result = await ProductSite.getPlatform(productIds);
                break;
            default:
                result = await ProductSite.getByTypeId(productIds, typeId);
                break;
        }
        return result;
    }

    static async productPlatformOnsale(productId: string) {
        let product = <ProductSite>await ProductSite.findById(productId);
        if (product.product) {
            // @ts-ignore
            return product.productTypeSite.productType.onSale && product.product.onSale;
        }else{
            return true;
        }
    }

    static async setOnSale(info: any) {
        let {id, onSale} = info;
        let product = <ProductSite>await ProductSite.findById(id);
        product.onSale = onSale;
        return await product.save();
    }

    static async findById(id: string) {
        return await ProductSite.findById(id);
    }

    static async findByNameAndTypeId(typeId: string, name: string) {
        return await ProductSite.findByNameAndTypeId(typeId, name);
    }

    static async getPrototypeById(id: string) {
        return await ProductSite.getPrototypeById(id);
    }

    private static async editInfo(product: ProductSite, info: any) {
        product.name = info.name;
        product.sortNum = info.sortNum;
        product.sitePrice = info.sitePrice;
        product.topPrice = info.topPrice;
        product.superPrice = info.superPrice;
        product.goldPrice = info.goldPrice;
        product.orderTip = info.orderTip;
        product.onSale = info.onSale;
        product.minNum = info.minNum;
        product.speed = info.speed;
        product.attrs = info.attrs;
        product.productTypeSite = <ProductTypeSite>await CProductTypeSite.findById(info.productTypeId);
    }

    static async add(info: any, user:UserSite, io: any) {
        let site = <Site> user.site;
        let product = new ProductSite();
        await CProductSite.editInfo(product, info);
        product.createUser = user.username;
        product.site = site;
        await getManager().transaction(async tem => {
            product = await tem.save(product);

            user.role.addProductToRights(product.productTypeSite.id, product.id);
            await tem.save(user.role);

            let productMenuRight = product.menuRightItem();
            // 更新分站当前角色的所有管理员页面导航栏
            io.emit(user.role.id + 'product', {typeId: product.productTypeSite.id, product: productMenuRight});
            // 添加商品到分站当前角色的所有管理员商品管理页面
            io.emit(user.role.id + 'addProduct', product);

            if (user.role.type !== RoleUserSiteType.Site) {
                let roleUserSite = <RoleUserSite>await tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUserSite, 'role')
                    .innerJoin('role.site', 'site', 'site.id = :id', {id: site.id})
                    .where('role.type = :type', {type: RoleUserSiteType.Site})
                    .getOne();

                roleUserSite.addProductToRights(product.productTypeSite.id, product.id);
                await tem.save(roleUserSite);

                // 更新分站系统管理员页面导航栏
                io.emit(roleUserSite.id + 'product', {typeId: product.productTypeSite.id, product: productMenuRight});
                // 添加商品到分站系统管理员商品管理页面
                io.emit(roleUserSite.id + 'addProduct', product);
            }

            // 更新分站用户页面导航栏
            io.emit(site.id + 'product', {typeId: product.productTypeSite.id, product: productMenuRight});

        });
    }

    static async update(info: any) {
        let product = <ProductSite>await ProductSite.findById(info.id);
        await CProductSite.editInfo(product, info);
        return await product.save();
    }

    static async updatePlatform(info: any) {
        let {id, topPrice, superPrice, goldPrice} = info;
        let productSite = <ProductSite>await ProductSite.findById(id);
        let product = <Product>productSite.product;
        assert(productSite, 'id为 “' + id + '” 的商品不存在！');
        assert(superPrice - topPrice >= 0, '超级代理价格不能小于顶级代理价格');
        assert(goldPrice - superPrice >= 0, '金牌代理价格不能小于超级代理价格');
        assert(topPrice - product.topPrice >= 0, '顶级代理价格不能小于平台限制价格： ￥' + product.topPrice);
        assert(superPrice - product.superPrice >= 0, '超级代理价格不能小于平台限制价格： ￥' + product.superPrice);
        assert(goldPrice - product.goldPrice >= 0, '金牌代理价格不能小于平台限制价格： ￥' + product.goldPrice);
        productSite.topPrice = topPrice;
        productSite.superPrice = superPrice;
        productSite.goldPrice = goldPrice;

        return await productSite.save();
    }

    static async priceBatchUpdate(productIds: Array<string>, info: any) {
        let topScale = parseInt(info.topScale);
        let superScale = parseInt(info.superScale);
        let goldScale = parseInt(info.goldScale);
        assert(topScale > 0, '一级加价比例不能为0');
        assert(superScale >= topScale, '二级加价比例不能低于一级加价比例');
        assert(goldScale >= superScale, '三级加价比例不能低于二级加价比例');
        if (productIds.length < 1) {
            productIds = [''];
        }
        return await getManager().transaction(async tem => {
            let products = await tem.createQueryBuilder()
                .select('product')
                .from(ProductSite, 'product')
                .whereInIds(productIds)
                .getMany();
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                product.topPrice = parseFloat(decimal(product.topPrice).times(1 + topScale / 100).toFixed(4));
                product.superPrice = parseFloat(decimal(product.superPrice).times(1 + superScale / 100).toFixed(4));
                product.goldPrice = parseFloat(decimal(product.goldPrice).times(1 + goldScale / 100).toFixed(4));
                await tem.save(product);
            }
            return true;
        });
    }

    static async priceBatchBack(productIds: Array<string>) {
        if (productIds.length < 1) {
            productIds = [''];
        }
        return await getManager().transaction(async tem => {
            let productsSite = await tem.createQueryBuilder()
                .select('productSite')
                .from(ProductSite, 'productSite')
                .whereInIds(productIds)
                .leftJoinAndSelect('productSite.product', 'product')
                .getMany();
            for (let i = 0; i < productsSite.length; i++) {
                let productSite = productsSite[i];
                if (productSite.product) {
                    productSite.topPrice = productSite.product.topPrice;
                    productSite.superPrice = productSite.product.superPrice;
                    productSite.goldPrice = productSite.product.goldPrice;
                    await tem.save(productSite);
                }
            }
            return true;
        });
    }

    static async getAllOnSaleProductIds(siteId: string) {
        let products = await ProductSite.getAllOnSale(siteId);
        let productIds = products.map((product) => {
            return product.id;
        });
        return productIds;
    }
}
