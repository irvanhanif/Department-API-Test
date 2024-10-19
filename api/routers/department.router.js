const {
  addDepartment,
  getAllDepartment,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/department.controller");

const router = require("express").Router();

router.post("/", addDepartment);
router.get("/", getAllDepartment);
router.get("/:id", getDepartmentById);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
