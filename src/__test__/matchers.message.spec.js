const { when } = require("../matchers");

describe("Matchers tests", () => {
  it("should only match actual numbers", () => {
    expect(when.each.is.number(NaN).message).toEqual(
      "Expected NaN to be a Number, but it was a Not A Number (NaN)"
    );
    expect(when.each.is.number(1 / 0).message).toEqual(
      "Expected Infinity to be a Number, but it was a Division By Zero"
    );
    expect(when.each.is.number(-1 / 0).message).toEqual(
      "Expected -Infinity to be a Number, but it was a Division By Zero"
    );
    expect(when.each.is.number("12").message).toEqual(
      'Expected "12" to be a Number, but it was a String'
    );
    expect(when.each.is.number(null).message).toEqual(
      "Expected null to be a Number, but it was a null"
    );

    expect(when.each.is.number(10).message).toBeUndefined();
  });

  it("should correctly match numbers", () => {
    expect(when.each.is.greaterThan(10)(11).message).toBeUndefined();
    expect(when.each.is.lessThan(10)(9).message).toBeUndefined();
    expect(when.each.is.greaterThan(10)(9).message).toEqual(
      "Expected 9 to be a Number greater than 10"
    );
    expect(when.each.is.lessThan(10)(11).message).toEqual(
      "Expected 11 to be a Number less than 10"
    );

    expect(when.each.is.greaterThanOrEqual(10)(11).message).toBeUndefined();
    expect(when.each.is.lessThanOrEqual(10)(9).message).toBeUndefined();
    expect(when.each.is.greaterThanOrEqual(10)(9).message).toEqual(
      "Expected 9 to be a Number greater than or equal to 10"
    );
    expect(when.each.is.lessThanOrEqual(10)(11).message).toEqual(
      "Expected 11 to be a Number less than or equal to 10"
    );

    expect(when.each.is.greaterThanOrEqual(10)(10).message).toBeUndefined();
    expect(when.each.is.lessThanOrEqual(10)(10).message).toBeUndefined();
    expect(when.each.is.greaterThanOrEqual(10)(10).message).toBeUndefined();
    expect(when.each.is.lessThanOrEqual(10)(10).message).toBeUndefined();
  });

  it("should match correct types", () => {
    expect(when.each.is.boolean(false).message).toBeUndefined();
    expect(when.each.is.defined(1).message).toBeUndefined();
    expect(when.each.is.undefined().message).toBeUndefined();
    expect(when.each.is.object({}).message).toBeUndefined();
    expect(when.each.is.string("").message).toBeUndefined();

    expect(when.each.is.boolean("false").message).toEqual(
      'Expected "false" to be a Boolean, but it was a String'
    );

    expect(when.each.is.boolean({}).message).toEqual(
      "Expected {} to be a Boolean, but it was an Object"
    );

    expect(when.each.is.boolean([1, 2, 3]).message).toEqual(
      "Expected [1,2,3] to be a Boolean, but it was an Array"
    );

    expect(when.each.is.defined().message).toEqual(
      "Expected undefined to be defined, but it was undefined"
    );
    expect(when.each.is.undefined(1).message).toEqual(
      "Expected 1 to be undefined, but it was a Number"
    );
    expect(when.each.is.object("{}").message).toEqual(
      'Expected "{}" to be an Object, but it was a String'
    );
    expect(when.each.is.string(1).message).toEqual(
      "Expected 1 to be a String, but it was a Number"
    );
  });

  it("should match correct truthy and falsy values", () => {
    expect(when.each.is.falsy(0).message).toBeUndefined();
    expect(when.each.is.truthy(1).message).toBeUndefined();

    expect(when.each.is.falsy(1).message).toEqual(
      "Expected 1 to evaluate to false"
    );
    expect(when.each.is.truthy(0).message).toEqual(
      "Expected 0 to evaluate to true"
    );
  });

  it("should match using anyOf functions", () => {
    expect(when.each.is.anyOf([1, 2, 3])(2).message).toBeUndefined();
    expect(when.each.is.anyOf([1, 2, 3])(5).message).toEqual(
      "Expected 5 to be any of: [1,2,3]"
    );
  });

  it("should match arrays", () => {
    expect(when.each.is.array([]).message).toBeUndefined();
    expect(when.each.is.array("[]").message).toEqual(
      'Expected "[]" to be an Array, but it was a String'
    );
  });

  it("should not match null", () => {
    expect(when.each.is.number(null).message).toEqual(
      "Expected null to be a Number, but it was a null"
    );
    expect(when.each.is.anyOf([1, 2, 3])(null).message).toEqual(
      "Expected null to be any of: [1,2,3]"
    );
    expect(when.each.is.array(null).message).toEqual(
      "Expected null to be an Array, but it was a null"
    );
    expect(when.each.is.boolean(null).message).toEqual(
      "Expected null to be a Boolean, but it was a null"
    );
    expect(when.each.is.greaterThan(10)(null).message).toEqual(
      "Expected null to be a Number greater than 10"
    );
    expect(when.each.is.lessThan(10)(null).message).toEqual(
      "Expected null to be a Number less than 10"
    );
    expect(when.each.is.string(null).message).toEqual(
      "Expected null to be a String, but it was a null"
    );
    expect(when.each.is.stringContaining("hello")(null).message).toEqual(
      'Expected null to be a String containing "hello", but it was a null'
    );
    expect(when.each.is.truthy(null).message).toEqual(
      "Expected null to evaluate to true"
    );
  });

  it("should correctly match strings", () => {
    expect(when.each.is.nonEmptyString("hello").message).toBeUndefined();
    expect(when.each.is.nonEmptyString("").message).toEqual(
      'Expected "" to be a non-empty String, but it was a String with a value of ""'
    );
    expect(when.each.is.nonEmptyString(null).message).toEqual(
      "Expected null to be a non-empty String, but it was a null"
    );
    expect(when.each.is.stringContaining("hello")("hello world").isMatch).toBe(
      true
    );
  });

  it("should correctly match using not", () => {
    expect(when.each.is.not("")("not an empty string").message).toBeUndefined();
    expect(when.each.is.not("")("").message).toEqual(
      'Expected "" to NOT be ""'
    );
    expect(when.each.is.not(NaN)(NaN).message).toEqual(
      "Expected NaN to NOT be NaN"
    );
  });

  it("should correctly match number array", () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(when.array.has(1)(testArray).message).toBeUndefined();
    expect(when.array.has(10)(testArray).message).toEqual(
      "Expected [1,2,3,4,5] to contain 10"
    );

    expect(when.array.doesntHave(1)(testArray).message).toEqual(
      "Expected [1,2,3,4,5] to NOT contain 1"
    );
    expect(when.array.doesntHave(10)(testArray).message).toBeUndefined();
  });

  it("should correctly match using regex", () => {
    expect(when.each.is.matchingRegex("\\d+")("123").message).toBeUndefined();
    expect(when.each.is.matchingRegex("\\d+")("hello").message).toEqual(
      'Expected "hello" to match the regex "\\d+"'
    );
  });
});
