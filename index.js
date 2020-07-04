const fetch = require('node-fetch');
const objectTester = require('./objectTester');
const matchers = require('./matchers');

module.exports = {
    expect: (url, options) => {
        return {
            toMatch: async (ruleSet) => {
                const response = await fetch(url, options);

                //do the match
                const failedRules = objectTester(ruleSet, await response.json());
                return { isMatch: failedRules.length === 0, failedRules }
            }
        };
    },
    when: matchers
}