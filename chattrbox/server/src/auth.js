var KoaRouter = require('koa-router');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var CLIENT_ID = process.env.OAUTH_ID;
var CLIENT_SECRET = process.env.OAUTH_SECRET;
var CLIENT_CALLBACK = process.env.OAUTH_CALLBACK;

module.exports = ({ passport }) => {
  passport.use(new GoogleStrategy({
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: CLIENT_CALLBACK
    },
    (accessToken, refreshToken, profile, done) => {
      var email = profile.emails[0].value;
      var name = profile.displayName;
      done(null, { email, name });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  var api = KoaRouter();

  api.get('/auth/google',
    passport.authenticate('google', {
      scope: ['email', 'profile']
    }));

  api.get('/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login'
    }));

  return api;
};

module.exports.redirect = async (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return await next();
  }

  ctx.redirect('/auth/google');
};
