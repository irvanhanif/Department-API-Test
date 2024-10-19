function roleTest(request, app) {
  require("dotenv").config();
  let path = "/api/role";

  let ID_role,
    dummy_ID_role = 0;
  let dataRole = {
    role: "Editor",
    description:
      "Responsible for creating and managing content within the platform, but with limited access to user management and settings.",
    permission: JSON.stringify([
      "create_content",
      "edit_content",
      "delete_content",
      "view_reports",
    ]),
  };

  describe(`POST ${path}`, () => {
    it("Should create a role for user", async () => {
      if (process.env.SHARED_ID_USER)
        dataRole["idUser"] = process.env.SHARED_ID_USER;
      const res = await request(app).post(path).send(dataRole);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
      ID_role = res.body.data.id;
    });
  });

  describe(`GET ${path}`, () => {
    it("Should return all roles of users", async () => {
      const res = await request(app).get(path);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe(`GET ${path}/:id`, () => {
    it("Should return detail role of user", async () => {
      const res = await request(app).get(`${path}/${ID_role}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
    });
    it("Should return data role not found", async () => {
      const res = await request(app).get(`${path}/${dummy_ID_role}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Role not found");
    });
  });

  dataRole["permission"] = JSON.stringify(["create_content", "delete_content"]);
  describe(`PUT ${path}/:id`, () => {
    it("Should update role of user", async () => {
      const res = await request(app).put(`${path}/${ID_role}`).send(dataRole);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
    });
    it("Should return data role not found", async () => {
      const res = await request(app)
        .put(`${path}/${dummy_ID_role}`)
        .send(dataRole);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Role not found");
    });
  });

  describe(`DELETE ${path}/:id`, () => {
    it("Should delete role from user", async () => {
      const res = await request(app).delete(`${path}/${ID_role}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toEqual("Success delete role user");
    });
    it("Should return data role not found", async () => {
      const res = await request(app).delete(`${path}/${dummy_ID_role}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Role not found");
    });
  });
}

module.exports = { roleTest };
