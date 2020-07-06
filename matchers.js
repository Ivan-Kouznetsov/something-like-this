module.exports = {
  each: {
    is: {
      /*types*/
      number: (comparisonValue) => {
        return (
          typeof comparisonValue === "number" &&
          !isNaN(comparisonValue) &&
          comparisonValue != Infinity &&
          comparisonValue != -Infinity
        );
      },
      string: (comparisonValue) => {
        return typeof comparisonValue === "string";
      },
      boolean: (comparisonValue) => {
        return typeof comparisonValue === "boolean";
      },
      object: (comparisonValue) => {
        return typeof comparisonValue === "object" && comparisonValue !== null;
      },
      array: (comparisonValue) => {
        return Array.isArray(comparisonValue);
      },
      /*defined*/
      defined: (comparisonValue) => {
        return typeof comparisonValue !== "undefined";
      },
      undefined: undefined,
      /*true/false*/
      truthy: (comparisonValue) => {
        return !!comparisonValue;
      },
      falsy: (comparisonValue) => {
        return !comparisonValue;
      },
      /*strings*/
      stringContaining: (comparisonValue) => {
        return (input) => {
          return (
            typeof input === "string" &&
            input.toLowerCase().indexOf(comparisonValue.toLowerCase()) !== -1
          );
        };
      },
      nonEmptyString: (input) => {
        return typeof input === "string" && input.length > 0;
      },
      /*numbers*/
      greaterThan: (comparisonValue) => {
        return (n) => {
          return typeof n === "number" && n > comparisonValue;
        };
      },
      lessThan: (comparisonValue) => {
        return (n) => {
          return typeof n === "number" && n < comparisonValue;
        };
      },
      greaterThanOrEqual: (comparisonValue) => {
        return (n) => {
          return typeof n === "number" && n >= comparisonValue;
        };
      },
      lessThanOrEqual: (comparisonValue) => {
        return (n) => {
          return typeof n === "number" && n <= comparisonValue;
        };
      },
      /*any in list*/
      anyOf: (list) => {
        return (item) => {
          return list.indexOf(item) !== -1;
        };
      },
      /*not*/
      not: (comparisonValue) => {
        return (input) => {
          if (isNaN(comparisonValue)) return !isNaN(input);
          return input != comparisonValue;
        };
      },
      /*regex*/
      matchingRegex: (regex) => {
        return (text) => {
          return new RegExp(regex).test(text);
        };
      },
    },
  },
  array: {
    smallestNumberIs: (minNumber) => {
      function checkMin(numList) {
        for (const n of numList) {
          if (n < minNumber) return false;
        }
        return numList.indexOf(minNumber) !== -1;
      }
      checkMin["isForArrays"] = true;
      return checkMin;
    },
    largestNumberIs: (maxNumber) => {
      function checkMax(numList) {
        for (const n of numList) {
          if (n > maxNumber) return false;
        }
        return numList.indexOf(maxNumber) !== -1;
      }
      checkMax["isForArrays"] = true;
      return checkMax;
    },
    has: (comparisonValue) => {
      function contains(input) {
        return input.indexOf(comparisonValue) !== -1;
      }
      contains["isForArrays"] = true;
      return contains;
    },
    doesntHave: (comparisonValue) => {
      function contains(input) {
        return input.indexOf(comparisonValue) === -1;
      }
      contains["isForArrays"] = true;
      return contains;
    },
  },
};
