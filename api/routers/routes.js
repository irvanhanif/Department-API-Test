const routes = require("express").Router();
const userRouter = require("./user.router");
const roleRouter = require("./role.router");
const departmentRouter = require("./department.router");

routes.use("/user", userRouter);
routes.use("/role", roleRouter);
routes.use("/department", departmentRouter);

module.exports = routes;
