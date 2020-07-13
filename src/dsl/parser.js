const matcherAliases = require("./matcherAliases");
const preProcessor = require("./preProcessor");

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

const textAfterKeyword = (orig, keyword) => {
  const regex = new RegExp(`(?<=${keyword}\s{0,}).+`);
  const result = regex.exec(orig);
  return result[0].trim();
};

const tryParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str.trim();
  }
};

const parseJsonRule = (line) => {
  const path = /"\$\S*":/.exec(line)[0];
  const value = /(?<="\$\S*":).+$/.exec(line)[0].trim();
  const pathWithoutQuotes = path.substring(1, path.length - 2);

  for (const entry of matcherAliases.matchersForPrimitives) {
    const sortedAliases = entry.aliases.sort((a, b) => a.length - b.length);
    for (const alias of sortedAliases) {
      if (value.startsWith(alias)) {
        return {
          path: pathWithoutQuotes,
          matcher: entry.matcher,
          isArrayMatcher: false,
        };
      }
    }
  }

  for (const entry of matcherAliases.matcherFactoriesForPrimitives) {
    const sortedAliases = entry.aliases.sort((a, b) => a.length - b.length);
    for (const alias of sortedAliases) {
      if (value.startsWith(alias)) {
        return {
          path: pathWithoutQuotes,
          matcher: entry.matcherFactory(tryParse(value.replace(alias, ""))),
          isArrayMatcher: false,
        };
      }
    }
  }

  for (const entry of matcherAliases.matcherFactoriesForArrays) {
    const sortedAliases = entry.aliases.sort((a, b) => a.length - b.length);
    for (const alias of sortedAliases) {
      if (value.startsWith(alias)) {
        return {
          path: pathWithoutQuotes,
          matcher: entry.matcherFactory(tryParse(value.replace(alias, ""))),
          isArrayMatcher: true,
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
  const lines = preProcessor(text);
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
    } else if (currentLine === keywords.after || currentLine === keywords.expect) {
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
      if (current.context !== contexts.request && current.context !== contexts.headers) {
        onError(`${i}: Pass on must be in the After HTTP Request block: ${currentLine}`);
      } else {
        try {
          const passOnArg = /".*"/.exec(currentLine)[0];
          const passOnAs = /(?<=\s{1,}as\s{1,}).+$/.exec(currentLine)[0];
          current.request.passOn.push({
            jsonpath: stripQuotes(passOnArg),
            as: passOnAs.trim(),
          });
        } catch (ex) {
          onError(`${i}: Invalid Pass on, should be Pass on "$..id" as _whatever`);
        }
      }
    } else {
      // not a mode-setting line
      switch (current.context) {
        case contexts.request:
          if (currentLine.startsWith(keywords.requestMethod)) {
            try {
              current.request.method = textAfterKeyword(currentLine, keywords.requestMethod);
            } catch (ex) {
              onError(`${i}: empty method: ${currentLine}`);
            }
          } else if (currentLine.startsWith(keywords.requestUrl)) {
            try {
              current.request.url = textAfterKeyword(currentLine, keywords.requestUrl);
            } catch (ex) {
              onError(`${i}: empty url: ${currentLine}`);
            }
          } else if (currentLine.startsWith(keywords.requestBody)) {
            try {
              current.request.body = textAfterKeyword(currentLine, keywords.requestBody);
            } catch (ex) {
              onError(`${i}: empty body: ${currentLine}`);
            }
          } else {
            onError(`${i}: Not valid line: ${currentLine}`);
          }
          break;
        case contexts.headers:
          try {
            const headerHalves = currentLine.trim().split(":");
            const header = {};
            header[stripQuotes(headerHalves[0])] = stripQuotes(headerHalves[1]).trim();
            current.request.headers.push(header);
          } catch (ex) {
            onError(`${i}: invalid header: ${currentLine}`);
          }
          break;
        case contexts.rules:
          try {
            current.ruleSet.push(parseJsonRule(currentLine));
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

module.exports = { parser };
