/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("departments", (table) => {
    table.increments("id").notNullable().primary();
    table.string("name", 50).notNullable();
    table.string("code", 10).notNullable();
    table.text("location").notNullable();
    table.text("description").nullable();
    table.text("contact").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("departments");
};
