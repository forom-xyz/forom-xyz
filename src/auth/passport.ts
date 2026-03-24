import passport from 'passport';
import googleStrategy from './google';
import jwtStrategy from './jwt';

// initialize passport with Google and JWT strategies
passport.use('google', googleStrategy);
passport.use('jwtAuth', jwtStrategy);

export default passport;