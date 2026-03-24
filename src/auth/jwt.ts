import { Strategy, ExtractJwt, type VerifiedCallback } from 'passport-jwt';
import User from './../database/models/User'; // mock user class
import bcrypt from 'bcrypt';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret-test',
};

async function verify(payload: any, done: VerifiedCallback) {
  /* 
    a valid JWT in our system must have `id` and `jwtSecureCode`.
    you can create your JWT like the way you like.
  */
  // bad path: JWT is not valid
  if (!payload?.id || !payload?.jwtSecureCode) {
    return done(null, false);
  }

  // try to find a User with the `id` in the JWT payload.
  const user = await User.findOne({
    where: {
      id: payload.id,
    },
  });

  // bad path: User is not found.
  if (!user) {
    return done(null, false);
  }

  // compare User's jwtSecureCode with the JWT's `jwtSecureCode` that the 
  // request has.
  // bad path: bad JWT, it sucks.
  if (!bcrypt.compareSync(user.jwtSecureCode, payload.jwtSecureCode)) {
    return done(null, false);
  }

  // happy path: JWT is valid, we auth the User.
  return done(null, user);
}

export default new Strategy(options, verify);