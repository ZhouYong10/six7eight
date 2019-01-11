import axios, {AxiosRequestConfig} from "axios";
import {Loading, Message} from "element-ui";
import {ElLoadingComponent} from "element-ui/types/loading";
import storePlat from '../platform/store';
import storeSite from '../siteEnd/store';
import {host} from "./utils";
import {window} from '@/window';

let loadingInstance: ElLoadingComponent;
axios.interceptors.request.use(
    config => {
        loadingInstance = Loading.service({
            target: 'main',
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
                let info = res.data.msg.split('!-');
                Message({
                    message: info[0],
                    type: 'error',
                    duration: 5000,
                    showClose: true
                });
                if (info[1]) {
                    if (info[1] === 'platform') {
                        storePlat.commit('logout');
                        if (process.env.NODE_ENV === 'production') {
                            window.history.go('/platform');
                        } else {
                            window.history.go('/platform.html');
                        }
                    }
                    if (info[1] === 'site') {
                        storeSite.commit('logout');
                        if (process.env.NODE_ENV === 'production') {
                            window.history.go('/admin');
                        } else {
                            window.history.go('/siteEnd.html');
                        }
                    }
                }
                return ;
            }
        }
    },
    error => {
        Message.error('未知错误，请联系系统管理员！');
        return Promise.reject(error);
    }
);

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