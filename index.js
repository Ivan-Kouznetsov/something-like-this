const fetch = require('node-fetch');
const objectTester = require('./objectTester');
const matchers = require('./matchers');

const expectFactory = (arragePromise) => {
    return (url, options) => {
        return {
            toMatch: async (ruleSet) => {
                if (arragePromise) await arragePromise;
                const response = await fetch(url, options);

                //do the match
                const failedRules = objectTester(ruleSet, await response.json());
                return { isMatch: failedRules.length === 0, failedRules }
            }
        };
    };
}

const expect = expectFactory(undefined);

const something_like_this = {
    after: (url, options) => {
        return {
            expect: expectFactory(fetch(url, options))
        };
    },
    expect,
    when: matchers
}

module.exports = something_like_this;
