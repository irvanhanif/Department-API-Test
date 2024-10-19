/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { genSaltSync, hashSync } = require("bcryptjs");
const salt = genSaltSync(10);
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  // await knex('table_name').del()
  await knex("users").insert({
    email: "admin123@example.com",
    username: "admin",
    password: hashSync("4dm1n", salt),
  });
  const adminId = await knex("users").select("id").where("username", "admin");

  const idRole = await knex("roles").insert({
    role: "Admin",
    description: "Has full access to manage users, roles, and system settings.",
    permission: JSON.stringify([
      "manage_users",
      "manage_roles",
      "manage_settings",
      "view_reports",
    ]),
    id_user: adminId[0].id,
  });

  await knex("users")
    .update({
      id_role: idRole[0],
    })
    .where("id", adminId[0].id);
};
