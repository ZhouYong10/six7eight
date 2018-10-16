import passport = require('koa-passport');
import PassportLocal = require('passport-local');
import {User} from "./entity/User";
import {UserSite} from "./entity/UserSite";
import {UserAdmin} from "./entity/UserAdmin";
import {comparePass} from "./utils";

const LocalStrategy = PassportLocal.Strategy;

const Strateges = {
    platform: '0',
    site: '1',
    local: '2'
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

passport.use('platform', new LocalStrategy(async (username, password, done) => {
    strategy = Strateges.platform;
    try{
        let user = await UserAdmin.findByName(username);
        if (user && comparePass(password, user.password)) {
            done(null, user);
        } else {
            done(null, false);
        }
    }catch (e) {
        done(e);
    }
}));

passport.use('site', new LocalStrategy({passReqToCallback: true},
    async (req, username, password, done) => {
        let siteAddress = req.hostname;
        strategy = Strateges.site;
        try{
            let user = await UserSite.findByNameAndSiteAddress(username, siteAddress);
            if (user && comparePass(password, user.password)) {
                done(null, user);
            } else {
                done(null, false);
            }
        }catch (e) {
            done(e);
        }
}));

passport.use('user', new LocalStrategy({passReqToCallback: true},
    async (req, username, password, done) => {
        let siteAddress = req.hostname;
        strategy = Strateges.local;
        try{
            let user = await User.findByNameAndSiteAddress(username, siteAddress);
            if (user && comparePass(password, user.password)) {
                done(null, user);
            } else {
                done(null, false);
            }
        }catch (e) {
            done(e);
        }
}));