const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user')
const passport = require('passport')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'FBF852F950F0A6A3210771C9622D74CD686D472C11A975DB7FEAE7EC662815DC';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    
    try {
        // console.log(jwt_payload.id);
        const user =  await User.findOne({ _id:jwt_payload.id});
        if(!user){
            return done(new Error('ไม่พบผู้ใช้งาน',null));
        }
        
        return done(null,user)
    } catch (error) {
        
    }
}));


module.exports.isLogin = passport.authenticate('jwt', { session: false });