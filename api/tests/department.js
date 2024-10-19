function departmentTest(request, app) {
  require("dotenv").config();
  let path = "/api/department";

  let ID_department,
    dummy_ID_department = 0;
  let dataDepartment = [
    {
      name: "Information Technology",
      code: "IT001",
      location: "Head Office - Building A",
      description:
        "Responsible for managing and overseeing all technical infrastructure and systems within the company, including hardware, software, network, and IT services.",
      contact: '{"email": "it-dept@company.com", "phone": "+1-555-123-4567"}',
    },
    {
      description:
        "Handles all employee relations, recruitment, and human resources strategy for the organization.",
      contact: '{"email": "hr@company.com", "phone": "+1-555-987-6543"}',
    },
    {
      name: "Finance",
      code: "FIN002",
      location: "Building C, 2nd Floor",
    },
  ];

  describe(`POST ${path}`, () => {
    it("Should create a department", async () => {
      const res = await request(app).post(path).send(dataDepartment[0]);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toMatchObject(dataDepartment[0]);
      ID_department = res.body.data.id;
    });
    it("Should return error at missing name, code, and location", async () => {
      const res = await request(app).post(path).send(dataDepartment[1]);
      expect(res.statusCode).toEqual(500);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("object");
    });
    it("Should create a department with missing description and contact", async () => {
      const res = await request(app).post(path).send(dataDepartment[2]);
      expect(res.statusCode).toEqual(201);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toMatchObject(dataDepartment[2]);
      dataDepartment[2]["id"] = res.body.data.id;
      process.env.SHARED_ID_DEPARTMENT = res.body.data.id;
    });
  });

  describe(`GET ${path}`, () => {
    it("Should return all department", async () => {
      const res = await request(app).get(path);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe(`GET ${path}/:id`, () => {
    it("Should return a department", async () => {
      const res = await request(app).get(`${path}/${ID_department}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toMatchObject(dataDepartment[0]);
    });
    it("Should return data not found", async () => {
      const res = await request(app).get(`${path}/${dummy_ID_department}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Department not found");
    });
  });

  dataDepartment[0]["name"] = "Information Technology and AI Labs";
  dataDepartment[0]["location"] = "Head Office - Building C";
  describe(`PUT ${path}/:id`, () => {
    it("Should update a department", async () => {
      const res = await request(app)
        .put(`${path}/${ID_department}`)
        .send(dataDepartment[0]);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toMatchObject(dataDepartment[0]);
    });
    it("Should return data not found", async () => {
      const res = await request(app)
        .put(`${path}/${dummy_ID_department}`)
        .send(dataDepartment[0]);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Department not found");
    });
  });

  describe(`DELETE ${path}/:id`, () => {
    it("Should delete a department", async () => {
      const res = await request(app).delete(`${path}/${ID_department}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toEqual(true);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toEqual("Success delete department");
    });
    it("Should return data not found", async () => {
      const res = await request(app).delete(`${path}/${dummy_ID_department}`);
      expect(res.statusCode).toEqual(404);
      expect(res.body.success).toEqual(false);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual("Data Department not found");
    });
  });
}

module.exports = { departmentTest };
