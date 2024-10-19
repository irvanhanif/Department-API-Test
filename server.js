const app = require("./app");
let port = 4500 || process.env.PORT;

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
