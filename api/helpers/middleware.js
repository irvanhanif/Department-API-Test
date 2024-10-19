const { getUserById } = require("../services/user.service");
const { ERROR } = require("./response");
const { verify } = require("jsonwebtoken");

module.exports = {
  tokenValidate: async (req, res, next) => {
    let token = req.header("Authorization");
    if (req.cookies["token_api"] && !token) token = req.cookies["token_api"];
    if (!token) return ERROR(res, 401, "You must be log in");
    if (token.split(" ").length > 1) token = token.split(" ")[1];

    try {
      const decoded = verify(token, process.env.API_KEY, {
        algorithms: "HS256",
      });
      if (!decoded.user) return ERROR(res, 403, "Your token is invalid");

      const [errorfindExistUser, resultExistUser] = await getUserById(
        decoded.user.id
      );
      if (errorfindExistUser) return ERROR(res, 500, errorfindExistUser);
      if (!resultExistUser) {
        res.clearCookie("token_api");
        return ERROR(res, 404, "You must be reLogin");
      }

      delete resultExistUser["password"];
      req.decoded = resultExistUser;
      next();
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
};
