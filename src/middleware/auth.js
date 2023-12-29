const jwt = require("jsonwebtoken"); //to verify toker
const User = require("../models/user"); //to load users from db

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", ""); //how to get header value and remove beared
    const decoded = jwt.verify(token, process.env.JWT_SECRET); //making sure it is created by our server and not expired
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    }); //find by id and make sure token is still a part of tokens array
    // console.log(decoded)
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user; //giving access to route handler to user that we fetcher no need to fetch again and wate time
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

module.exports = auth;
