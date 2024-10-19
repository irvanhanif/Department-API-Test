const route = require("express").Router();
const {
  register,
  login,
  getAllUser,
  getUserById,
  logout,
  deleteUser,
  updateUser,
} = require("../controllers/user.controller");
const { tokenValidate } = require("../helpers/middleware");

route.post("/register", register);
route.post("/login", login);
route.get("/all", tokenValidate, getAllUser);
route.get("/detail/:id", tokenValidate, getUserById);
route.put("/:id", tokenValidate, updateUser);
route.delete("/logout", tokenValidate, logout);
route.delete("/:id", tokenValidate, deleteUser);

module.exports = route;
