/**
 * Describes the type of a variable
 * @param {any} variable
 */
const describeType = (variable) => {
  if (variable === null) return "*null*";
  if (typeof variable === "number") {
    if (isNaN(variable)) return "*not a number (NaN)*";
    if (variable === Infinity || variable === -Infinity) return "*division by zero*";
  }
  if (typeof variable === "object") {
    if (Array.isArray(variable)) return "*array*";
    return "*object*";
  }

  return "*" + typeof variable + "*";
};

const showValue = (val) => {
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "object") return JSON.stringify(val);
  return val;
};

const matchersForPrimitives = {
  number: (comparisonValue) => ({
    isMatch:
      typeof comparisonValue === "number" &&
      !isNaN(comparisonValue) &&
      comparisonValue !== Infinity &&
      comparisonValue !== -Infinity,
    noMatchMessage: `Expected ${showValue(comparisonValue)} to be type: *number*. It was: ${describeType(
      comparisonValue
    )}`,
  }),
  string: (comparisonValue) => ({
    isMatch: typeof comparisonValue === "string",
    noMatchMessage: `Expected ${showValue(comparisonValue)} to be a *string*, but it was ${describeType(
      comparisonValue
    )}`,
  }),
  boolean: (comparisonValue) => ({
    isMatch: (isMatch = typeof comparisonValue === "boolean"),
    noMatchMessage: `Expected ${showValue(comparisonValue)} to be a *boolean*, but it was ${describeType(
      comparisonValue
    )}`,
  }),
  object: (comparisonValue) => ({
    isMatch: typeof comparisonValue === "object" && comparisonValue !== null,
    noMatchMessage: `Expected ${showValue(comparisonValue)} to be an *object*, but it was ${describeType(
      comparisonValue
    )}`,
  }),
  array: (comparisonValue) => ({
    isMatch: Array.isArray(comparisonValue),
    noMatchMessage: `Expected ${showValue(comparisonValue)} to be an *array*, but it was ${describeType(
      comparisonValue
    )}`,
  }),
  defined: (comparisonValue) => ({
    isMatch: typeof comparisonValue !== "undefined",
    noMatchMessage: `Expected ${showValue(comparisonValue)} to be *defined*, but it was *undefined*`,
  }),
  undefined: (comparisonValue) => ({
    isMatch: typeof comparisonValue === "undefined",
    noMatchMessage: `Expected ${showValue(comparisonValue)} to be *undefined*, but it was ${describeType(
      comparisonValue
    )}`,
  }),
  truthy: (comparisonValue) => ({
    isMatch: !!comparisonValue,
    noMatchMessage: `Expected ${showValue(comparisonValue)} to evaluate to *true*`,
  }),
  falsy: (comparisonValue) => ({
    isMatch: !comparisonValue,
    noMatchMessage: `Expected ${showValue(comparisonValue)} to evaluate to *false*`,
  }),
  nonEmptyString: (input) => ({
    isMatch: typeof input === "string" && input.length > 0,
    noMatchMessage: `Expected ${showValue(input)} to be a non-empty *string*, but it was ${describeType(input)}${
      input === null ? "" : " with a value of " + showValue(input)
    }`,
  }),
};

