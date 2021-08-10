const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () => {
  console.info(`Server listen at ${port} ...`);
});
