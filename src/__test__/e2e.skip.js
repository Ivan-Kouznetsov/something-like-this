const matchers = require("../matchers");

const port = 3000;
const testServer = `http://localhost:${port}`;

describe("End to end tests", () => {
  const sampleText = "This is my post";

  it("should fetch and match a post", async () => {
    const result = await expectRequest(`${testServer}/posts/0`).toMatch({
      "$..text": when.each.is.string,
      "$..id": when.each.is.greaterThanOrEqual(0),
    });

    expect(result.isMatch).toBe(true);
  });

  it("should time requests", async () => {
    const result = await expectRequest(`${testServer}/posts/0`).toMatch({
      "$..text": when.each.is.string,
      "$..id": when.each.is.greaterThanOrEqual(0),
    });

    expect(result.isMatch).toBe(true);
    expect(result.duration).toBeGreaterThan(0);
    expect(result.timing.startOfRequest1).toBeGreaterThan(0);
    expect(result.timing.startOfRequest2).toBeGreaterThan(result.timing.startOfRequest1);
    expect(result.timing.startOfCheck).toBeGreaterThan(result.timing.startOfRequest2);
    expect(result.timing.endOfCheck).toBeGreaterThan(result.timing.startOfCheck);
  });

  it("should fetch and match a post after posting", async () => {
    const result = await after(`${testServer}/posts`, {
      method: "POST",
      body: sampleText,
    })
      .expect(`${testServer}/posts/0`)
      .toMatch({
        "$..text": when.each.is.string,
      });

    expect(result.isMatch).toBe(true);
  });

  it("should pass on id", async () => {
    const result = await after(
      `${testServer}/posts`,
      {
        method: "POST",
        body: sampleText,
      },
      { passOn: "$..id", as: "NEW_ID" }
    )
      .expect(`${testServer}/posts/NEW_ID`)
      .toMatch({
        "$..text": sampleText,
      });

    expect(result.isMatch).toBe(true);
  });

  it("should pass on id when posting a body", async () => {
    const result = await after(
      `${testServer}/posts`,
      {
        method: "POST",
        body: sampleText,
      },
      { passOn: "$..id", as: "NEW_ID" }
    )
      .expect(`${testServer}/mirror`, { method: "POST", body: "NEW_ID" })
      .toMatch({
        "$..requestBody": when.each.is.matchingRegex(/\d+/),
      });

    expect(result.isMatch).toBe(true);
  });
});
