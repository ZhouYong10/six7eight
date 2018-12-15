import passport = require('koa-passport');
import PassportLocal = require('passport-local');
import {User} from "./entity/User";
import {UserSite} from "./entity/UserSite";
import {UserAdmin} from "./entity/UserAdmin";
import {comparePass} from "./utils";
import {UserState} from "./entity/UserBase";
import {SiteState} from "./entity/Site";

const LocalStrategy = PassportLocal.Strategy;

const Strateges = {
    platform: '1',
    site: '2',
    local: '3'
};
let strategy: string;


async function fetchUserById(id: string) {
    let user;
    switch (strategy) {
        case Strateges.platform:
            user = await UserAdmin.findById(id);
            break;
        case Strateges.site:
            user = await UserSite.findById(id);
            break;
        case Strateges.local:
            user = await User.findById(id);
            break;
    }
    return user;
}

passport.serializeUser((user:any, done) => {
    done(null, user.id + strategy)
});

passport.deserializeUser(async (info:string, done) => {
    let id = info.substr(0, info.length - 1);
    strategy = info.substr(-1, 1);
    try {
        const user = await fetchUserById(id);
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    } catch(err) {
        done(err);
    }
});

passport.use('platform', new LocalStrategy({passReqToCallback: true},
    async (req, username, password, done) => {
    strategy = Strateges.platform;
        let request: any = req;
    try{
        if (request.session.captcha !== request.body.securityCode) {
            done(new Error('验证码错误'));
        }else{
            let user = await UserAdmin.findByName(username);
            if (user && comparePass(password, user.password)) {
                if (user.getState === UserState.Ban) {
                    done(new Error('账户: ' + user.username + ' 已被禁用了!'));
                }else{
                    done(null, user);
                }
            } else {
                done(new Error('账户名或密码错误!'));
            }
        }
    }catch (e) {
        done(e);
    }
}));

passport.use('site', new LocalStrategy({passReqToCallback: true},
    async (req, username, password, done) => {
        strategy = Strateges.site;
        let request: any = req;
        try{
            if (request.session.captcha !== request.body.securityCode) {
                done(new Error('验证码错误'));
            }else{
                let user = await UserSite.findByNameWithSite(username, request.hostname);
                if (user && comparePass(password, user.password)) {
                    let site = user.site;
                    if (site.getState === SiteState.Ban) {
                        done(new Error('站点: '+ site.name +' 已被禁用!'));
                    }else{
                        if (user.getState === UserState.Ban) {
                            done(new Error('账户: ' + user.username + ' 已被禁用了!'));
                        }else{
                            done(null, user);
                        }
                    }
                } else {
                    done(new Error('账户名或密码错误!'));
                }
            }
        }catch (e) {
            done(e);
        }
}));

passport.use('user', new LocalStrategy({passReqToCallback: true},
    async (req, username, password, done) => {
        strategy = Strateges.local;
        let request: any = req;
        try{
            if (request.session.captcha !== request.body.securityCode) {
                done(new Error('验证码错误'));
            }else{
                let user = await User.findByNameWithSite(username, request.hostname);
                if (user && comparePass(password, user.password)) {
                    if (user.getState === UserState.Ban) {
                        done(new Error('账户: ' + user.username + ' 已被禁用了!'));
                    }else{
                        done(null, user);
                    }
                } else {
                    done(new Error('账户名或密码错误!'));
                }
            }
        }catch (e) {
            done(e);
        }
}));