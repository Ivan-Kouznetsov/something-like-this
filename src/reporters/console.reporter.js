const consoleReporter = (testResult, testName) => {
  if (testName) console.log(testName);

  if (testResult.isMatch) {
    console.log("PASSED");
  } else {
    console.error("FAILED");
    console.log(testResult.failedRules);
  }
};
module.exports = { consoleReporter };
