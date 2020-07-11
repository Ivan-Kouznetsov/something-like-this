const { parser, preProcess } = require("../../dsl/parser");

describe("Parser tests", () => {
  const superComplete = `
  Test that it should return stuff when queried
  Using values
    @id: 10
    @id2: random number upto 100
    @txt: random string length 20
  After HTTP request 
    method: post
    url: http://example.org/@id
    body: hello 
    headers:
      "Accept-Encoding":"*/*"
    Pass on "$..num"
  Wait 5 seconds 
  Expect HTTP request
    method: get
    url: http://example.org/@id
    body: 
    headers:
      "Accept-Encoding":"*/*"
  To match status code 200 /** OK **/
  To match these JSON rules
    "$..id": @id
    "$..title": each is a non empty string
    "$..num": each is > 10
    "$..books": count is "$..bookCount"
  To match these header rules
    "Accept-Encoding":"*/*"
    "X-cache":true
  `;
  const oneTest = `Test that it should return stuff when queried
  After HTTP request 
      method: post
      url: http://example.org/
      body: hello 
      headers:
          "Accept-Encoding":"*/*"
      Pass on "$..id" as _newId
      Pass on "$..token" as _newToken
  After HTTP request 
      method: post
      url: http://example.org/
      body: hello 
      headers:
          "Accept-Encoding":"*/*"
      Pass on "$..id" as _newId
      Pass on "$..token" as _newToken
  Expect HTTP request
      method: get
      url: http://example.org/_newId
      headers:
          "Accept-Encoding":"*/*"
          "token": _newToken
  To match these rules
      "$..id": each is a number 
      "$..title": each is a non empty string
      "$..num": each is > 10`;

  const expectOnlyTest = `Test that it should return stuff when queried
      Expect HTTP request
          method: get
          url: http://example.org/posts/1
          headers:
              "Accept-Encoding":"*/*"
      To match these rules
          "$..id": each is a number 
          "$..title": each is a non empty string
          "$..num": each is > 10`;

  const twoTests = `
  Test that it should return stuff when queried
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
  });

  it("should parse a test", () => {
    const tests = parser(oneTest, (err) => {
      console.log(err);
    });

    const name = "should return stuff when queried";
    console.log(JSON.stringify(tests));
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

    expect(tests[name].requests[0].passOn).toEqual([
      { jsonpath: "$..id", as: "_newId" },
      { jsonpath: "$..token", as: "_newToken" },
    ]);

    expect(tests[name].requests[1].method).toEqual("get");
    expect(tests[name].requests[1].url).toEqual("http://example.org/_newId");
    expect(tests[name].requests[1].body).toEqual("");
    expect(tests[name].requests[1].headers.length).toEqual(2);
    expect(tests[name].requests[1].headers).toEqual([
      {
        "Accept-Encoding": "*/*",
      },
      { token: "_newToken" },
    ]);

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

  it("should parse an expect-only test", () => {
    const tests = parser(expectOnlyTest);

    const name = "should return stuff when queried";

    expect(tests).toBeDefined();
    expect(tests[name]).toBeDefined();
    expect(tests[name].requests.length).toEqual(1);
    expect(tests[name].requests[0].method).toEqual("get");
    expect(tests[name].requests[0].url).toEqual("http://example.org/posts/1");
    expect(tests[name].requests[0].body).toEqual("");
    expect(tests[name].requests[0].headers.length).toEqual(1);
    expect(tests[name].requests[0].headers[0]).toEqual({
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
    let errorCount = 0;
    const tests = parser(twoTests, (s) => {
      errorCount++;
    });

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

    expect(errorCount).toBe(0);
  });

  it("should call error callback", () => {
    const invalidTest = `  
    Test that it should return stuff when queried
    Pass on "$..id"
    After HTTP request 
        method: 
        url: 
        notvalid: 
        body:  
        headers:
            ///:"*/*"        
    Expect HTTP request
        method: get
        url: http://example.org/"$..id"
        headers:
            "Accept-Encoding":"*/*"
    To match these rules
        ///: each is a number 
        "$..title": each is a non empty string
        "$..num": each is > 10`;
    let errorCount = 0;
    const tests = parser(invalidTest, (s) => {
      errorCount++;
    });

    expect(errorCount).toBe(6);
  });
});
