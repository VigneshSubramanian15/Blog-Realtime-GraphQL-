const { ApolloError } = require("apollo-server");
const jwt = require("jsonwebtoken");

module.exports = function (req) {
    const token = req.headers.authorization;
    if (!token) {
        throw new ApolloError("Access Denied!", 401);
    }
    try {
        const verified = jwt.verify(token, process.env.SALT || "superSecret");
        req.userdata = verified;
        return verified.data;
    } catch (e) {
        throw new ApolloError("token expired!", 401);
    }
};
