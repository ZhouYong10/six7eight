import axios, {AxiosRequestConfig} from "axios";
import * as pako from "pako";
import {devConf} from "../../config";
import {Message} from "element-ui";
import window from "@/window";
import * as moment from "moment";
import { Loading } from 'element-ui';
import {ElLoadingComponent} from "element-ui/types/loading";

export function shadowCloseSideMenu() {
    let sideMenu = document.querySelector('.el-aside');
    sideMenu.addEventListener('click', (e:any) =>{
        if (e.target == sideMenu) {
            sideMenu.classList.remove('show-side-menu');
        }
    })
}

export function closeSideMenu() {
    document.querySelector('.el-aside').classList.remove('show-side-menu');
}

export function showSideMenu() {
    let sideMenu = document.querySelector('.el-aside');
    sideMenu.classList.add('show-side-menu');
}


export enum StorageKey{
    platform = 'platform-info',
    site = 'site-info',
    user = 'user-info'
}

let loadingInstance: ElLoadingComponent;
axios.interceptors.request.use(
    config => {
        loadingInstance = Loading.service({
            text: '玩命加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0)'
        });
        return config;
    },
    error => {
        Message.warning('访问超时！');
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    res => {
        loadingInstance.close();
        let url = res.config.url;
        if (url && url.search(/\/logined$/) != -1) {
            return res;
        }else {
            if (res.data.successed) {
                return res.data.data;
            }else{
                Message({
                    message: res.data.msg,
                    type: 'error',
                    duration: 5000,
                    showClose: true
                });
                return ;
            }
        }
    },
    error => {
        Message.error('未知错误，请联系系统管理员！');
        return Promise.reject(error);
    }
);

export function zip(info: any) {
    return pako.deflate(JSON.stringify(info), {to: "string"})
}

export function unzip(info: string) {
    return JSON.parse(pako.inflate(info, {to: "string"}))
}

export function pageChangeMsg(msg: string) {
    Message({
        message: msg,
        type: 'error',
        duration: 10000,
        showClose: true
    });
}

export function host(path = '') {
    const host = devConf.serveHost + ':' + devConf.servePort;
    return host + path;
}

function isProduction(path: string, config?: AxiosRequestConfig) {
    let servePath = path;
    let axiosConf = config;

    if (process.env.NODE_ENV !== 'production') {
        servePath = host(path);
        axiosConf = {withCredentials: true, ...config};
    }

    return {servePath, axiosConf};
}

export async function axiosGet(path: string, config?:AxiosRequestConfig) {
    let {servePath, axiosConf} = isProduction(path, config);
    return await axios.get(servePath, axiosConf);
}

export async function axiosPost(path: string, params: any, config?:AxiosRequestConfig) {
    let {servePath, axiosConf} = isProduction(path, config);
    return await axios.post(servePath, params, axiosConf);
}

export function addTypeToMenu(menus: Array<any>, type: any) {
    menus.unshift(type);
}

export function typeOrProductUpdate(menus: Array<any>, item: any) {
    for(let i = 0; i < menus.length; i++){
        let typeMenu = menus[i];
        if(typeMenu.id === item.id){
            typeMenu.name = item.name;
            typeMenu.onSale = item.onSale;
            return ;
        }else if (typeMenu.children && typeMenu.children.length > 0) {
            typeOrProductUpdate(typeMenu.children, item);
        }
    }
}

export function addProductToMenu(menus: Array<any>, typeId: string, product: any) {
    for(let i = 0; i < menus.length; i++){
        let item = menus[i];
        if (item.id === typeId) {
            item.children.unshift(product);
            return;
        }
    }
}

export function findMenu(menus:Array<any>, path: string, isId: boolean):any {
    for (let i = 0; i < menus.length; i++){
        let item = menus[i];
        if ((!isId && item.path === path) || (isId && item.id === path)) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            let menu = findMenu(item.children, path, isId);
            if (menu) {
                return menu;
            }
        }
    }
}

export function getProductUserPrice(product: any, userRoleType = 'role_gold') {
    let price;
    switch (userRoleType) {
        case 'role_top':
            price = product.topPrice;
            break;
        case 'role_super':
            price = product.superPrice;
            break;
        default:
            price = product.goldPrice;
    }
    return price;
}

export function deepClone(obj:any) {
    return JSON.parse(JSON.stringify(obj));
}

export function changeMenuWaitCount(menus: Array<any>, aim: string, cb:(itemA:any, itemB:any) => any) {
    for(let i = 0; i < menus.length; i++){
        let menu = menus[i];
        if (menu.fingerprint === aim) {
            return cb(menu, null);
        }
        if (menu.type !== 'menu') {
            let menuItems = menu.children;
            for(let i = 0; i < menuItems.length; i++){
                let menuItem = menuItems[i];
                if (menuItem.fingerprint === aim) {
                    return cb(menuItem, menu);
                }
            }
        }
    }
}

export function today() {
    return moment().format('YYYY-MM-DD');
}

export function myDateFromat(date:string) {
    if (date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }else {
        return '';
    }
}

export function countOrderProgress(order:any) {
    if (order.status === '执行中' && !order.countProgress) {
        order.countProgress = true;
        let minute = (Date.now() - Date.parse(order.dealTime) - order.queueTime * 60 * 60 * 1000) / 1000 / 60;
        if (minute < 0) {
            order.status = '排队中';
        }else {
            let executeNum = Math.round(minute * order.speed);
            if (executeNum >= order.num) {
                order.executeNum = order.num;
                order.status = '待结算';
            }else{
                order.executeNum = executeNum;
            }
        }
    }
    return parseFloat((order.executeNum / order.num * 100).toFixed(2));
}

export const document = window.document;

const Storage = {
    length() {
        return window.sessionStorage.length;
    },
    key(index: number) {
        return window.sessionStorage.key(index);
    },
    getItem(key: string) {
        let info = window.sessionStorage.getItem(key)
        return info ? unzip(info): info;
    },
    setItem(key: string, value: any) {
        window.sessionStorage.setItem(key, zip(value));
    },
    removeItem(key: string) {
        window.sessionStorage.removeItem(key);
    },
    clear() {
        window.sessionStorage.clear();
    }
};

export default Storage;

