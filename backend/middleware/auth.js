const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token)
    return res.send("Toegang geweigerd. Niet geverifieerd...");
  try {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = jwt.verify(token, jwtSecretKey);

    req.user = decoded;
    next();
  } catch (ex) {
    res.send("Ongeldige verificatietoken...");
  }
};

// For User Profile
const isUser = (req, res, next) => {
  auth(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.send("Toegang geweigerd. Niet geverifieerd...");
    }
  });
};

// For Admin
const isAdmin = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.send("Toegang geweigerd. Niet geverifieerd......");
    }
  });
};

module.exports = { auth, isUser, isAdmin };
