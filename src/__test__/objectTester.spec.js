const objectTester = require("../objectTester");
const { when } = require("../matchers");

describe("objectTester tests", () => {
  const bookStore = {
    store: {
      book: [
        {
          category: "reference",
          author: "Nigel Rees",
          title: "Sayings of the Century",
          price: 8.95,
        },
        {
          category: "fiction",
          author: "Herman Melville",
          title: "Moby Dick",
          isbn: "0-553-21311-3",
          price: 8.99,
        },
        {
          category: "fiction",
          author: "J.R.R. Tolkien",
          title: "The Lord of the Rings",
          isbn: "0-395-19395-8",
          price: 22.99,
        },
      ],
      bicycle: {
        color: "red",
        price: 19.95,
      },
    },
    expensive: 10,
  };

  it("should match something for each property", () => {
    const failedRules = objectTester(
      {
        "$..category": when.each.is.string,
        "$..author": when.each.is.string,
        "$..price": when.each.is.greaterThan(0),
        "$..isbn": when.array.has("0-395-19395-8"),
      },
      bookStore
    );

    expect(failedRules.length).toBe(0);
  });

  it("should fail when string is not found", () => {
    const failedRules = objectTester(
      {
        "$..category": when.each.is.string,
        "$..author": when.each.is.stringContaining("JK Rolling"),
        "$..price": when.each.is.greaterThan(1),
      },
      bookStore
    );

    expect(failedRules.length).toBe(3);
  });

  it("should match literal values", () => {
    const failedRules = objectTester(
      {
        "$..color": "red",
        "$..nothing": undefined,
        "$..nothing2": (a) => {
          return a === undefined;
        },
        "$..expensive": "10",
      },
      bookStore
    );

    expect(failedRules.length).toBe(1);
  });

  it("should fail when jsonpath not found", () => {
    const failedRules = objectTester(
      {
        "$..nothing": "red",
      },
      bookStore
    );

    expect(failedRules.length).toBe(1);
  });

  it("should check array values", () => {
    const failedRules = objectTester(
      {
        "$..title": when.array.has("John Smith"),
        "$..price": when.array.has(8.95),
        "$..expensive": when.array.doesntHave(8.95),
      },
      bookStore
    );

    expect(failedRules.length).toBe(1);
    expect(failedRules[0].path).toEqual("$..title");
  });

  it("should check if each item has a property", () => {
    const failedRules = objectTester(
      {
        "$..book": when.array.each.has("isbn"),
      },
      bookStore
    );

    expect(failedRules.length).toBe(1);
    expect(failedRules[0].path).toEqual("$..book");

    const failedRules2 = objectTester(
      {
        "$..book": when.array.each.has("title"),
      },
      bookStore
    );

    expect(failedRules2.length).toBe(0);
  });
});
