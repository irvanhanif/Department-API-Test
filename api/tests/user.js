function userTest(request, app) {
  require("dotenv").config();
  let path = "/api/user";

  let ID_user,
    token,
    dummy_ID_user = "c32d8b45-92fe-44f6-8b61-42c2107dfe87",
    adminToken;
  let dataUser = [
    {
      email: "alex.smith@example.com",
      username: "alexsmith",
      password: "S3cureP@ss",
      confirmPassword: "S3cureP@ss",
      born: "1992-11-30",
    },
    {
      email: "sara.jones@example.com",
      username: "sarajones",
      password: "Str0ngP@ssword!",
      confirmPassword: "Str0ngP@ssword!",
      born: "1994-04-10",
    },
    {
      email: "alexsmith123@example.com",
      username: "alexsmith",
      password: "Str0ngP@ss",
      confirmPassword: "Str0ngP@ss",
      born: "2002-10-23",
    },
  ];

  describe(`POST ${path}/register`, () => {
    it("Should create or register user", async () => {
      if (process.env.SHARED_ID_DEPARTMENT)
        dataUser[0]["idDepartment"] = process.env.SHARED_ID_DEPARTMENT;
      const res = await request(app).post(`${path}/register`).send(dataUser[0]);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
      ID_user = res.body.data.id;
    });
    it("Should return error at username double in DB", async () => {
      const res = await request(app).post(`${path}/register`).send(dataUser[2]);
      expect(res.statusCode).toEqual(409);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("User is exist");
    });
    it("Should return error when password doesnt match with confirm password", async () => {
      dataUser[2]["confirmPassword"] = "r3turn3rr0r";
      const res = await request(app).post(`${path}/register`).send(dataUser[2]);
      expect(res.statusCode).toEqual(400);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual(
        "Password is not same with confirm password"
      );
      dataUser[2]["confirmPassword"] = dataUser[2]["password"];
    });
    it("Should create user", async () => {
      if (process.env.SHARED_ID_DEPARTMENT)
        dataUser[1]["idDepartment"] = process.env.SHARED_ID_DEPARTMENT;
      const res = await request(app).post(`${path}/register`).send(dataUser[1]);
      process.env.SHARED_ID_USER = res.body.data.id;
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
    });
  });

  describe(`POST ${path}/login`, () => {
    it("Should login and get token from username", async () => {
      const res = await request(app).post(`${path}/login`).send({
        emailOrUsername: "alexsmith",
        password: "S3cureP@ss",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("token");
      token = res.body.data.token;
    });
    it("Should login and get token from email", async () => {
      const res = await request(app).post(`${path}/login`).send({
        emailOrUsername: "sara.jones@example.com",
        password: "Str0ngP@ssword!",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("token");
      process.env.SHARED_USER_TOKEN = res.body.data.token;
    });
    it("Should login and get token of admin", async () => {
      const res = await request(app).post(`${path}/login`).send({
        emailOrUsername: "admin123@example.com",
        password: "4dm1n",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
      expect(res.body.data).toHaveProperty("user");
      expect(res.body.data).toHaveProperty("token");
      adminToken = res.body.data.token;
    });
    it("Should return data user not found", async () => {
      const res = await request(app).post(`${path}/login`).send({
        emailOrUsername: "sara.white@example.com",
        password: "Str0ngP@ssword!",
      });
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("User not registered");
    });
    it("Should return incorrect password", async () => {
      const res = await request(app).post(`${path}/login`).send({
        emailOrUsername: "sara.jones@example.com",
        password: "S3cretP@ssword!",
      });
      expect(res.statusCode).toEqual(401);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Incorrect password");
    });
  });

  describe(`GET ${path}/all`, () => {
    it("Should return all users", async () => {
      const res = await request(app)
        .get(`${path}/all`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("users");
      expect(res.body.data.users.length).toBeGreaterThan(0);
    });
  });

  describe(`GET ${path}/detail/:id`, () => {
    it("Should return detail user", async () => {
      const res = await request(app)
        .get(`${path}/detail/${ID_user}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
    });
    it("Should return cant access data", async () => {
      const res = await request(app)
        .get(`${path}/detail/${ID_user}`)
        .set("Authorization", `Bearer ${process.env.SHARED_USER_TOKEN}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("You cant access this data");
    });
    // admin
    it("Should return data not found", async () => {
      const res = await request(app)
        .get(`${path}/detail/${dummy_ID_user}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data User not found");
    });
  });

  dataUser[0]["born"] = "2000-11-30";

  describe(`PUT ${path}/:id`, () => {
    it("Should update a user", async () => {
      const { username, born, email } = dataUser[0];
      const res = await request(app)
        .put(`${path}/${ID_user}`)
        .send({ username, born, email })
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(typeof res.body.data).toEqual("object");
    });
    it("Should return cant access data", async () => {
      const { username, born, email } = dataUser[0];
      const res = await request(app)
        .put(`${path}/${ID_user}`)
        .send({ username, born, email })
        .set("Authorization", `Bearer ${process.env.SHARED_USER_TOKEN}`);
      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("You cant access this data");
    });
    // admin
    it("Should return data not found", async () => {
      const { username, born, email } = dataUser[0];
      const res = await request(app)
        .put(`${path}/${dummy_ID_user}`)
        .send({ username, born, email })
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data User not found");
    });
  });

  describe(`DELETE ${path}/:id`, () => {
    it("Should delete a user", async () => {
      const res = await request(app)
        .delete(`${path}/${ID_user}`)
        .set("Authorization", `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toEqual("Success Delete User");
    });
    // admin
    it("Should return data not found", async () => {
      const res = await request(app)
        .delete(`${path}/${dummy_ID_user}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data User not found");
    });
  });
}

module.exports = { userTest };
