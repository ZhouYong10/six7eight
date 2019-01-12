import axios, {AxiosRequestConfig} from "axios";
import {Loading, Message} from "element-ui";
import {ElLoadingComponent} from "element-ui/types/loading";
import {isLogin as isLoginPlat, logout as logoutPlat} from '../platform/store';
import {isLogin as isLoginSite, logout as logoutSite} from '../siteEnd/store';
import {isLogin as isLoginUser, logout as logoutUser} from "../siteFront/store";
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
        loadingInstance.close();
        Message.warning('访问超时！');
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    res => {
        loadingInstance.close();
        if (res.data.successed) {
            return res.data.data;
        }else{
            let info = res.data.msg.split('!-');
            if (info[1]) {
                if (info[1] === 'platform') {
                    if (isLoginPlat()) {
                        Message({
                            message: '您的登录状态已过期,请重新登录!',
                            type: 'error',
                            duration: 5000,
                            showClose: true
                        });
                        logoutPlat();
                        if (process.env.NODE_ENV === 'production') {
                            setTimeout(() => {
                                window.history.go('/platform');
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                window.history.go('/platform.html');
                            }, 1000);
                        }
                    }else{
                        Message({
                            message: info[0],
                            type: 'error',
                            duration: 5000,
                            showClose: true
                        });
                    }
                }
                if (info[1] === 'site') {
                    if (isLoginSite()) {
                        Message({
                            message: '您的登录状态已过期,请重新登录!',
                            type: 'error',
                            duration: 5000,
                            showClose: true
                        });
                        logoutSite();
                        if (process.env.NODE_ENV === 'production') {
                            setTimeout(() => {
                                window.history.go('/admin');
                            }, 1000);
                        } else {
                            setTimeout(() => {
                                window.history.go('/siteEnd.html');
                            }, 1000);
                        }
                    }else{
                        Message({
                            message: info[0],
                            type: 'error',
                            duration: 5000,
                            showClose: true
                        });
                    }
                }
                if (info[1] === 'user') {
                    if (isLoginUser()) {
                        axiosGet('/user/init/data').then( (data)=> {
                            logoutUser(data);
                            Message({
                                message: '您的登录状态已过期,请重新登录!',
                                type: 'error',
                                duration: 5000,
                                showClose: true
                            });
                        });
                    }else{
                        Message({
                            message: info[0],
                            type: 'error',
                            duration: 5000,
                            showClose: true
                        });
                    }
                }
            }else{
                Message({
                    message: info[0],
                    type: 'error',
                    duration: 5000,
                    showClose: true
                });
            }
            return ;
        }
    },
    error => {
        loadingInstance.close();
        Message.error('网络连接失败, 或发生未知错误!');
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