var extractSession = require('./extract-session');

module.exports = (app, sessionParser) => {
  return async ({ req }, done) => {
    console.log('verifying client');
    try {
      var session = await extractSession(sessionParser, app, req);
      var hasSession = session && session.passport && session.passport.user;
      done(hasSession);
    } catch(e) {
      console.log(e);
      done(false);
    }
  };
};
