const fetch = require("node-fetch");
const objectTester = require("./objectTester");
const matchers = require("./matchers");
const jsonpath = require("jsonpath");

const getTimeInMs = () => {
  const hrtime = process.hrtime();
  return hrtime[0] * 1000 + hrtime[1] / 1000000;
};

const expectFactory = (arragePromise, pass) => {
  /**
   * @param url {string}
   * @param [options] {{method: string, body?: string}} Eg GET or POST
   */
  const expect = (url, options) => {
    return {
      /**
       * @param ruleSet {{jsonpath:string, matcher:(Function|any)}} jasonpath : callback or literal value
       */
      toMatch: async (ruleSet) => {
        const start = getTimeInMs();
        if (arragePromise) {
          const firstResponse = await (await arragePromise).json();
          if (pass) {
            const passedOnValue = jsonpath.query(firstResponse, pass.passOn)[0];
            url = url.replace(pass.as, passedOnValue);

            if (options && typeof options.body === "string") {
              options.body = options.body.replace(pass.as, passedOnValue);
            }
          }
        }
        const response = await fetch(url, options);

        //do the match
        const failedRules = objectTester(ruleSet, await response.json());

        const end = getTimeInMs();
        return {
          isMatch: failedRules.length === 0,
          failedRules,
          duration: end - start,
        };
      },
    };
  };

  return expect;
};

const expect = expectFactory(undefined, undefined);

const something_like_this = {
  /**
   * @param url {string}
   * @param [options] {{method: string, body?: string}} Eg GET or POST
   * @param [pass] {{passOn: string, as: string}}
   */

  after: (url, options, pass) => {
    return {
      expect: expectFactory(fetch(url, options), pass),
    };
  },

  expect,
  when: matchers.when,
  ifExists: matchers.ifExists,
};

module.exports = something_like_this;