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
  { callback: when.array.has, isFactory: true, aliases: ["at least one is"] },
  { callback: when.array.doesntHave, isFactory: true, aliases: ["none are"] },
  { callback: when.array.each.has, isFactory: true, aliases: ["each has"] },
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
  requestPassOn: "Pass on",
};

const contexts = {
  request: "request",
  headers: "headers",
  rules: "rules",
};

const preProcess = (text) => {
  return text.replace(/^\s*/gm, "").replace(/\/**.+**\//gm, "");
};

const textAfterKeyword = (orig, keyword) => {
  const regex = new RegExp(`(?<=${keyword}\s{0,}).+`);
  const result = regex.exec(orig);
  return result[0].trim();
};

const tryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

const parseRule = (line) => {
  const path = /"\$\S*":/.exec(line)[0];
  const value = /(?<="\$\S*":).+$/.exec(line)[0].trim();
  const pathWithoutQuotes = path.substring(1, path.length - 2);

  for (const matcher of matchers) {
    for (const alias of matcher.aliases) {
      if (value.startsWith(alias)) {
        return {
          path: pathWithoutQuotes,
          matcher,
          arg: tryParse(value.replace(alias, "")),
        };
      }
    }
  }

  return { path: pathWithoutQuotes, matcher: tryParse(value) };
};

const newCurrent = () => {
  return {
    context: "",
    testName: "",
    request: {
      headers: [],
      method: "",
      url: "",
      body: "",
      passOn: [],
    },
    ruleSet: [],
  };
};

const newRequest = () => {
  return {
    headers: [],
    method: "",
    url: "",
    body: "",
    passOn: [],
  };
};

const stripQuotes = (str) => str.replace(/"/g, "");

const parser = (text, onError) => {
  const lines = preProcess(text).split("\n");
  const tests = {}; // [{ requests: [], ruleSet: [] }];

  let current = newCurrent();
  let currentLine = "";

  for (let i = 0; i < lines.length; i++) {
    currentLine = lines[i].trim();
    if (currentLine.startsWith(keywords.testStart)) {
      if (current.testName) {
        tests[current.testName]["ruleSet"] = [...current.ruleSet];
      }

      current = newCurrent();

      //new test

      current.testName = /(?<=Test that it\s).+$/.exec(currentLine)[0];
      tests[current.testName] = {};
    } else if (
      currentLine === keywords.after ||
      currentLine === keywords.expect
    ) {
      current.context = contexts.request;

      if (current.request.url) {
        // add request
        tests[current.testName].requests = [current.request]; //also a request is added when currentLine === keywords.toMatch
        current.request = newRequest();
      }
    } else if (currentLine === keywords.toMatch) {
      current.context = contexts.rules;
      if (!tests[current.testName].requests) {
        tests[current.testName].requests = [];
      }
      tests[current.testName].requests.push(current.request);
      current.request = newRequest;
    } else if (currentLine === keywords.requestHeaders) {
      current.context = contexts.headers;
    } else if (currentLine.startsWith(keywords.requestPassOn)) {
      if (
        current.context !== contexts.request &&
        current.context !== contexts.headers
      ) {
        onError(
          `${i}: Pass on must be in the After HTTP Request block: ${currentLine}`
        );
      } else {
        try {
          const passOnArg = /".*"/.exec(currentLine)[0];
          const passOnAs = /(?<=\s{1,}as\s{1,}).+$/.exec(currentLine)[0];
          current.request.passOn.push({
            jsonpath: stripQuotes(passOnArg),
            as: passOnAs.trim(),
          });
        } catch (ex) {
          onError(
            `${i}: Invalid Pass on, should be Pass on "$..id" as _whatever`
          );
        }
      }
    } else {
      // not a mode-setting line
      switch (current.context) {
        case contexts.request:
          if (currentLine.startsWith(keywords.requestMethod)) {
            try {
              current.request.method = textAfterKeyword(
                currentLine,
                keywords.requestMethod
              );
            } catch (ex) {
              onError(`${i}: empty method: ${currentLine}`);
            }
          } else if (currentLine.startsWith(keywords.requestUrl)) {
            try {
              current.request.url = textAfterKeyword(
                currentLine,
                keywords.requestUrl
              );
            } catch (ex) {
              onError(`${i}: empty url: ${currentLine}`);
            }
          } else if (currentLine.startsWith(keywords.requestBody)) {
            try {
              current.request.body = textAfterKeyword(
                currentLine,
                keywords.requestBody
              );
            } catch (ex) {
              onError(`${i}: empty body: ${currentLine}`);
            }
          }
          break;
        case contexts.headers:
          try {
            const headerHalves = currentLine.trim().split(":");
            const header = {};
            header[stripQuotes(headerHalves[0])] = stripQuotes(
              headerHalves[1]
            ).trim();
            current.request.headers.push(header);
          } catch (ex) {
            onError(`${i}: invalid header: ${currentLine}`);
          }
          break;
        case contexts.rules:
          try {
            current.ruleSet.push(parseRule(currentLine));
          } catch (ex) {
            onError(`${i}: invalid rule: ${currentLine}`);
          }
          break;
      }
    }
  }

  tests[current.testName].ruleSet = [...current.ruleSet];
  return tests;
};

module.exports = { parser, preProcess };
