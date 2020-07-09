const jsonpath = require("jsonpath");

const testObject = (ruleSet, obj) => {
  let failedRules = [];
  for (const path in ruleSet) {
    const values = jsonpath.query(obj, path);
    if (values.length > 0) {
      if (typeof ruleSet[path] === "function") {
        if (ruleSet[path].isForArrays) {
          const ruleMatchResult = ruleSet[path](values);
          if (!ruleMatchResult.isMatch) {
            failedRules.push({
              path,
              message: ruleMatchResult.message,
              value: JSON.stringify(values),
            });
          }
        } else {
          values.forEach((value) => {
            const ruleMatchResult = ruleSet[path](value);
            if (!ruleMatchResult.isMatch)
              failedRules.push({
                path,
                message: ruleMatchResult.message,
                value,
              });
          });
        }
      } else {
        values.forEach((value) => {
          if (ruleSet[path] !== value) failedRules.push({ path, value });
        });
      }
    } else if (
      ruleSet[path] !== undefined &&
      (typeof ruleSet[path] !== "function" || !ruleSet[path](undefined).isMatch)
    ) {
      failedRules.push({ path, message: "Not found", value: undefined });
    }
  }

  return failedRules;
};

module.exports = testObject;
