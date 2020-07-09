const { parser, preProcess } = require("../../dsl/parser");

describe("Parser tests", () => {
  const oneTest = `Test that it should return stuff when queried
  After HTTP request 
      method: post
      url: http://example.org/
      body: hello 
      headers:
          "Accept-Encoding":"*/*"
      Pass on "$..id"
  Expect HTTP request
      method: get
      url: http://example.org/"$..id"
      headers:
          "Accept-Encoding":"*/*"
  To match these rules
      "$..id": each is a number 
      "$..title": each is a non empty string
      "$..num": each is > 10`;

  const twoTests = `Test that it should return stuff when queried
      After HTTP request 
          method: post
          url: http://example.org/
          body: hello 
          headers:
              "Accept-Encoding":"*/*"
          Pass on "$..id"
      Expect HTTP request
          method: get
          url: http://example.org/"$..id"
          headers:
              "Accept-Encoding":"*/*"
      To match these rules
          "$..id": each is a number 
          "$..title": each is a non empty string
          "$..num": each is > 10
     Test that it should return literal values
      After HTTP request 
          method: post
          url: http://example.org/
          body: hello 
          headers:
              "Accept-Encoding":"*/*"
          Pass on "$..id"
      Expect HTTP request
          method: get
          url: http://example.org/"$..id"
          headers:
              "Accept-Encoding":"*/*"
      To match these rules
          "$..id": 1 
          "$..title": title
          "$..num": 300`;

  it("should remove whitespace", () => {
    const preProcessedCode = preProcess(oneTest);

    expect(preProcessedCode.length).toBeLessThan(oneTest.length);
    expect(preProcessedCode.length).toEqual(372);
  });

  it("should parse a test", () => {
    const tests = parser(oneTest);

    const name = "should return stuff when queried";

    expect(tests).toBeDefined();
    expect(tests[name]).toBeDefined();
    expect(tests[name].requests.length).toEqual(2);
    expect(tests[name].requests[0].method).toEqual("post");
    expect(tests[name].requests[0].url).toEqual("http://example.org/");
    expect(tests[name].requests[0].body).toEqual("hello");
    expect(tests[name].requests[0].headers.length).toEqual(1);
    expect(tests[name].requests[0].headers[0]).toEqual({
      "Accept-Encoding": "*/*",
    });

    expect(tests[name].requests[0].passOn.passOn).toEqual("$..id");
    expect(tests[name].requests[0].passOn.as).toEqual('"$..id"');

    expect(tests[name].requests[1].method).toEqual("get");
    expect(tests[name].requests[1].url).toEqual('http://example.org/"$..id"');
    expect(tests[name].requests[1].body).toEqual("");
    expect(tests[name].requests[1].headers.length).toEqual(1);
    expect(tests[name].requests[1].headers[0]).toEqual({
      "Accept-Encoding": "*/*",
    });

    expect(tests[name].ruleSet.length).toBe(3);
    expect(tests[name].ruleSet[0].path).toEqual("$..id");
    expect(tests[name].ruleSet[1].path).toEqual("$..title");
    expect(tests[name].ruleSet[2].path).toEqual("$..num");

    expect(typeof tests[name].ruleSet[0].matcher.callback).toEqual("function");
    expect(typeof tests[name].ruleSet[1].matcher.callback).toEqual("function");
    expect(typeof tests[name].ruleSet[2].matcher.callback).toEqual("function");

    expect(tests[name].ruleSet[0].arg).toEqual("");
    expect(tests[name].ruleSet[1].arg).toEqual("");
    expect(tests[name].ruleSet[2].arg).toEqual(10);
  });

  it("should parse two tests", () => {
    const tests = parser(twoTests);

    const name = "should return stuff when queried";
    const name2 = "should return literal values";

    expect(tests).toBeDefined();

    expect(tests[name]).toBeDefined();
    expect(tests[name].requests.length).toEqual(2);
    expect(tests[name].requests[0].method).toEqual("post");
    expect(tests[name].requests[0].url).toEqual("http://example.org/");
    expect(tests[name].requests[0].body).toEqual("hello");
    expect(tests[name].requests[0].headers.length).toEqual(1);
    expect(tests[name].requests[0].headers[0]).toEqual({
      "Accept-Encoding": "*/*",
    });

    expect(tests[name].requests[0].passOn.passOn).toEqual("$..id");
    expect(tests[name].requests[0].passOn.as).toEqual('"$..id"');

    expect(tests[name].requests[1].method).toEqual("get");
    expect(tests[name].requests[1].url).toEqual('http://example.org/"$..id"');
    expect(tests[name].requests[1].body).toEqual("");
    expect(tests[name].requests[1].headers.length).toEqual(1);
    expect(tests[name].requests[1].headers[0]).toEqual({
      "Accept-Encoding": "*/*",
    });

    expect(tests[name].ruleSet.length).toBe(3);
    expect(tests[name].ruleSet[0].path).toEqual("$..id");
    expect(tests[name].ruleSet[1].path).toEqual("$..title");
    expect(tests[name].ruleSet[2].path).toEqual("$..num");

    expect(typeof tests[name].ruleSet[0].matcher.callback).toEqual("function");
    expect(typeof tests[name].ruleSet[1].matcher.callback).toEqual("function");
    expect(typeof tests[name].ruleSet[2].matcher.callback).toEqual("function");

    expect(tests[name].ruleSet[0].arg).toEqual("");
    expect(tests[name].ruleSet[1].arg).toEqual("");
    expect(tests[name].ruleSet[2].arg).toEqual(10);

    // test 2

    expect(tests[name2]).toBeDefined();
    expect(tests[name2].requests.length).toEqual(2);
    expect(tests[name2].requests[0].method).toEqual("post");
    expect(tests[name2].requests[0].url).toEqual("http://example.org/");
    expect(tests[name2].requests[0].body).toEqual("hello");
    expect(tests[name2].requests[0].headers.length).toEqual(1);
    expect(tests[name2].requests[0].headers[0]).toEqual({
      "Accept-Encoding": "*/*",
    });

    expect(tests[name2].requests[0].passOn.passOn).toEqual("$..id");
    expect(tests[name2].requests[0].passOn.as).toEqual('"$..id"');

    expect(tests[name2].requests[1].method).toEqual("get");
    expect(tests[name2].requests[1].url).toEqual('http://example.org/"$..id"');
    expect(tests[name2].requests[1].body).toEqual("");
    expect(tests[name2].requests[1].headers.length).toEqual(1);
    expect(tests[name2].requests[1].headers[0]).toEqual({
      "Accept-Encoding": "*/*",
    });

    expect(tests[name2].ruleSet.length).toBe(3);
    expect(tests[name2].ruleSet[0].path).toEqual("$..id");
    expect(tests[name2].ruleSet[1].path).toEqual("$..title");
    expect(tests[name2].ruleSet[2].path).toEqual("$..num");

    expect(tests[name2].ruleSet[0].matcher).toEqual(1);
    expect(tests[name2].ruleSet[1].matcher).toEqual("title");
    expect(tests[name2].ruleSet[2].matcher).toEqual(300);

    expect(tests[name2].ruleSet[0].arg).toBeUndefined();
    expect(tests[name2].ruleSet[1].arg).toBeUndefined();
    expect(tests[name2].ruleSet[2].arg).toBeUndefined();
  });
});
