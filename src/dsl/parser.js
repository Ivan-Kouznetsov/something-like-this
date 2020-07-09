const { when } = require("../index");

const matchers = [
  {
    callback: when.each.is.number,
    isFactory: false,
    aliases: ["each is a number"],
  },
  {
    callback: when.each.is.string,
    isFactory: false,
    aliases: ["each is a string"],
  },
  {
    callback: when.each.is.boolean,
    isFactory: false,
    aliases: ["each is a boolean", "each is a bool", "each is true or false"],
  },
  {
    callback: when.each.is.object,
    isFactory: false,
    aliases: ["each is an object"],
  },
  {
    callback: when.each.is.array,
    isFactory: false,
    aliases: ["each is an array"],
  },
  {
    callback: when.each.is.defined,
    isFactory: false,
    aliases: ["each is defined"],
  },
  {
    callback: when.each.is.undefined,
    isFactory: false,
    aliases: ["each is undefined"],
  },
  {
    callback: when.each.is.truthy,
    isFactory: false,
    aliases: ["each is truthy", "each is true"],
  },
  {
    callback: when.each.is.falsy,
    isFactory: false,
    aliases: ["each is falsy", "each is false"],
  },
  {
    callback: when.each.is.stringContaining,
    isFactory: true,
    aliases: ["each is a string containing"],
  },
  {
    callback: when.each.is.nonEmptyString,
    isFactory: false,
    aliases: [
      "each is a non-empty string",
      "each is a nonempty string",
      "each is a non empty string",
    ],
  },
  {
    callback: when.each.is.greaterThan,
    isFactory: false,
    aliases: ["each is >"],
  },
  { callback: when.each.is.lessThan, isFactory: false, aliases: ["each is <"] },
  {
    callback: when.each.is.greaterThanOrEqual,
    isFactory: false,
    aliases: ["each is >="],
  },
  {
    callback: when.each.is.lessThanOrEqual,
    isFactory: false,
    aliases: ["each is <="],
  },
  { callback: when.each.is.anyOf, isFactory: true, aliases: ["any of"] },
  { callback: when.each.is.not, isFactory: true, aliases: ["not"] },
  {
    callback: when.each.is.matchingRegex,
    isFactory: true,
    aliases: ["matches regex "],
  },
  { callback: when.array.has, isFactory: true, aliases: ["at least one is "] },
  { callback: when.array.doesntHave, isFactory: true, aliases: ["none are "] },
  { callback: when.array.each.has, isFactory: true, aliases: ["each has "] },
];

const keywords = {
  testStart: "Test that it ",
  after: "After HTTP request",
  expect: "Expect HTTP request",
  toMatch: "To match these rules",
  requestMethod: "method:",
  requestUrl: "url:",
  requestBody: "body:",
  requestHeaders: "headers:",
  passOn: "Pass on",
};

const modes = {
  request: "request",
  headers: "headers",
  rules: "rules",
};
const parseError = (err) => {
  console.log(err);
  //exit(1);
};

const preProcess = (text) => {
  return text.replace(/^\s*/gm, "");
};

const textAfterKeyword = (orig, keyword) => {
  const regex = new RegExp(`(?<=${keyword}\s{0,}).+`);
  const result = regex.exec(orig);
  return result[0];
};

const parseRule = (line) => {
  const path = /"\$\S*":/.exec(line)[0];
  const value = /(?<="\$\S*":).+$/.exec(line)[0].trim();

  for (const matcher of matchers) {
    for (const alias of matcher.aliases) {
      if (value.startsWith(alias)) {
        return { path, matcher, arg: value.replace(alias, "") };
      }
    }
  }

  return { path, matcher: value };
};

const parser = (text) => {
  const lines = preProcess(text).split("\n");
  const tests = {}; // [{ requests: [], ruleSet: [] }];
  const emptyRequest = {
    headers: [],
    method: "",
    url: "",
    body: "",
    passOn: { passOn: undefined, as: undefined },
  };

  const current = {
    mode: "",
    testName: "",
    line: "",
    request: {
      headers: [],
      method: "",
      url: "",
      body: "",
      passOn: { passOn: undefined, as: undefined },
    },
    ruleSet: [],
  };

  for (let i = 0; i < lines.length; i++) {
    current.line = lines[i];
    if (current.line.length === 0) {
      continue;
    } else if (current.line.startsWith(keywords.testStart)) {
      if (current.testName) {
        tests[current.testName]["ruleSet"] = [...current.ruleSet];
      }
      current.ruleSet = [];
      //new test

      current.testName = /(?<=Test that it\s).+$/.exec(current.line)[0];
      tests[current.testName] = {};
    } else if (
      current.line === keywords.after ||
      current.line === keywords.expect
    ) {
      current.mode = modes.request;

      if (current.request.url) {
        // add request
        if (!tests[current.testName].requests) {
          tests[current.testName].requests = [];
        }
        tests[current.testName].requests.push({ ...current.request });
        current.request = { ...emptyRequest };
      }
    } else if (current.line === keywords.toMatch) {
      current.mode = modes.rules;
      if (!tests[current.testName].requests) {
        tests[current.testName].requests = [];
      }
      tests[current.testName].requests.push({ ...current.request });
      current.request = { ...emptyRequest };
    } else if (current.line === keywords.headers) {
      current.mode = modes.headers;
    } else if (current.line.startsWith(keywords.passOn)) {
      if (current.mode !== modes.request) {
        parseError(
          `${i}: Pass on must be in the After HTTP Request block: ${current.line}`
        );
      } else {
        const passOnArg = /".*"/.exec(current.line)[0];
        tests[current.testName].passOn = {
          passOn: passOnArg.replace(/"/g, ""),
          as: passOnArg,
        };
      }
    } else {
      // not a mode-setting line
      switch (current.mode) {
        case modes.request:
          if (current.line.startsWith(keywords.requestMethod)) {
            try {
              current.request.method = textAfterKeyword(
                current.line,
                keywords.method
              );
            } catch (ex) {
              parseError(`${i}: empty method: ${current.line}`);
            }
          }
          break;
        case modes.headers:
          try {
            current.request.headers.push(
              JSON.parse("{" + current.line.trim() + "}")
            );
          } catch (ex) {
            parseError(`${i}: invalid header: ${current.line}`);
          }
          break;
        case modes.rules:
          try {
            current.ruleSet.push(parseRule(current.line));
          } catch (ex) {
            parseError(`${i}: invalid rule: ${current.line}`);
          }
          break;
      }
    }
  }

  tests[current.testName].ruleSet = [...current.ruleSet];
  return tests;
};

module.exports = { parser, preProcess };
