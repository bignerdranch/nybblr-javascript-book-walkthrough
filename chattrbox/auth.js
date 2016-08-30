var KoaRouter = require('koa-router');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var CLIENT_ID = process.env.OAUTH_ID;
var CLIENT_SECRET = process.env.OAUTH_SECRET;
var CLIENT_CALLBACK = process.env.OAUTH_CALLBACK;
var DOMAIN = process.env.OAUTH_DOMAIN;

module.exports = ({ passport }) => {
  var api = KoaRouter();

  passport.use(new GoogleStrategy({
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CLIENT_CALLBACK
    },
    (accessToken, refreshToken, profile, done) => {
      var domain = profile._json.domain;
      if (domain === DOMAIN) {
        var email = profile.emails[0].value;
        done(null, { email });
      } else {
        done(new Error('Invalid host domain'));
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  api.get('/auth/google',
      passport.authenticate('google', {
        scope: ['email', 'profile'],
        hd: DOMAIN
      }));

  api.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'
      }));

  var ensure = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
      return await next();
    }

    ctx.redirect('/auth/google');
  };

  return { api, ensure };
};
