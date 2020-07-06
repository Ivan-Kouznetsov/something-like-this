const when = require("../matchers");

describe("Matchers tests", () => {
  it("should only match actual numbers", () => {
    expect(when.each.is.number(NaN)).toBe(false);
    expect(when.each.is.number(1 / 0)).toBe(false);
    expect(when.each.is.number(-1 / 0)).toBe(false);
    expect(when.each.is.number("12")).toBe(false);
    expect(when.each.is.number(null)).toBe(false);
    expect(when.each.is.number(10)).toBe(true);
  });

  it("should match correct types", () => {
    expect(when.each.is.number(10)).toBe(true);
    expect(when.each.is.anyOf([1, 2, 3])(2)).toBe(true);
    expect(when.each.is.array([])).toBe(true);
    expect(when.each.is.boolean(false)).toBe(true);
    expect(when.each.is.defined(1)).toBe(true);
    expect(when.each.is.falsy(0)).toBe(true);
    expect(when.each.is.greaterThan(10)(11)).toBe(true);
    expect(when.each.is.lessThan(10)(9)).toBe(true);
    expect(when.each.is.object({})).toBe(true);
    expect(when.each.is.string("")).toBe(true);
    expect(when.each.is.truthy(1)).toBe(true);
  });

  it("should not match null", () => {
    expect(when.each.is.number(null)).toBe(false);
    expect(when.each.is.anyOf([1, 2, 3])(null)).toBe(false);
    expect(when.each.is.array(null)).toBe(false);
    expect(when.each.is.boolean(null)).toBe(false);
    expect(when.each.is.greaterThan(10)(null)).toBe(false);
    expect(when.each.is.lessThan(10)(null)).toBe(false);
    expect(when.each.is.string(null)).toBe(false);
    expect(when.each.is.stringContaining("hello")(null)).toBe(false);
    expect(when.each.is.truthy(null)).toBe(false);
  });

  it("should correctly match strings", () => {
    expect(when.each.is.nonEmptyString("hello")).toBe(true);
    expect(when.each.is.nonEmptyString("")).toBe(false);
    expect(when.each.is.nonEmptyString(null)).toBe(false);
    expect(when.each.is.stringContaining("hello")("hello world")).toBe(true);
  });

  it("should correctly match using not", () => {
    expect(when.each.is.not("")("not an empty string")).toBe(true);
    expect(when.each.is.not("")("")).toBe(false);
    expect(when.each.is.not(NaN)(NaN)).toBe(false);
  });

  it("should correctly match number array", () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(when.array.has(1)(testArray)).toBe(true);
    expect(when.array.has(10)(testArray)).toBe(false);

    expect(when.array.doesntHave(1)(testArray)).toBe(false);
    expect(when.array.doesntHave(10)(testArray)).toBe(true);

    expect(when.array.largestNumberIs(5)(testArray)).toBe(true);
    expect(when.array.largestNumberIs(10)(testArray)).toBe(false);
    expect(when.array.largestNumberIs(1)(testArray)).toBe(false);

    expect(when.array.smallestNumberIs(5)(testArray)).toBe(false);
    expect(when.array.smallestNumberIs(10)(testArray)).toBe(false);
    expect(when.array.smallestNumberIs(0)(testArray)).toBe(false);
    expect(when.array.smallestNumberIs(1)(testArray)).toBe(true);
  });

  it("should correctly match using regex", () => {
    expect(when.each.is.matchingRegex("\\d+")("123")).toBe(true);
    expect(when.each.is.matchingRegex("\\d+")("hello")).toBe(false);
  });
});
