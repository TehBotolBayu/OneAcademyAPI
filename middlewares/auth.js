const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}

async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}

const checkToken = (req, res, next) => {
    let token = req.headers.authorization

    if(!token) {
        return res.status(403).json({
            error: 'please provide a token'
        })
    }
    
    if(token.toLowerCase().startsWith("bearer")) {
        token = token.slice(6).trim()
    }

    const jwtPayLoad = jwt.verify(token, 'secret_key');
    
    res.locals.userId = jwtPayLoad.id

    if(!jwtPayLoad){
        return res.status(403).json({
            error: 'unauthenticated'
        })
    }

    res.user = jwtPayLoad

    next()
}


module.exports = {checkToken};