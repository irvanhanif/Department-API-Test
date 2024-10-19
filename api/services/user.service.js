const knex = require("../database/knex");
const tableName = "users";

module.exports = {
  insertUser: async (req) => {
    const { email, username, password, born, id_role, id_department } = req;
    try {
      await knex(tableName).insert({
        email,
        username,
        password,
        born,
        id_role,
        id_department,
      });
      return [null, true];
    } catch (error) {
      return ["Error to insert user", false];
    }
  },
  getUserByUsername: async (req) => {
    try {
      const result = await knex(tableName)
        .select()
        .where("username", req)
        .limit(1);
      return [null, result[0]];
    } catch (error) {
      return ["Error to get user", false];
    }
  },
  getUserByEmailOrUsername: async (req) => {
    try {
      let result;
      if (typeof req === "object") {
        result = await knex(tableName)
          .select()
          .where("email", req.email)
          .orWhere("username", req.username)
          .limit(1);
      } else {
        result = await knex(tableName)
          .select()
          .where("email", req)
          .orWhere("username", req)
          .limit(1);
      }
      return [null, result[0]];
    } catch (error) {
      return ["Error to get user", false];
    }
  },
  getUsers: async ({ offSet, limit }) => {
    try {
      const result = await knex(tableName)
        .select()
        .leftJoin("roles", "roles.id_user", "=", "users.id")
        .offset(offSet)
        .limit(limit);
      const usersId = await knex(tableName)
        .select("users.id")
        .leftJoin("roles", "roles.id_user", "=", "users.id")
        .offset(offSet)
        .limit(limit);
      return [null, { users: result, id: usersId }];
    } catch (error) {
      return ["Error to get All users", false];
    }
  },
  getUserById: async (req) => {
    try {
      const result = await knex(tableName)
        .select("*")
        .where("users.id", req)
        .leftJoin("roles", "roles.id", "=", "users.id_role")
        .limit(1);
      if (result.length > 0) result[0]["id"] = req;
      return [null, result[0]];
    } catch (error) {
      return ["Error to get detail user", false];
    }
  },
  updateUserById: async (req) => {
    const { id, email, username, born, id_role, id_department } = req;

    try {
      await knex(tableName)
        .update({
          email,
          username,
          born,
          id_role,
          id_department,
        })
        .where("id", id);
      return [null, "Success Update User"];
    } catch (error) {
      return ["Error to update user", false];
    }
  },
  deleteUserById: async (req) => {
    try {
      await knex(tableName).delete().where("id", req);
      return [null, "Success Delete User"];
    } catch (error) {
      return ["Error to delete user", false];
    }
  },
};
