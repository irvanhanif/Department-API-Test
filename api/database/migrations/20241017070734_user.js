/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").defaultTo(knex.fn.uuid()).notNullable().primary();
    table.string("email", 50).notNullable().unique({ indexName: "user_email" });
    table
      .string("username", 50)
      .notNullable()
      .unique({ indexName: "user_username" });
    table.string("password", 250).notNullable();
    table.string("born", 20).nullable();
    table.integer("id_role").unsigned().nullable();
    table
      .foreign("id_role")
      .references("id")
      .inTable("roles")
      .onUpdate("Cascade")
      .onDelete("Cascade");
    table.integer("id_department").unsigned().nullable();
    table
      .foreign("id_department")
      .references("id")
      .inTable("departments")
      .onUpdate("Cascade")
      .onDelete("Cascade");
  });
  return await knex.schema.alterTable("roles", (table) => {
    table
      .foreign("id_user")
      .references("id")
      .inTable("users")
      .onUpdate("Cascade")
      .onDelete("Cascade");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropForeign("id_role", "users_id_role_foreign");
    table.dropIndex("id_role", "users_id_role_foreign");
    table.dropForeign("id_department", "users_id_department_foreign");
    table.dropIndex("id_department", "users_id_department_foreign");
  });
};
