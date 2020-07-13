const objectTester = require("../objectTester");
const matchers = require("../matchers");

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
  /*
return {
          path: pathWithoutQuotes,
          matcher: matcherFactory(tryParse(value.replace(alias, ""))),
          isArrayMatcher: false,
        };
     */
  it("should match something for each property", () => {
    const failedRules = objectTester(
      [
        { path: "$..category", matcher: matchers.matchersForPrimitives.string, isArrayMatcher: false },
        { path: "$..author", matcher: matchers.matchersForPrimitives.string, isArrayMatcher: false },
        { path: "$..price", matcher: matchers.matcherFactoriesForPrimitives.greaterThan(0), isArrayMatcher: false },
        { path: "$..isbn", matcher: matchers.matcherFactoriesForArrays.has("0-395-19395-8"), isArrayMatcher: true },
      ],
      bookStore
    );

    expect(failedRules.length).toBe(0);
  });

  it("should fail when string is not found", () => {
    const failedRules = objectTester(
      [
        { path: "$..category", matcher: matchers.matchersForPrimitives.string, isArrayMatcher: false },
        {
          path: "$..author",
          matcher: matchers.matcherFactoriesForPrimitives.stringContaining("JK Rolling"),
          isArrayMatcher: false,
        },
        { path: "$..price", matcher: matchers.matcherFactoriesForPrimitives.greaterThan(1), isArrayMatcher: false },
      ],
      bookStore
    );

    expect(failedRules.length).toBe(3);
  });

  it("should match literal values", () => {
    const failedRules = objectTester(
      [
        { path: "$..color", matcher: "red", isArrayMatcher: false },
        { path: "$..nothing", matcher: undefined, isArrayMatcher: false },
        { path: "$..nothing2", matcher: (a) => ({ isMatch: a === undefined }), isArrayMatcher: false },
        { path: "$..expensive", matcher: "10", isArrayMatcher: false },
      ],
      bookStore
    );

    expect(failedRules.length).toBe(2);
  });

  it("should fail when jsonpath not found", () => {
    const failedRules = objectTester([{ path: "$..nothing", matcher: "red" }], bookStore);

    expect(failedRules.length).toBe(1);
  });

  it("should check array values", () => {
    const failedRules = objectTester(
      [
        { path: "$..title", matcher: matchers.matcherFactoriesForArrays.has("John Smith"), isArrayMatcher: true },
        { path: "$..price", matcher: matchers.matcherFactoriesForArrays.has(8.95), isArrayMatcher: true },
        { path: "$..expensive", matcher: matchers.matcherFactoriesForArrays.doesntHave(8.95), isArrayMatcher: true },
      ],
      bookStore
    );

    expect(failedRules.length).toBe(1);
    expect(failedRules[0].path).toEqual("$..title");
  });

  it("should check if each item has a property", () => {
    const failedRules = objectTester(
      [{ path: "$..book", matcher: matchers.matcherFactoriesForArrays.eachItemHas("isbn"), isArrayMatcher: true }],
      bookStore
    );

    expect(failedRules.length).toBe(1);
    expect(failedRules[0].path).toEqual("$..book");

    const failedRules2 = objectTester(
      [{ path: "$..book", matcher: matchers.matcherFactoriesForArrays.eachItemHas("title"), isArrayMatcher: true }],
      bookStore
    );

    expect(failedRules2.length).toBe(0);
  });

  it("should check if each item has a list of properties", () => {
    const failedRules = objectTester(
      [
        {
          path: "$..book",
          matcher: matchers.matcherFactoriesForArrays.eachItemHas(["title", "isbn"]),
          isArrayMatcher: true,
        },
      ],
      bookStore
    );

    expect(failedRules.length).toBe(1);
    expect(failedRules[0].path).toEqual("$..book");

    const failedRules2 = objectTester(
      [
        {
          path: "$..book",
          matcher: matchers.matcherFactoriesForArrays.eachItemHas(["title", "author"]),
          isArrayMatcher: true,
        },
      ],
      bookStore
    );

    expect(failedRules2.length).toBe(0);
  });
});
