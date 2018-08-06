"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("koa-passport");
const PassportLocal = require("passport-local");
const User_1 = require("./entity/User");
const UserSite_1 = require("./entity/UserSite");
const UserAdmin_1 = require("./entity/UserAdmin");
const utils_1 = require("./utils");
const LocalStrategy = PassportLocal.Strategy;
const Strateges = {
    platform: '0',
    site: '1',
    local: '2'
};
let strategy;
function fetchUserByName(username) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        switch (strategy) {
            case Strateges.platform:
                user = yield UserAdmin_1.UserAdmin.findByName(username);
                break;
            case Strateges.site:
                user = yield UserSite_1.UserSite.findByName(username);
                break;
            case Strateges.local:
                user = yield User_1.User.findByName(username);
                break;
        }
        return user;
    });
}
function fetchUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        let user;
        switch (strategy) {
            case Strateges.platform:
                user = yield UserAdmin_1.UserAdmin.findById(id);
                break;
            case Strateges.site:
                user = yield UserSite_1.UserSite.findById(id);
                break;
            case Strateges.local:
                user = yield User_1.User.findById(id);
                break;
        }
        return user;
    });
}
passport.serializeUser((user, done) => {
    done(null, user.id + strategy);
});
passport.deserializeUser((info, done) => __awaiter(this, void 0, void 0, function* () {
    let id = info.substr(0, info.length - 1);
    strategy = info.substr(-1, 1);
    try {
        const user = yield fetchUserById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
function verifyUser(username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = yield fetchUserByName(username);
            console.log(JSON.stringify(user));
            if (user && utils_1.comparePass(password, user.password)) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        }
        catch (e) {
            done(e);
        }
    });
}
passport.use('platform', new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
    strategy = Strateges.platform;
    yield verifyUser(username, password, done);
})));
passport.use('site', new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
    strategy = Strateges.site;
    yield verifyUser(username, password, done);
})));
passport.use(new LocalStrategy((username, password, done) => __awaiter(this, void 0, void 0, function* () {
    strategy = Strateges.local;
    yield verifyUser(username, password, done);
})));
//# sourceMappingURL=auth.js.map