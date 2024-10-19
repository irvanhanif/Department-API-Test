const knex = require("../database/knex");
const tableName = "departments";

module.exports = {
  insertDepartment: async (req) => {
    const { name, code, location, description, contact } = req;

    try {
      const result = await knex(tableName).insert({
        name,
        code,
        location,
        description,
        contact,
      });

      return [null, result];
    } catch (error) {
      return ["Error to insert department", false];
    }
  },
  getDepartments: async (req) => {
    try {
      const result = await knex(tableName).select();
      return [null, result];
    } catch (error) {
      return ["Error to get all department", false];
    }
  },
  getDepartmentById: async (req) => {
    try {
      const result = await knex(tableName).select().where("id", req).limit(1);
      return [null, result[0]];
    } catch (error) {
      return ["Error to get detail department", false];
    }
  },
  updateDepartmentById: async (req) => {
    const { id, name, code, location, description, contact } = req;

    try {
      await knex(tableName)
        .update({
          name,
          code,
          location,
          description,
          contact,
        })
        .where("id", id);
      return [null, "Success update department"];
    } catch (error) {
      return ["Error to update department", false];
    }
  },
  deleteDepartmentById: async (req) => {
    try {
      await knex(tableName).delete().where("id", req);
      return [null, "Success delete department"];
    } catch (error) {
      return ["Error to delete department", false];
    }
  },
};