const matcherFactoriesForPrimitives = {
  stringContaining: (comparisonValue) => (input) => ({
    isMatch: typeof input === "string" && input.toLowerCase().indexOf(comparisonValue.toLowerCase()) !== -1,
    noMatchMessage: `Expected ${showValue(input)} to be a *string* containing ${showValue(
      comparisonValue
    )}, but it was ${describeType(input)}${input === null ? "" : " with a value of " + showValue(input)}`,
  }),
  greaterThan: (comparisonValue) => (n) => ({
    isMatch: typeof n === "number" && n > comparisonValue,
    noMatchMessage: `Expected ${showValue(n)} to be a *number* greater than ${comparisonValue}`,
  }),
  lessThan: (comparisonValue) => (n) => ({
    isMatch: typeof n === "number" && n < comparisonValue,
    noMatchMessage: `Expected ${showValue(n)} to be a *number* less than ${comparisonValue}`,
  }),

  greaterThanOrEqual: (comparisonValue) => (n) => ({
    isMatch: typeof n === "number" && n >= comparisonValue,
    noMatchMessage: `Expected ${showValue(n)} to be a *number* greater than or equal to ${comparisonValue}`,
  }),
  lessThanOrEqual: (comparisonValue) => (n) => ({
    isMatch: typeof n === "number" && n <= comparisonValue,
    noMatchMessage: `Expected ${showValue(n)} to be a *number* less than or equal to ${comparisonValue}`,
  }),
  /*any in list*/
  anyOf: (list) => (item) => ({
    isMatch: list.indexOf(item) !== -1,
    noMatchMessage: `Expected ${showValue(item)} to be any of: ${JSON.stringify(list)}`,
  }),
  /*not*/
  not: (comparisonValue) => (input) => ({
    isMatch: isNaN(comparisonValue) ? !isNaN(input) : input != comparisonValue,
    noMatchMessage: `Expected ${showValue(input)} to NOT be ${showValue(comparisonValue)}`,
  }),
  /*regex*/
  matchingRegex: (regex) => (text) => ({
    isMatch: new RegExp(regex).test(text),
    noMatchMessage: `Expected ${showValue(text)} to match the regex ${showValue(regex)}`,
  }),
};

const matcherFactoriesForArrays = {
  countEquals: (comparisonValue) => (input) => ({
    isMatch: Array.isArray(input) && input.length === comparisonValue,
    noMatchMessage: `Expected *array* of length ${comparisonValue}, got ${describeType(input)} of length ${
      input.length
    }`,
  }),
  countGreaterThan: (comparisonValue) => (input) => ({
    isMatch: Array.isArray(input) && input.length > comparisonValue,
    noMatchMessage: `Expected *array* of length > ${comparisonValue}, got ${describeType(input)} of length ${
      input.length
    }`,
  }),
  countGreaterThanOrEqual: (comparisonValue) => (input) => ({
    isMatch: Array.isArray(input) && input.length >= comparisonValue,
    noMatchMessage: `Expected *array* of length >= ${comparisonValue}, got ${describeType(input)} of length ${
      input.length
    }`,
  }),
  countLessThan: (comparisonValue) => (input) => ({
    isMatch: Array.isArray(input) && input.length < comparisonValue,
    noMatchMessage: `Expected *array* of length < ${comparisonValue}, got ${describeType(input)} of length ${
      input.length
    }`,
  }),
  countLessThanOrEqual: (comparisonValue) => (input) => ({
    isMatch: Array.isArray(input) && input.length <= comparisonValue,
    noMatchMessage: `Expected *array* of length <= ${comparisonValue}, got ${describeType(input)} of length ${
      input.length
    }`,
  }),
  has: (comparisonValue) => (input) => ({
    isMatch: input.indexOf(comparisonValue) !== -1,
    noMatchMessage: `Expected ${showValue(input)} to contain ${showValue(comparisonValue)}`,
  }),
  doesntHave: (comparisonValue) => (input) => ({
    isMatch: input.indexOf(comparisonValue) === -1,
    noMatchMessage: `Expected ${showValue(input)} to NOT contain ${showValue(comparisonValue)}`,
  }),
  eachItemHas: (propToCheck) => (input) => {
    let isMatch = true;
    for (const arr of input) {
      for (const item of arr) {
        if (Array.isArray(propToCheck)) {
          for (const property of propToCheck) {
            if (typeof item[property] === "undefined") {
              isMatch = false;
              break;
            }
          }
        } else {
          if (typeof item[propToCheck] === "undefined") {
            isMatch = false;
            break;
          }
        }
      }
    }

    return {
      isMatch,
      noMatchMessage: `Expected each item in ${showValue(input)} to NOT contain ${showValue(propToCheck)}`,
    };
  },
};

module.exports = { matchersForPrimitives, matcherFactoriesForPrimitives, matcherFactoriesForArrays };
