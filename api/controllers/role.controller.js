const { roleSchema } = require("../helpers/joiSchema");
const { SUCCESS, ERROR } = require("../helpers/response");
const {
  insertRole,
  getRoles,
  getRoleById,
  updateRoleById,
  deleteRoleById,
} = require("../services/role.service");
const { updateUserById } = require("../services/user.service");

const idUserChangeKey = (data) => {
  data["idUser"] = data["id_user"];
  delete data.id_user;
};

module.exports = {
  addRole: async (req, res) => {
    const { role, description, permission, idUser } = req.body;

    try {
      let dataRole = {
        role,
        description,
        permission,
        id_user: idUser,
      };

      await roleSchema.validateAsync(dataRole);

      const [errorInsertRole, resultInsertRole] = await insertRole(dataRole);
      if (errorInsertRole) return ERROR(res, 500, errorInsertRole);

      const [errorUpdateRoleUser, _] = await updateUserById({
        id_role: resultInsertRole,
        id: dataRole["id_user"],
      });
      if (errorUpdateRoleUser) return ERROR(res, 500, errorUpdateRoleUser);

      const [errorGetRole, resultGetRole] = await getRoleById(resultInsertRole);
      if (errorGetRole) return ERROR(res, 500, errorGetRole);

      idUserChangeKey(resultGetRole);
      return SUCCESS(res, 201, resultGetRole);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  getAllRole: async (req, res) => {
    try {
      const [errorGetRoles, resultGetRoles] = await getRoles();
      if (errorGetRoles) return ERROR(res, 500, errorGetRoles);

      resultGetRoles.map((role) => idUserChangeKey(role));
      return SUCCESS(res, 200, resultGetRoles);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  getRoleById: async (req, res) => {
    const { id } = req.params;

    try {
      const [errorGetRole, resultGetRole] = await getRoleById(id);
      if (errorGetRole) return ERROR(res, 500, errorGetRole);
      if (!resultGetRole) return ERROR(res, 404, "Data Role not found");

      idUserChangeKey(resultGetRole);
      return SUCCESS(res, 200, resultGetRole);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  updateRole: async (req, res) => {
    const { id } = req.params;
    const { role, description, permission, idUser } = req.body;

    try {
      let dataRole = {
        id,
        role,
        description,
        permission,
        id_user: idUser,
      };

      await roleSchema.validateAsync(dataRole);

      const [errorFindRole, resultFindRole] = await getRoleById(id);
      if (errorFindRole) return ERROR(res, 500, errorFindRole);
      if (!resultFindRole) return ERROR(res, 404, "Data Role not found");

      const [errorUpdateRole, _] = await updateRoleById(dataRole);
      if (errorUpdateRole) return ERROR(res, 500, errorUpdateRole);

      const [errorGetRole, resultGetRole] = await getRoleById(id);
      if (errorGetRole) return ERROR(res, 500, errorGetRole);

      idUserChangeKey(resultGetRole);
      return SUCCESS(res, 200, resultGetRole);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  deleteRole: async (req, res) => {
    const { id } = req.params;

    try {
      const [errorFindRole, resultFindRole] = await getRoleById(id);
      if (errorFindRole) return ERROR(res, 500, errorFindRole);
      if (!resultFindRole) return ERROR(res, 404, "Data Role not found");

      const [errorDeleteForeignRoleInUser, _] = await updateUserById({
        id: resultFindRole.id_user,
        id_role: null,
      });
      if (errorDeleteForeignRoleInUser)
        return ERROR(res, 500, errorDeleteForeignRoleInUser);

      const [errorDeleteRole, resultDeleteRole] = await deleteRoleById(id);
      if (errorDeleteRole) return ERROR(res, 500, errorDeleteRole);

      return SUCCESS(res, 200, resultDeleteRole);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
};
