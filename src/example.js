const { after, expect, when } = require("./index");

const runTests = async () => {
  const result = await after("https://jsonplaceholder.typicode.com/todos", {
    method: "POST",
    body: "{userId:1,title:'hello'}",
  })
    .expect("https://jsonplaceholder.typicode.com/todos")
    .toMatch({
      "$..userId": when.each.is.number,
      "$..title": when.each.is.string,
      "$..id": when.each.is.greaterThanOrEqual(1),
    });
  console.log("should return todos:");
  console.log(result);

  const result2 = await expect("https://jsonplaceholder.typicode.com/todos").toMatch({
    "$..id": when.each.is.greaterThanOrEqual(1),
  });

  console.log("ids should start at 1");
  console.log(result2);

  const result3 = await expect("https://jsonplaceholder.typicode.com/todos/1").toMatch({ "$..title": "My title" });

  console.log("title should be My Title");
  console.log(result3);

  const result4 = await expect("https://jsonplaceholder.typicode.com/todos", {
    method: "GET",
    headers: {
      "Accept-Encoding": "gzip, deflate, sdch",
      "Accept-Language": "en-US,en;q=0.8,da;q=0.6",
      "Upgrade-Insecure-Requests": "1",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.110 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      Connection: "keep-alive",
    },
  }).toMatch({
    "$[*].userId": when.each.is.greaterThanOrEqual(1),
    "$[*].id": when.each.is.greaterThanOrEqual(1),
    "$[*].title": when.each.is.nonEmptyString,
    "$[*].completed": when.each.is.boolean,
  });

  console.log(result4);
};

runTests()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
  });
