import passport = require('koa-passport');
import PassportLocal = require('passport-local');
import {getRepository} from "typeorm";
import {User} from "./entity/User";
import {UserSite} from "./entity/UserSite";
import {UserAdmin} from "./entity/UserAdmin";
import {comparePass} from "./utils";

const LocalStrategy = PassportLocal.Strategy;


async function fetchUserByName(username: string) {
    let user:any = await getRepository(User).findOne({username: username});
    if (!user) {
        user = await getRepository(UserSite).findOne({username: username});
    }
    if (!user) {
        user = await getRepository(UserAdmin).findOne({username: username});
    }
    return user;
}

async function fetchUserById(id: string) {
    let user: any = await getRepository(User).findOne(id);
    if (!user) {
        user = await getRepository(UserSite).findOne(id);
    }
    if (!user) {
        user = await getRepository(UserAdmin).findOne(id);
    }
    return user;
}

passport.serializeUser((user:any, done) => {
    console.log('serializeUser: ' + JSON.stringify(user));
    done(null, user.id)
});

passport.deserializeUser(async (id:string, done) => {
    console.log('deserializeUser: ' + id);
    try {
        const user = await fetchUserById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

passport.use(new LocalStrategy(async (username, password, done) => {
    console.log('LocalStrategy username: ' + username);
    console.log('LocalStrategy password: ' + password);
    try{
        let user = await fetchUserByName(username);
        if (user && user.username === username && comparePass(password, user.password)) {
            done(null, user);
        } else {
            done(null, false);
        }
    }catch (e) {
        done(e);
    }
}));