const { when } = require("../matchers");

describe("Matchers tests", () => {
  it("should only match actual numbers", () => {
    expect(when.each.is.number(NaN).isMatch).toBe(false);
    expect(when.each.is.number(1 / 0).isMatch).toBe(false);
    expect(when.each.is.number(-1 / 0).isMatch).toBe(false);
    expect(when.each.is.number("12").isMatch).toBe(false);
    expect(when.each.is.number(null).isMatch).toBe(false);

    expect(when.each.is.number(10).isMatch).toBe(true);
  });

  it("should correctly match numbers", () => {
    expect(when.each.is.greaterThan(10)(11).isMatch).toBe(true);
    expect(when.each.is.lessThan(10)(9).isMatch).toBe(true);
    expect(when.each.is.greaterThan(10)(9).isMatch).toBe(false);
    expect(when.each.is.lessThan(10)(11).isMatch).toBe(false);

    expect(when.each.is.greaterThanOrEqual(10)(11).isMatch).toBe(true);
    expect(when.each.is.lessThanOrEqual(10)(9).isMatch).toBe(true);
    expect(when.each.is.greaterThanOrEqual(10)(9).isMatch).toBe(false);
    expect(when.each.is.lessThanOrEqual(10)(11).isMatch).toBe(false);

    expect(when.each.is.greaterThanOrEqual(10)(10).isMatch).toBe(true);
    expect(when.each.is.lessThanOrEqual(10)(10).isMatch).toBe(true);
    expect(when.each.is.greaterThanOrEqual(10)(10).isMatch).toBe(true);
    expect(when.each.is.lessThanOrEqual(10)(10).isMatch).toBe(true);
  });

  it("should match correct types", () => {
    expect(when.each.is.boolean(false).isMatch).toBe(true);
    expect(when.each.is.defined(1).isMatch).toBe(true);
    expect(when.each.is.undefined().isMatch).toBe(true);
    expect(when.each.is.object({}).isMatch).toBe(true);
    expect(when.each.is.string("").isMatch).toBe(true);

    expect(when.each.is.boolean("false").isMatch).toBe(false);
    expect(when.each.is.defined().isMatch).toBe(false);
    expect(when.each.is.undefined(1).isMatch).toBe(false);
    expect(when.each.is.object("{}").isMatch).toBe(false);
    expect(when.each.is.string(1).isMatch).toBe(false);
  });

  it("should match correct truthy and falsy values", () => {
    expect(when.each.is.falsy(0).isMatch).toBe(true);
    expect(when.each.is.truthy(1).isMatch).toBe(true);

    expect(when.each.is.falsy(1).isMatch).toBe(false);
    expect(when.each.is.truthy(0).isMatch).toBe(false);
  });

  it("should match using anyOf functions", () => {
    expect(when.each.is.anyOf([1, 2, 3])(2).isMatch).toBe(true);
    expect(when.each.is.anyOf([1, 2, 3])(5).isMatch).toBe(false);
  });

  it("should match arrays", () => {
    expect(when.each.is.array([]).isMatch).toBe(true);
    expect(when.each.is.array("[]").isMatch).toBe(false);
  });

  it("should not match null", () => {
    expect(when.each.is.number(null).isMatch).toBe(false);
    expect(when.each.is.anyOf([1, 2, 3])(null).isMatch).toBe(false);
    expect(when.each.is.array(null).isMatch).toBe(false);
    expect(when.each.is.boolean(null).isMatch).toBe(false);
    expect(when.each.is.greaterThan(10)(null).isMatch).toBe(false);
    expect(when.each.is.lessThan(10)(null).isMatch).toBe(false);
    expect(when.each.is.string(null).isMatch).toBe(false);
    expect(when.each.is.stringContaining("hello")(null).isMatch).toBe(false);
    expect(when.each.is.truthy(null).isMatch).toBe(false);
  });

  it("should correctly match strings", () => {
    expect(when.each.is.nonEmptyString("hello").isMatch).toBe(true);
    expect(when.each.is.nonEmptyString("").isMatch).toBe(false);
    expect(when.each.is.nonEmptyString(null).isMatch).toBe(false);
    expect(when.each.is.stringContaining("hello")("hello world").isMatch).toBe(true);
  });

  it("should correctly match using not", () => {
    expect(when.each.is.not("")("not an empty string").isMatch).toBe(true);
    expect(when.each.is.not("")("").isMatch).toBe(false);
    expect(when.each.is.not(NaN)(NaN).isMatch).toBe(false);
  });

  it("should correctly match number array", () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(when.array.has(1)(testArray).isMatch).toBe(true);
    expect(when.array.has(10)(testArray).isMatch).toBe(false);

    expect(when.array.doesntHave(1)(testArray).isMatch).toBe(false);
    expect(when.array.doesntHave(10)(testArray).isMatch).toBe(true);
  });

  it("should correctly match using regex", () => {
    expect(when.each.is.matchingRegex("\\d+")("123").isMatch).toBe(true);
    expect(when.each.is.matchingRegex("\\d+")("hello").isMatch).toBe(false);
  });
});
