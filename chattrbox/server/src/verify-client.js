module.exports = (extractSession) => {
  return async ({ req }, done) => {
    console.log('verifying client');
    try {
      var session = await extractSession(req);
      var hasSession = session && session.passport && session.passport.user;
      done(hasSession);
    } catch(e) {
      console.log(e);
      done(false);
    }
  };
};
