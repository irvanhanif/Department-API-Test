const { departmentSchema } = require("../helpers/joiSchema");
const { SUCCESS, ERROR } = require("../helpers/response");
const {
  insertDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartmentById,
  deleteDepartmentById,
} = require("../services/department.service");

module.exports = {
  addDepartment: async (req, res) => {
    const { name, code, location, description, contact } = req.body;

    try {
      let dataDepartment = {
        name,
        code,
        location,
        description,
        contact,
      };

      await departmentSchema.validateAsync(dataDepartment);

      const [errorInsertDepartment, resultInsertDepartment] =
        await insertDepartment(dataDepartment);
      if (errorInsertDepartment) return ERROR(res, 500, errorInsertDepartment);

      const [errorGetDepartment, resultGetDepartment] = await getDepartmentById(
        resultInsertDepartment[0]
      );
      if (errorGetDepartment) return ERROR(res, 500, errorGetDepartment);

      return SUCCESS(res, 201, resultGetDepartment);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  getAllDepartment: async (req, res) => {
    try {
      const [errorGetDepartments, resultGetDepartments] =
        await getDepartments();
      if (errorGetDepartments) return ERROR(res, 500, errorGetDepartments);

      return SUCCESS(res, 200, resultGetDepartments);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  getDepartmentById: async (req, res) => {
    const { id } = req.params;

    try {
      const [errorGetDepartment, resultGetDepartment] = await getDepartmentById(
        id
      );
      if (errorGetDepartment) return ERROR(res, 500, errorGetDepartment);
      if (!resultGetDepartment)
        return ERROR(res, 404, "Data Department not found");

      return SUCCESS(res, 200, resultGetDepartment);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  updateDepartment: async (req, res) => {
    const { id } = req.params;
    const { name, code, location, description, contact } = req.body;

    try {
      let dataDepartment = {
        id,
        name,
        code,
        location,
        description,
        contact,
      };

      await departmentSchema.validateAsync(dataDepartment);

      const [errorFindDepartment, resultFindDepartment] =
        await getDepartmentById(id);
      if (errorFindDepartment) return ERROR(res, 500, errorFindDepartment);
      if (!resultFindDepartment)
        return ERROR(res, 404, "Data Department not found");

      const [errorUpdateDepartment, _] = await updateDepartmentById(
        dataDepartment
      );
      if (errorUpdateDepartment) return ERROR(res, 500, errorUpdateDepartment);

      const [errorGetDepartment, resultGetDepartment] = await getDepartmentById(
        id
      );
      if (errorGetDepartment) return ERROR(res, 500, errorGetDepartment);

      return SUCCESS(res, 200, resultGetDepartment);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
  deleteDepartment: async (req, res) => {
    const { id } = req.params;

    try {
      const [errorFindDepartment, resultFindDepartment] =
        await getDepartmentById(id);
      if (errorFindDepartment) return ERROR(res, 500, errorFindDepartment);
      if (!resultFindDepartment)
        return ERROR(res, 404, "Data Department not found");

      const [errorDeleteDepartment, resultDeleteDepartment] =
        await deleteDepartmentById(id);
      if (errorDeleteDepartment) return ERROR(res, 500, errorDeleteDepartment);

      return SUCCESS(res, 200, resultDeleteDepartment);
    } catch (error) {
      return ERROR(res, 500, error);
    }
  },
};
