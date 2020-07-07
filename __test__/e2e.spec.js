const { after, expect: expectRequest, when } = require("../index");

describe("End to end tests", () => {
  it("should fetch todo after post", async () => {
    const result = await after("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: "a=1",
    })
      .expect("https://jsonplaceholder.typicode.com/todos/1")
      .toMatch({
        "$..userId": when.each.is.number,
        "$..title": when.each.is.string,
        "$..id": when.each.is.greaterThan(0),
      });

    expect(result.isMatch).toBe(true);
  });

  it("should fetch todo", async () => {
    const result = await expectRequest("https://jsonplaceholder.typicode.com/todos/1").toMatch({
      "$..userId": when.each.is.number,
      "$..title": when.each.is.string,
      "$..id": when.each.is.greaterThan(0),
    });

    expect(result.isMatch).toBe(true);
  });

  it("should pass on id", async () => {
    const result = await after(
      "https://jsonplaceholder.typicode.com/todos",
      {
        method: "POST",
        body: "a=1",
      },
      { passOn: "$..id", as: "NEW_ID" }
    )
      .expect("https://jsonplaceholder.typicode.com/todos/", { method: "post" })
      .toMatch({
        "$..id": when.each.is.number,
      });

    expect(result.isMatch).toBe(true);

    const result2 = await after(
      "https://jsonplaceholder.typicode.com/todos",
      {
        method: "POST",
        body: "a=1",
      },
      { passOn: "$..id", as: "NEW_ID" }
    )
      .expect("https://postman-echo.com/post", {
        method: "post",
        body: "a=NEW_ID",
      })
      .toMatch({
        "$..data": when.each.is.stringContaining("a=201"),
      });

    expect(result2.isMatch).toBe(true);
  });
});
