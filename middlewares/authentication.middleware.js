const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).send({ message: "login first" });
    }

    // check for token if blacklist
    // let data = fs.readFileSync("./blacklisted.json");
    // const blackListedTokens = JSON.parse(data);
    // if (blackListedTokens.includes(token)) {
    //   return res.status(400).send("user is already logged out");
    // }

    // verify token for authentication
    const decoded = jwt.verify(token, "jsonwebtoken");
    if (!decoded) {
      return res.status(403).send({ message: "please login" });
    }
    req.userID = decoded.userID;
    next();
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).send({ message: error.message,fix:"please login again" });
  }
};
