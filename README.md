# something-like-this

## A declarative server API testing library

Most automated tests are procedural – they contain a set of steps for how to test something, leaving room for bugs, this project aims to extract all logic and procedural code from the test and put it into the library which allows you to write API tests that contain only HTTP request data and a human-readable set of rules for what the response should be. Such as:

    const result = await after("https://jsonplaceholder.typicode.com/todos",
        { method: "POST", body: "{userId:1,title:'hello'}" }, {passOn:"$..id", as:"NEW_POST_ID"})
        .expect("https://jsonplaceholder.typicode.com/todos/NEW_POST_ID")
        .toMatch({
            "$..userId": when.each.is.number,
            "$..title": when.each.is.string,
            "$..id": when.each.is.greaterThanOrEqual(0)
        });

Without having ever used this library you can probably guess what this does.  
The rules consist of key-value pairs, where the key is a [JSON path](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html) and the value is a callback or literal value.
_something-like-this_ lets you arrange, act, and assert without writing procedural code by using a fluent interface:

    const result = await after(URL, REQUEST_DETAILS)  // arrange
        .expect(URL) // act
        .toMatch({"$..userId": when.each.is.number});  // assert

## Benefits

- Declarative API tests
- Easy to extend
- 100% code coverage of the library itself

| File            | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| --------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files       | 100     | 100      | 100     | 100     |
| index.js        | 100     | 100      | 100     | 100     |
| matchers.js     | 100     | 100      | 100     | 100     |
| objectTester.js | 100     | 100      | 100     | 100     |

## Limitations

- HTTP API tests only
- One rule per JSON path
