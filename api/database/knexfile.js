// Update with your config settings.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
const tableName = process.env.MIGRATE_TABLE;

module.exports = {
  development: {
    client: process.env.DB_DEV_TYPE,
    connection: {
      database: process.env.DB_DEV_NAME,
      user: process.env.DB_DEV_USER,
      password: process.env.DB_DEV_PASS,
    },
    migrations: {
      directory: "./migrations",
    },
  },

  staging: {
    client: process.env.DB_STAG_TYPE,
    connection: {
      database: process.env.DB_STAG_NAME,
      user: process.env.DB_STAG_USER,
      password: process.env.DB_STAG_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: tableName,
    },
  },

  production: {
    client: process.env.DB_PROD_TYPE,
    connection: {
      database: process.env.DB_PROD_NAME,
      user: process.env.DB_PROD_USER,
      password: process.env.DB_PROD_PASS,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: tableName,
    },
  },
};
