const fetch = require("node-fetch");
const objectTester = require("./objectTester");
const matchers = require("./matchers");
const jsonpath = require("jsonpath");

const expectFactory = (arragePromise, pass) => {
  return (url, options) => {
    return {
      toMatch: async (ruleSet) => {
        if (arragePromise) {
            const firstResponse = await (await arragePromise).json();
            if (pass) {
                const passedOnValue = jsonpath.query(firstResponse, pass.passOn)[0];
                url = url.replace(pass.as, passedOnValue);

                if (options && typeof options.body === 'string') {
                    options.body = options.body.replace(pass.as, passedOnValue);
                }
            }
        }
        const response = await fetch(url, options);

        //do the match
        const failedRules = objectTester(ruleSet, await response.json());
        return { isMatch: failedRules.length === 0, failedRules };
      },
    };
  };
};

const expect = expectFactory(undefined, undefined);

const something_like_this = {
  after: (url, options, pass) => {
    return {
      expect: expectFactory(fetch(url, options), pass),
    };
  },
  expect,
  when: matchers,
};

module.exports = something_like_this;
