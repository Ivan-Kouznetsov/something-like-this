const jsonpath = require("jsonpath");

const testObject = (ruleSet, obj) => {
  let failedRules = [];
  for (const path in ruleSet) {
    const values = jsonpath.query(obj, path);
    if (values.length > 0) {
      if (typeof ruleSet[path] === "function") {
        if (ruleSet[path].isForArrays) {
          if (!ruleSet[path](values)) {
            failedRules.push({ path, value: JSON.stringify(values) });
          }
        } else {
          values.forEach((value) => {
            if (!ruleSet[path](value)) failedRules.push({ path, value });
          });
        }
      } else {
        values.forEach((value) => {
          if (ruleSet[path] !== value) failedRules.push({ path, value });
        });
      }
    } else if (
      ruleSet[path] !== undefined &&
      (typeof ruleSet[path] !== "function" || !ruleSet[path](undefined))
    ) {
      failedRules.push({ path, value: undefined });
    }
  }

  return failedRules;
};

module.exports = testObject;
