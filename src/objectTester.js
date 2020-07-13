"strict mode";
const jsonpath = require("jsonpath");
/**
 *  return {
          path: pathWithoutQuotes,
          matcher,
          isArrayMatcher: false,Where 
        };
 */

const makeSimpleArray = (arr) => {
  if (!Array.isArray(arr)) return [arr];
  if (arr.length === 1) return makeSimpleArray(arr[0]);
  return arr;
};

/**
 *
 * @param {[{path:string, matcher: function, isArrayMatcher:boolean }]} jsonRuleSet
 * @param {object} obj
 */
const testObject = (jsonRuleSet, obj) => {
  const failedRules = [];
  for (const rule of jsonRuleSet) {
    const values = jsonpath.query(obj, rule.path);
    if (typeof rule.matcher === "function") {
      if (rule.isArrayMatcher) {
        const check = rule.matcher(makeSimpleArray(values));
        if (!check.isMatch) {
          failedRules.push({ path: rule.path, message: check.noMatchMessage });
        }
      } else {
        for (const value of values) {
          const check = rule.matcher(value);
          if (!check.isMatch) {
            failedRules.push({ path: rule.path, message: check.noMatchMessage });
          }
        }
      }
    } else if (values.length !== 1 || values[0] !== rule.matcher) {
      failedRules.push({
        path: rule.path,
        message: `Expected ${typeof rule.matcher} ${rule.matcher}, got ${typeof values[0]}:  ${
          values.length === 1 ? values[0] : "s " + values
        }`,
      });
    }
  }

  return failedRules;
};

module.exports = testObject;
