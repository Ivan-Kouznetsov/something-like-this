const matchers = require("../matchers");

describe("Matchers tests", () => {
  it("should return correct no match messages for non numbers", () => {
    expect(matchers.matchersForPrimitives.number(NaN).noMatchMessage).toEqual(
      "Expected NaN to be type: *number*. It was: *not a number (NaN)*"
    );
    expect(matchers.matchersForPrimitives.number(1 / 0).noMatchMessage).toEqual(
      "Expected Infinity to be type: *number*. It was: *division by zero*"
    );
    expect(matchers.matchersForPrimitives.number(-1 / 0).noMatchMessage).toEqual(
      "Expected -Infinity to be type: *number*. It was: *division by zero*"
    );
    expect(matchers.matchersForPrimitives.number("12").noMatchMessage).toEqual(
      'Expected "12" to be type: *number*. It was: *string*'
    );
    expect(matchers.matchersForPrimitives.number(null).noMatchMessage).toEqual(
      "Expected null to be type: *number*. It was: *null*"
    );
  });

  it("should return correct no match messages from number factories", () => {
    expect(matchers.matcherFactoriesForPrimitives.greaterThan(10)(9).noMatchMessage).toEqual(
      "Expected 9 to be a *number* greater than 10"
    );
    expect(matchers.matcherFactoriesForPrimitives.lessThan(10)(11).noMatchMessage).toEqual(
      "Expected 11 to be a *number* less than 10"
    );

    expect(matchers.matcherFactoriesForPrimitives.greaterThanOrEqual(10)(null).noMatchMessage).toEqual(
      "Expected null to be a *number* greater than or equal to 10"
    );
    expect(matchers.matcherFactoriesForPrimitives.lessThanOrEqual(10)(null).noMatchMessage).toEqual(
      "Expected null to be a *number* less than or equal to 10"
    );

    expect(matchers.matcherFactoriesForPrimitives.greaterThanOrEqual(10)("10").noMatchMessage).toEqual(
      'Expected "10" to be a *number* greater than or equal to 10'
    );
    expect(matchers.matcherFactoriesForPrimitives.lessThanOrEqual(10)("10").noMatchMessage).toEqual(
      'Expected "10" to be a *number* less than or equal to 10'
    );
  });

  it("should return correct no match messages from type matchers", () => {
    expect(matchers.matchersForPrimitives.boolean("false").noMatchMessage).toEqual(
      'Expected "false" to be a *boolean*, but it was *string*'
    );
    expect(matchers.matchersForPrimitives.object("{}").noMatchMessage).toEqual(
      'Expected "{}" to be an *object*, but it was *string*'
    );
    expect(matchers.matchersForPrimitives.string(1).noMatchMessage).toEqual(
      "Expected 1 to be a *string*, but it was *number*"
    );
    expect(matchers.matchersForPrimitives.array("[]").noMatchMessage).toEqual(
      'Expected "[]" to be an *array*, but it was *string*'
    );
  });

  it("should return correct no match messages from truthy and falsy matchers", () => {
    expect(matchers.matchersForPrimitives.falsy(1).noMatchMessage).toEqual("Expected 1 to evaluate to *false*");
    expect(matchers.matchersForPrimitives.truthy(0).noMatchMessage).toEqual("Expected 0 to evaluate to *true*");
  });

  it("should return correct no match messages from anyOf matchers", () => {
    expect(matchers.matcherFactoriesForPrimitives.anyOf([1, 2, 3])(2).noMatchMessage).toEqual(
      "Expected 2 to be any of: [1,2,3]"
    );
    expect(matchers.matcherFactoriesForPrimitives.anyOf([1, 2, 3])(5).noMatchMessage).toEqual(
      "Expected 5 to be any of: [1,2,3]"
    );
  });

  it("should return correct no match messages when null is passed to matchers", () => {
    expect(matchers.matchersForPrimitives.number(null).noMatchMessage).toEqual(
      "Expected null to be type: *number*. It was: *null*"
    );
    expect(matchers.matcherFactoriesForPrimitives.anyOf([1, 2, 3])(null).noMatchMessage).toEqual(
      "Expected null to be any of: [1,2,3]"
    );
    expect(matchers.matchersForPrimitives.array(null).noMatchMessage).toEqual(
      "Expected null to be an *array*, but it was *null*"
    );
    expect(matchers.matchersForPrimitives.boolean(null).noMatchMessage).toEqual(
      "Expected null to be a *boolean*, but it was *null*"
    );
    expect(matchers.matcherFactoriesForPrimitives.greaterThan(10)(null).noMatchMessage).toEqual(
      "Expected null to be a *number* greater than 10"
    );
    expect(matchers.matcherFactoriesForPrimitives.lessThan(10)(null).noMatchMessage).toEqual(
      "Expected null to be a *number* less than 10"
    );
    expect(matchers.matchersForPrimitives.string(null).noMatchMessage).toEqual(
      "Expected null to be a *string*, but it was *null*"
    );
    expect(matchers.matcherFactoriesForPrimitives.stringContaining("hello")(null).noMatchMessage).toEqual(
      'Expected null to be a *string* containing "hello", but it was *null*'
    );
    expect(matchers.matchersForPrimitives.truthy(null).noMatchMessage).toEqual("Expected null to evaluate to *true*");
  });

  it("should return correct no match messages when string does not contain argument", () => {
    expect(matchers.matchersForPrimitives.nonEmptyString("hello").noMatchMessage).toEqual(
      'Expected "hello" to be a non-empty *string*, but it was *string* with a value of "hello"'
    );
    expect(matchers.matchersForPrimitives.nonEmptyString("").noMatchMessage).toEqual(
      'Expected "" to be a non-empty *string*, but it was *string* with a value of ""'
    );
    expect(matchers.matchersForPrimitives.nonEmptyString(null).noMatchMessage).toEqual(
      "Expected null to be a non-empty *string*, but it was *null*"
    );
  });

  it("should return correct no match messages using not", () => {
    expect(matchers.matcherFactoriesForPrimitives.not("")("").noMatchMessage).toEqual('Expected "" to NOT be ""');
    expect(matchers.matcherFactoriesForPrimitives.not(NaN)(NaN).noMatchMessage).toEqual("Expected NaN to NOT be NaN");
  });

  it("should return correct no match messages when checking number arrays", () => {
    const testArray = [1, 2, 3, 4, 5];
    expect(matchers.matcherFactoriesForArrays.has(10)(testArray).noMatchMessage).toEqual(
      "Expected [1,2,3,4,5] to contain 10"
    );
    expect(matchers.matcherFactoriesForArrays.doesntHave(1)(testArray).noMatchMessage).toEqual(
      "Expected [1,2,3,4,5] to NOT contain 1"
    );
  });

  it("should return correct no match messages when matching using regex", () => {
    expect(matchers.matcherFactoriesForPrimitives.matchingRegex("\\d+")("hello").noMatchMessage).toEqual(
      'Expected "hello" to match the regex "\\d+"'
    );
  });
});
