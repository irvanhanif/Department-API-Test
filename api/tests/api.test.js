const app = require("../../app");
require("dotenv").config({ path: "../../.env" });
const request = require("supertest");

const { departmentTest } = require("./department");
const { userTest } = require("./user");
const { roleTest } = require("./role");

describe("Department test", () => departmentTest(request, app));
describe("User test", () => userTest(request, app));
describe("Role test", () => roleTest(request, app));
