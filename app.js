const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();

const routes = require("./api/routers/routes");
const cookieParser = require("cookie-parser");
const { swaggerUi, specs } = require("./api/helpers/swagger");

app.use(express.json());
app.use(
  cors({
    credentials: true,
    methods: ["POST", "PUT", "DELETE", "GET"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.use("/api", routes);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;
