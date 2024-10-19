const { epochToDate } = require("../helpers/dateFormat");
const { userSchema, loginSchema } = require("../helpers/joiSchema");
const { ERROR, SUCCESS } = require("../helpers/response");
const {
  getUserByUsername,
  getUserByEmailOrUsername,
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  insertUser,
} = require("../services/user.service");
const { compareSync, genSaltSync, hashSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const salt = genSaltSync(10);

const idForeignHandler = (data) => {
  data["idRole"] = data.id_role;
  delete data["id_role"];
  data["idDepartment"] = data.id_department;
  delete data["id_department"];
};

const userGetChangeKey = (data) => {
  data["idUser"] = data.id;
  delete data["id_user"];
  delete data["id"];
};

module.exports = {
  register: async (req, res) => {
    const {
      username,
      email,
      password,
      confirmPassword,
      born,
      idRole,
      idDepartment,
    } = req.body;

    try {
      if (!confirmPassword || confirmPassword !== password)
        return ERROR(res, 400, "Password is not same with confirm password");
      const hashPassword = hashSync(password, salt);
      const epochDateBorn = String(new Date(born) / 1000);

      let dataUser = {
        username,
        email,
        password: hashPassword,
        born: epochDateBorn,
        id_role: idRole,
        id_department: idDepartment,
      };

      await userSchema.validateAsync(dataUser);

      const [errorfindExistUser, resultExistUser] =
        await getUserByEmailOrUsername({
          email: dataUser.email,
          username: dataUser.username,
        });
      if (errorfindExistUser) return ERROR(res, 500, errorfindExistUser);
      if (resultExistUser) return ERROR(res, 409, "User is exist");

      const [errorInsertUser, _] = await insertUser(dataUser);
      if (errorInsertUser) return ERROR(res, 500, errorInsertUser);

      const [errorGetUser, resultGetUser] = await getUserByUsername(
        dataUser.username
      );
      if (errorGetUser) return ERROR(res, 500, errorGetUser);
      if (!resultGetUser) return ERROR(res, 404, "error to regist user");

      delete resultGetUser["password"];
      idForeignHandler(resultGetUser);

      return SUCCESS(res, 201, resultGetUser);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  login: async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
      let dataUser = {
        emailOrUsername,
        password,
      };

      await loginSchema.validateAsync(dataUser);

      const [errorGetUser, resultGetUser] = await getUserByEmailOrUsername(
        dataUser.emailOrUsername
      );
      if (errorGetUser) return ERROR(res, 500, errorGetUser);
      if (!resultGetUser) return ERROR(res, 404, "User not registered");

      if (!compareSync(password, resultGetUser.password))
        return ERROR(res, 401, "Incorrect password");
      delete resultGetUser["password"];

      const token = await sign({ user: resultGetUser }, process.env.API_KEY, {
        algorithm: "HS256",
        expiresIn: "1w",
      });

      res.cookie("token_api", token, {
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 7,
      });

      resultGetUser["born"] = epochToDate(resultGetUser["born"]);
      idForeignHandler(resultGetUser);
      return SUCCESS(res, 200, { user: resultGetUser, token });
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token_api");
      return SUCCESS(res, 200, "Success Logout");
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  getAllUser: async (req, res) => {
    const { from, get } = req.query;
    try {
      const [errorGetUsers, resultGetUsers] = await getUsers({
        offSet: from,
        limit: get,
      });
      if (errorGetUsers) return ERROR(res, 500, errorGetUsers);

      for (let i = 0; i < resultGetUsers["users"].length; i++) {
        let user = resultGetUsers["users"][i];
        user.born = epochToDate(user.born);
        user.id = resultGetUsers["id"][i].id;
        delete user.password;
        userGetChangeKey(user);
        idForeignHandler(user);
        resultGetUsers["users"][i] = user;
      }
      return SUCCESS(res, 200, { users: resultGetUsers["users"] });
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;

    if (
      id !== req.decoded.id &&
      !JSON.parse(req.decoded.permission ?? "[]").includes("manage_users")
    )
      return ERROR(res, 403, "You cant access this data");

    try {
      const [errorGetUser, resultGetUser] = await getUserById(id);
      if (errorGetUser) return ERROR(res, 500, errorGetUser);
      if (!resultGetUser) return ERROR(res, 404, "Data User not found");

      resultGetUser["born"] = epochToDate(resultGetUser["born"]);
      idForeignHandler(resultGetUser);
      userGetChangeKey(resultGetUser);
      delete resultGetUser["password"];

      return SUCCESS(res, 200, { user: resultGetUser });
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { username, email, born, idRole, idDepartment } = req.body;

    if (
      id !== req.decoded.id &&
      !JSON.parse(req.decoded.permission ?? "[]").includes("manage_users")
    )
      return ERROR(res, 403, "You cant access this data");

    try {
      const epochDateBorn = String(new Date(born) / 1000);

      const [errorFindUser, resultFindUser] = await getUserById(id);
      if (errorFindUser) return ERROR(res, 500, errorFindUser);
      if (!resultFindUser) return ERROR(res, 404, "Data User not found");

      let dataUser = {
        id,
        username: username !== undefined ? username : resultFindUser.username,
        email: email !== undefined ? email : resultFindUser.email,
        born: born !== undefined ? epochDateBorn : resultFindUser.born,
        id_role: idRole !== undefined ? idRole : resultFindUser.id_role,
        id_department:
          idDepartment !== undefined
            ? idDepartment
            : resultFindUser.id_department,
      };

      const [errorUpdateUser, _] = await updateUserById(dataUser);
      if (errorUpdateUser) return ERROR(res, 500, errorUpdateUser);

      const [errorGetUser, resultGetUser] = await getUserByUsername(
        dataUser.username
      );
      if (errorGetUser) return ERROR(res, 500, errorGetUser);

      delete resultGetUser["password"];
      const token = await sign({ user: resultGetUser }, process.env.API_KEY, {
        algorithm: "HS256",
        expiresIn: "1w",
      });

      res.cookie("token_api", token, {
        httpOnly: true,
        maxAge: 1000 * 3600 * 24 * 7,
      });

      resultGetUser["born"] = epochToDate(resultGetUser["born"]);
      idForeignHandler(resultGetUser);
      return SUCCESS(res, 200, resultGetUser);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      const [errorFindUser, resultFindUser] = await getUserById(id);
      if (errorFindUser) return ERROR(res, 500, errorFindUser);
      if (!resultFindUser) return ERROR(res, 404, "Data User not found");

      const [errorDeleteUser, resultDeleteUser] = await deleteUserById(id);
      if (errorDeleteUser) return ERROR(res, 500, errorDeleteUser);

      return SUCCESS(res, 200, resultDeleteUser);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
};
