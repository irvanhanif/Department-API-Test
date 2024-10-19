const router = require("express").Router();
const {
  addRole,
  deleteRole,
  updateRole,
  getRoleById,
  getAllRole,
} = require("../controllers/role.controller");

router.post("/", addRole);
router.get("/", getAllRole);
router.get("/:id", getRoleById);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

module.exports = router;
