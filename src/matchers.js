const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Describes the type of a variable
 * @param {any} variable
 */
const describeType = (variable) => {
  if (variable === null) return "null";
  if (typeof variable === "number") {
    if (isNaN(variable)) return "Not A Number (NaN)";
    if (variable === Infinity || variable === -Infinity)
      return "Division By Zero";
  }
  if (typeof variable === "object") {
    if (Array.isArray(variable)) return "Array";
    return "Object";
  }

  return capitalizeFirstLetter(typeof variable);
};

/**
 * Prepends an article to a type name or description
 * @param {string} typeName
 */
const describeTypeWithAnArticle = (variable) => {
  const typeName = describeType(variable);
  const vowels = ["a", "e", "i", "o", "u"];
  const firstLetter = typeName.substring(0, 1).toLowerCase();
  const article = vowels.includes(firstLetter) ? "an" : "a";
  return `${article} ${typeName}`;
};

const showValue = (val) => {
  if (typeof val === "string") return `"${val}"`;
  if (typeof val === "object") return JSON.stringify(val);
  return val;
};

const when = {
  each: {
    is: {
      /*types*/
      number: (comparisonValue) => {
        const isMatch =
          typeof comparisonValue === "number" &&
          !isNaN(comparisonValue) &&
          comparisonValue != Infinity &&
          comparisonValue != -Infinity;

        let typeDescription = typeof comparisonValue;
        if (isNaN(comparisonValue)) {
          typeDescription;
        }
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                comparisonValue
              )} to be a Number, but it was ${describeTypeWithAnArticle(
                comparisonValue
              )}`,
        };
      },
      string: (comparisonValue) => {
        const isMatch = typeof comparisonValue === "string";
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                comparisonValue
              )} to be a String, but it was ${describeTypeWithAnArticle(
                comparisonValue
              )}`,
        };
      },
      boolean: (comparisonValue) => {
        const isMatch = typeof comparisonValue === "boolean";
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                comparisonValue
              )} to be a Boolean, but it was ${describeTypeWithAnArticle(
                comparisonValue
              )}`,
        };
      },
      object: (comparisonValue) => {
        const isMatch =
          typeof comparisonValue === "object" && comparisonValue !== null;
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                comparisonValue
              )} to be an Object, but it was ${describeTypeWithAnArticle(
                comparisonValue
              )}`,
        };
      },
      array: (comparisonValue) => {
        const isMatch = Array.isArray(comparisonValue);
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                comparisonValue
              )} to be an Array, but it was ${describeTypeWithAnArticle(
                comparisonValue
              )}`,
        };
      },
      /*defined*/
      defined: (comparisonValue) => {
        const isMatch = typeof comparisonValue !== "undefined";
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                comparisonValue
              )} to be defined, but it was undefined`,
        };
      },
      undefined: (comparisonValue) => {
        const isMatch = typeof comparisonValue === "undefined";
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                comparisonValue
              )} to be undefined, but it was ${describeTypeWithAnArticle(
                comparisonValue
              )}`,
        };
      },
      /*true/false*/
      truthy: (comparisonValue) => {
        const isMatch = !!comparisonValue;
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(comparisonValue)} to evaluate to true`,
        };
      },
      falsy: (comparisonValue) => {
        const isMatch = !comparisonValue;
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(comparisonValue)} to evaluate to false`,
        };
      },
      /*strings*/
      stringContaining: (comparisonValue) => {
        return (input) => {
          const isMatch =
            typeof input === "string" &&
            input.toLowerCase().indexOf(comparisonValue.toLowerCase()) !== -1;

          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(
                  input
                )} to be a String containing ${showValue(
                  comparisonValue
                )}, but it was ${describeTypeWithAnArticle(input)}${
                  input === null ? "" : " with a value of " + showValue(input)
                }`,
          };
        };
      },
      nonEmptyString: (input) => {
        const isMatch = typeof input === "string" && input.length > 0;

        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(
                input
              )} to be a non-empty String, but it was ${describeTypeWithAnArticle(
                input
              )}${
                input === null ? "" : " with a value of " + showValue(input)
              }`,
        };
      },
      /*number factories*/
      greaterThan: (comparisonValue) => {
        return (n) => {
          const isMatch = typeof n === "number" && n > comparisonValue;

          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(
                  n
                )} to be a Number greater than ${comparisonValue}`,
          };
        };
      },
      lessThan: (comparisonValue) => {
        return (n) => {
          const isMatch = typeof n === "number" && n < comparisonValue;

          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(
                  n
                )} to be a Number less than ${comparisonValue}`,
          };
        };
      },
      greaterThanOrEqual: (comparisonValue) => {
        return (n) => {
          const isMatch = typeof n === "number" && n >= comparisonValue;

          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(
                  n
                )} to be a Number greater than or equal to ${comparisonValue}`,
          };
        };
      },
      lessThanOrEqual: (comparisonValue) => {
        return (n) => {
          const isMatch = typeof n === "number" && n <= comparisonValue;

          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(
                  n
                )} to be a Number less than or equal to ${comparisonValue}`,
          };
        };
      },
      /*any in list*/
      anyOf: (list) => {
        return (item) => {
          const isMatch = list.indexOf(item) !== -1;
          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(item)} to be any of: ${JSON.stringify(
                  list
                )}`,
          };
        };
      },
      /*not*/
      not: (comparisonValue) => {
        return (input) => {
          const isMatch = isNaN(comparisonValue)
            ? !isNaN(input)
            : input != comparisonValue;

          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(input)} to NOT be ${showValue(
                  comparisonValue
                )}`,
          };
        };
      },
      /*regex*/
      matchingRegex: (regex) => {
        return (text) => {
          const isMatch = new RegExp(regex).test(text);

          return {
            isMatch,
            message: isMatch
              ? undefined
              : `Expected ${showValue(text)} to match the regex ${showValue(
                  regex
                )}`,
          };
        };
      },
    },
  },
  array: {
    has: (comparisonValue) => {
      const has = (input) => {
        const isMatch = input.indexOf(comparisonValue) !== -1;
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(input)} to contain ${showValue(
                comparisonValue
              )}`,
        };
      };
      has["isForArrays"] = true;
      return has;
    },
    doesntHave: (comparisonValue) => {
      const doesntHave = (input) => {
        const isMatch = input.indexOf(comparisonValue) === -1;
        return {
          isMatch,
          message: isMatch
            ? undefined
            : `Expected ${showValue(input)} to NOT contain ${showValue(
                comparisonValue
              )}`,
        };
      };
      doesntHave["isForArrays"] = true;
      return doesntHave;
    },
    each: {
      has: (propToCheck) => {
        const has = (input) => {
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
            message: isMatch
              ? undefined
              : `Expected each item in ${showValue(
                  input
                )} to NOT contain ${showValue(propToCheck)}`,
          };
        };
        has["isForArrays"] = true;
        return has;
      },
    },
  },
};

module.exports = { when };
