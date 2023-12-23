const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const revokedTokens = [];

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
}

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
}

const checkToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({
      error: "please provide a token",
    });
  }

  if (token.toLowerCase().startsWith("bearer")) {
    token = token.slice(6).trim();
  }

  try {
    const jwtPayLoad = jwt.verify(token, "secret_key");
    console.log(jwtPayLoad);
    if (!jwtPayLoad) {
      return res.status(403).json({
        error: "unauthenticated",
      });
    }

    if (revokedTokens.includes(token)) {
      return res.status(403).json({
        error: "token has been revoked",
      });
    }
    res.locals.userId = jwtPayLoad.id;
    res.locals.roleId = jwtPayLoad.roleId

    res.user = jwtPayLoad;

    next();
  } catch (error) {
    return res.status(403).json({
      error: "invalid token",
    });
  }
};

// Fungsi untuk menonaktifkan token
const revokeToken = (tokenToRevoke) => {
    revokedTokens.push(tokenToRevoke);
  };

module.exports = { checkToken,revokeToken };
