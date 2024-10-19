/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("roles", (table) => {
    table.increments("id").notNullable().primary();
    table.string("role", 50).notNullable();
    table.text("description").nullable();
    table.text("permission").notNullable();
    table.uuid("id_user").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.hasTable("roles").then(() => {
    return knex.schema.alterTable("roles", (table) => {
      table.dropForeign("id_user", "roles_id_user_foreign");
      table.dropIndex("id_user", "roles_id_user_foreign");
    });
  });
  await knex.schema.dropTableIfExists("roles");
  return await knex.schema.dropTableIfExists("users");
};
