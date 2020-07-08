const consoleReporter = (testResult, testName) => {
  if (testName) console.log(testName);

  if (testResult.isMatch) {
    console.log("PASSED");
  } else {
    console.error("FAILED");
    console.log(testResult.failedRules);
  }

  console.log(`DURATION(ms):${testResult.duration.toFixed(2)}`);
};
module.exports = { consoleReporter };
