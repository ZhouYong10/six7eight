export function host(path: string) {
    const host = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.0.116:3000';
    return host + path;
}