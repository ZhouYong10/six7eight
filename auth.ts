import passport = require('koa-passport');
import PassportLocal = require('passport-local');
import {getRepository} from "typeorm";
import {User} from "./entity/User";
import {UserSite} from "./entity/UserSite";
import {UserAdmin} from "./entity/UserAdmin";
import {comparePass} from "./utils";

const LocalStrategy = PassportLocal.Strategy;

export enum Strateges{
    Platform = 'PLATFORM',
    Site = 'SITE',
    Local = 'LOCAL'
}

async function fetchUserByName(username: string) {
    let user;
    switch ((global as any).strategy) {
        case Strateges.Platform:
            user = await getRepository(UserAdmin).findOne({username: username});
            break;
        case Strateges.Site:
            user = await getRepository(UserSite).findOne({username: username});
            break;
        case Strateges.Local:
            user = await getRepository(User).findOne({username: username});
            break;
    }
    return user;
}

async function fetchUserById(id: string) {
    let user;
    console.log((global as any).strategy, '11111111111111111111111111111111');
    switch ((global as any).strategy) {
        case Strateges.Platform:
            user = await getRepository(UserAdmin).findOne(id);
            break;
        case Strateges.Site:
            user = await getRepository(UserSite).findOne(id);
            break;
        case Strateges.Local:
            user = await getRepository(User).findOne(id);
            break;
    }
    return user;
}

passport.serializeUser((user:any, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id:string, done) => {
    try {
        const user = await fetchUserById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

async function verifyUser(username:string, password:string, done:(...params:any[]) => any) {
    console.log(username)
    console.log(password)
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
    await verifyUser(username, password, done);
}));

passport.use('site', new LocalStrategy(async (username, password, done) => {
    await verifyUser(username, password, done);
}));

passport.use(new LocalStrategy(async (username, password, done) => {
    await verifyUser(username, password, done);
}));