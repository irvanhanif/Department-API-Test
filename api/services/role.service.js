const knex = require("../database/knex");
const tableName = "roles";

module.exports = {
  insertRole: async (req) => {
    const { role, description, permission, id_user } = req;

    try {
      const result = await knex(tableName).insert({
        role,
        description,
        permission,
        id_user,
      });
      return [null, result[0]];
    } catch (error) {
      return ["Error to insert role", false];
    }
  },
  getRoles: async (req) => {
    try {
      const result = await knex(tableName).select();
      return [null, result];
    } catch (error) {
      return ["Error to get all role", false];
    }
  },
  getRoleById: async (req) => {
    try {
      const result = await knex(tableName).select().where("id", req).limit(1);
      return [null, result[0]];
    } catch (error) {
      return ["Error to get detail role", false];
    }
  },
  updateRoleById: async (req) => {
    const { id, role, description, permission, id_user } = req;

    try {
      await knex(tableName)
        .update({
          role,
          description,
          permission,
          id_user,
        })
        .where("id", id);
      return [null, "Success update role user"];
    } catch (error) {
      return ["Error to update role", false];
    }
  },
  deleteRoleById: async (req) => {
    try {
      await knex(tableName).delete().where("id", req);
      return [null, "Success delete role user"];
    } catch (error) {
      return ["Error to delete role", false];
    }
  },
};
