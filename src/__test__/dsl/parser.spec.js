const { parser, preProcess } = require("../../dsl/parser");

describe("Parser tests", () => {
  const code = `Test that it should return stuff when queried
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
      body: 
      headers:
          "Accept-Encoding":"*/*"
  To match these rules
      "$..id": each is a number 
      "$..title": each is a non empty string
      "$..num": each is > 10`;

  it("should remove whitespace", () => {
    const preProcessedCode = preProcess(code);

    expect(preProcessedCode.length).toBeLessThan(code.length);
    expect(preProcessedCode.length).toEqual(379);
  });

  it("should parse a test", () => {
    const test = parser(code);
    console.log(JSON.stringify(test));

    expect(test).toBeDefined();
  });
});
