const environtment = process.env.ENVIRONMENT_DB || "development";
const config = require("../database/knexfile")[environtment];
module.exports = require("knex")(config);
