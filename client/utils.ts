import axios, {AxiosRequestConfig} from "axios";
import {devConf} from "../config";

function host(path: string) {
    const host = 'http://' + devConf.serveIp + ':' + devConf.servePort;
    return host + path;
}

export async function axiosGet(path: string, config?:AxiosRequestConfig) {
    return process.env.NODE_ENV === 'production' ?
        await axios.get(path, config) :
        await axios.get(host(path), {withCredentials: true, ...config});
}

export async function axiosPost(path: string, params: any, config?:AxiosRequestConfig) {
    return process.env.NODE_ENV === 'production' ?
        await axios.post(path, params, config) :
        await axios.post(host(path), params, {withCredentials: true, ...config});
}