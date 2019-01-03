import {Product} from "../entity/Product";
import {EntityManager, getManager} from "typeorm";
import {ProductSite} from "../entity/ProductSite";
import {ProductType} from "../entity/ProductType";
import {ProductTypeSite} from "../entity/ProductTypeSite";
import {WitchType} from "../entity/ProductTypeBase";
import {Site} from "../entity/Site";
import {decimal} from "../utils";
import {RoleUserSite, RoleUserSiteType} from "../entity/RoleUserSite";
import {RoleUserAdmin, RoleUserAdminType} from "../entity/RoleUserAdmin";
import {UserAdmin} from "../entity/UserAdmin";


export class CProduct {
    static async getAll(productIds: Array<string>) {
        return await Product.getAll(productIds);
    }

    static async findByNameAndTypeId(typeId: string, name: string) {
        return await Product.findByNameAndTypeId(typeId, name);
    }

    static async add(info: any, user:UserAdmin, io: any) {
        await getManager().transaction(async tem => {
            let product = new Product();
            product.name = info.name;
            product.createUser = user.username;
            product.price = info.price;
            product.sitePrice = info.sitePrice;
            product.topPrice = info.topPrice;
            product.superPrice = info.superPrice;
            product.goldPrice = info.goldPrice;
            product.orderTip = info.orderTip;
            product.onSale = info.onSale;
            product.minNum = info.minNum;
            product.speed = info.speed;
            product.attrs = info.attrs;
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
                    productSite.createUser = product.createUser;
                    productSite.price = product.price;
                    productSite.sitePrice = product.sitePrice;
                    productSite.topPrice = product.topPrice;
                    productSite.superPrice = product.superPrice;
                    productSite.goldPrice = product.goldPrice;
                    productSite.orderTip = product.orderTip;
                    productSite.onSale = product.onSale;
                    productSite.minNum = product.minNum;
                    productSite.speed = product.speed;
                    productSite.attrs = product.attrs;
                    productSite.product = product;
                    productSite.site = site;
                    productSite.productTypeSite = productTypeSite;
                    productSite = await tem.save(productSite);

                    let roleUserSite = <RoleUserSite>await tem.createQueryBuilder()
                        .select('role')
                        .from(RoleUserSite, 'role')
                        .innerJoin('role.site', 'site', 'site.id = :id', {id: site.id})
                        .where('role.type = :type', {type: RoleUserSiteType.Site})
                        .getOne();

                    roleUserSite.addProductToRights(productSite.productTypeSite.id, productSite.id);
                    await tem.save(roleUserSite);

                    let productSiteMenuRight = productSite.menuRightItem();
                    // 更新分站系统管理员页面导航栏
                    io.emit(roleUserSite.id + 'product', {typeId: productSite.productTypeSite.id, product: productSiteMenuRight});
                    // 更新分站用户页面导航栏
                    io.emit(site.id + 'product', {typeId: productSite.productTypeSite.id, product: productSiteMenuRight});
                    // 添加商品到分站商品管理页面
                    io.emit(site.id + 'addProduct', productSite);
                }
            }

            user.role.addProductToRights(productType.id, product.id);
            await tem.save(user.role);

            let productMenuRight = product.menuRightItem();
            // 更新当前角色的所有管理员页面导航栏
            io.emit(user.role.id + 'product', {typeId: productType.id, product: productMenuRight});
            // 添加商品到当前角色的所有管理员商品管理页面
            io.emit(user.role.id + 'addProduct', product);

            if (user.role.type !== RoleUserAdminType.Developer) {
                let roleUserAdmin = <RoleUserAdmin>await tem.createQueryBuilder()
                    .select('role')
                    .from(RoleUserAdmin, 'role')
                    .where('role.type = :type', {type: RoleUserAdminType.Developer})
                    .getOne();
                roleUserAdmin.addProductToRights(productType.id, product.id);
                await tem.save(roleUserAdmin);
                // 更新平台系统管理员页面导航栏
                io.emit(roleUserAdmin.id + 'product', {typeId: productType.id, product: productMenuRight});
                // 添加商品到平台系统管理员商品管理页面
                io.emit(roleUserAdmin.id + 'addProduct', product);
            }
        });
    }

    static async findByIdWithProductSites(id: string, tem: EntityManager) {
        let product = <Product>await tem.createQueryBuilder()
            .select('product')
            .from(Product, 'product')
            .leftJoinAndSelect('product.productSites', 'productSite')
            .leftJoinAndSelect('productSite.site', 'site')
            .leftJoinAndSelect('productSite.productTypeSite', 'productTypeSite')
            .where('product.id = :id', {id: id})
            .getOne();
        let productSites = <Array<ProductSite>>product.productSites;

        return {product: product, productSites: productSites};
    }

    static async setOnSale(info: any, io:any) {
        let {id, onSale} = info;
        await getManager().transaction(async tem => {
            let {product, productSites} = await CProduct.findByIdWithProductSites(id, tem);
            if (productSites.length > 0) {
                for(let i = 0; i < productSites.length; i++){
                    let productSite = productSites[i];
                    productSite.onSale = onSale;
                    productSite = await tem.save(productSite);
                    let site = <Site>productSite.site;
                    io.emit(site.id + 'typeOrProductUpdate', productSite.menuRightItem());
                    // 更新分站所有商品管理页面对应的商品信息
                    io.emit(site.id + 'updateProduct', productSite);
                }
            }
            product.onSale = onSale;
            product = await tem.save(product);
            io.emit('typeOrProductUpdate', product.menuRightItem());
            // 更新平台所有商品管理页面对应的商品信息
            io.emit('updateProduct', product);
        });
    }

    static async update(info: any, io:any) {
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
            product.speed = info.speed;
            product.attrs = info.attrs;
            product = await tem.save(product);

            if (productSites.length > 0) {
                for(let i = 0; i < productSites.length; i++){
                    let productSite = productSites[i];
                    productSite.name = info.name;
                    productSite.orderTip = info.orderTip;
                    productSite.onSale = info.onSale;
                    productSite.minNum = info.minNum;
                    productSite.speed = info.speed;
                    productSite.attrs = info.attrs;
                    productSite.price = info.price;
                    productSite.sitePrice = parseFloat(decimal(productSite.sitePrice).plus(valSitePrice).toFixed(4));
                    productSite.topPrice = parseFloat(decimal(productSite.topPrice).plus(valTopPrice).toFixed(4));
                    productSite.superPrice = parseFloat(decimal(productSite.superPrice).plus(valSuperPrice).toFixed(4));
                    productSite.goldPrice = parseFloat(decimal(productSite.goldPrice).plus(valGoldPrice).toFixed(4));
                    productSite = await tem.save(productSite);

                    let site = <Site>productSite.site;
                    io.emit(site.id + 'typeOrProductUpdate', productSite.menuRightItem());
                    // 更新分站所有商品管理页面对应的商品信息
                    io.emit(site.id + 'updateProduct', productSite);
                }
            }
            io.emit('typeOrProductUpdate', product.menuRightItem());
            // 更新平台所有商品管理页面对应的商品信息
            io.emit('updateProduct', product);
        });
    }
}
