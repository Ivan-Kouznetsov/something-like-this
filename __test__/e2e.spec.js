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
    const result = await expectRequest(
      "https://jsonplaceholder.typicode.com/todos/1"
    ).toMatch({
      "$..userId": when.each.is.number,
      "$..title": when.each.is.string,
      "$..id": when.each.is.greaterThan(0),
    });

    expect(result.isMatch).toBe(true);
  });
});
