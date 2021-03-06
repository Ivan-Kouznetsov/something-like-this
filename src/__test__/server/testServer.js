const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.raw({ type: "*/*" }));

const port = 3000;

let posts = ["0th Post"];

app.get("/posts/:id", (request, response) => {
  const id = parseInt(request.params["id"]);

  if (typeof posts[id] !== "undefined") {
    response.send(JSON.stringify({ id, text: posts[id] })).end();
  } else {
    response.status(404).send("Not Found").end();
  }
});

app.post("/posts", (request, response) => {
  console.log(request.body.toString());
  posts.push(request.body.toString());

  response.send(JSON.stringify({ id: posts.length - 1, success: true }));
});

app.post("/mirror", (request, response) => {
  response.send(JSON.stringify({ requestBody: request.body.toString() }));
});

app.listen(port, (err) => {
  if (err) {
    console.error("Error:", err);
  }
  console.log(`listening on port ${port}`);
});
