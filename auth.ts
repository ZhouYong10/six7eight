import passport = require('koa-passport');
import PassportLocal = require('passport-local');

const LocalStrategy = PassportLocal.Strategy;


const fetchUser = (() => {
    const user:any = { id: 1, username: 'test', password: 'test' };
    return async () => {
        return user;
    }
})();

passport.serializeUser((user:any, done) => {
    console.log('serializeUser: ' + JSON.stringify(user));
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
    console.log('deserializeUser: ' + id);
    try {
        const user = await fetchUser();
        done(null, user);
    } catch(err) {
        done(err);
    }
});

passport.use(new LocalStrategy((username, password, done) => {
    console.log('LocalStrategy username: ' + username);
    console.log('LocalStrategy password: ' + password);
    fetchUser()
        .then(user => {
            if (username === user.username && password === user.password) {
                done(null, user);
            } else {
                done(null, false);
            }
        })
        .catch((err) => { done(err) });
}));