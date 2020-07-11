const matchers = require("../matchers");

describe("Matchers tests", () => {
  it("should only match actual numbers", () => {
    expect(matchers.matchersForPrimitives.number(NaN).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.number(1 / 0).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.number(-1 / 0).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.number("12").isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.number(null).isMatch).toBe(false);

    expect(matchers.matchersForPrimitives.number(10).isMatch).toBe(true);
  });

  it("should correctly match numbers", () => {
    expect(matchers.matcherFactoriesForPrimitives.greaterThan(10)(11).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.lessThan(10)(9).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.greaterThan(10)(9).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.lessThan(10)(11).isMatch).toBe(false);

    expect(matchers.matcherFactoriesForPrimitives.greaterThanOrEqual(10)(11).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.lessThanOrEqual(10)(9).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.greaterThanOrEqual(10)(9).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.lessThanOrEqual(10)(11).isMatch).toBe(false);

    expect(matchers.matcherFactoriesForPrimitives.greaterThanOrEqual(10)(10).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.lessThanOrEqual(10)(10).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.greaterThanOrEqual(10)(10).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.lessThanOrEqual(10)(10).isMatch).toBe(true);
  });

  it("should match correct types", () => {
    expect(matchers.matchersForPrimitives.boolean(false).isMatch).toBe(true);
    expect(matchers.matchersForPrimitives.defined(1).isMatch).toBe(true);
    expect(matchers.matchersForPrimitives.undefined().isMatch).toBe(true);
    expect(matchers.matchersForPrimitives.object({}).isMatch).toBe(true);
    expect(matchers.matchersForPrimitives.string("").isMatch).toBe(true);

    expect(matchers.matchersForPrimitives.boolean("false").isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.defined().isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.undefined(1).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.object("{}").isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.string(1).isMatch).toBe(false);
  });

  it("should match correct truthy and falsy values", () => {
    expect(matchers.matchersForPrimitives.falsy(0).isMatch).toBe(true);
    expect(matchers.matchersForPrimitives.truthy(1).isMatch).toBe(true);

    expect(matchers.matchersForPrimitives.falsy(1).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.truthy(0).isMatch).toBe(false);
  });

  it("should match using anyOf functions", () => {
    expect(matchers.matcherFactoriesForPrimitives.anyOf([1, 2, 3])(2).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.anyOf([1, 2, 3])(5).isMatch).toBe(false);
  });

  it("should match arrays", () => {
    expect(matchers.matchersForPrimitives.array([]).isMatch).toBe(true);
    expect(matchers.matchersForPrimitives.array("[]").isMatch).toBe(false);
  });

  it("should not match null", () => {
    expect(matchers.matchersForPrimitives.number(null).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.anyOf([1, 2, 3])(null).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.array(null).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.boolean(null).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.greaterThan(10)(null).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.lessThan(10)(null).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.string(null).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.stringContaining("hello")(null).isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.truthy(null).isMatch).toBe(false);
  });

  it("should correctly match strings", () => {
    expect(matchers.matchersForPrimitives.nonEmptyString("hello").isMatch).toBe(true);
    expect(matchers.matchersForPrimitives.nonEmptyString("").isMatch).toBe(false);
    expect(matchers.matchersForPrimitives.nonEmptyString(null).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.stringContaining("hello")("hello world").isMatch).toBe(true);
  });

  it("should correctly match using not", () => {
    expect(matchers.matcherFactoriesForPrimitives.not("")("not an empty string").isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.not("")("").isMatch).toBe(false);
    expect(matchers.matcherFactoriesForPrimitives.not(NaN)(NaN).isMatch).toBe(false);
  });

  it("should correctly match number array", () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(matchers.matcherFactoriesForArrays.has(1)(testArray).isMatch).toBe(true);
    expect(matchers.matcherFactoriesForArrays.has(10)(testArray).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForArrays.doesntHave(1)(testArray).isMatch).toBe(false);
    expect(matchers.matcherFactoriesForArrays.doesntHave(10)(testArray).isMatch).toBe(true);
  });

  it("should correctly match using regex", () => {
    expect(matchers.matcherFactoriesForPrimitives.matchingRegex("\\d+")("123").isMatch).toBe(true);
    expect(matchers.matcherFactoriesForPrimitives.matchingRegex("\\d+")("hello").isMatch).toBe(false);
  });
});
