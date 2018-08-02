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

async function fetchUserByName(username: string) {
    let user;
    switch (strategy) {
        case Strateges.platform:
            user = await UserAdmin.findByName(username);
            break;
        case Strateges.site:
            user = await UserSite.findByName(username);
            break;
        case Strateges.local:
            user = await User.findByName(username);
            break;
    }
    return user;
}

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
        done(null, user);
    } catch(err) {
        done(err);
    }
});

async function verifyUser(username:string, password:string, done:(...params:any[]) => any) {
    try{
        let user = await fetchUserByName(username);
        console.log(JSON.stringify(user));
        if (user && comparePass(password, user.password)) {
            done(null, user);
        } else {
            done(null, false);
        }
    }catch (e) {
        done(e);
    }
}

passport.use('platform', new LocalStrategy(async (username, password, done) => {
    strategy = Strateges.platform;
    await verifyUser(username, password, done);
}));

passport.use('site', new LocalStrategy(async (username, password, done) => {
    strategy = Strateges.site;
    await verifyUser(username, password, done);
}));

passport.use(new LocalStrategy(async (username, password, done) => {
    strategy = Strateges.local;
    await verifyUser(username, password, done);
}));