const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Doc JSM",
      version: "1.0.0",
      description: "This is a simple CRUD API",
    },
    servers: [
      {
        url: "http://localhost:4500",
        description: "Development server",
      },
    ],
  },
  apis: ["./api/controllers/swagger/*.yaml"],
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
