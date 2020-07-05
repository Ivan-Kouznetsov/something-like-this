# something-like-this
## A declarative server API testing library.
Most automated tests are procedural – they contain a set of steps for how to test something, leaving room for bugs, this project aims to extract all logic and procedural code from the test and put it into the library which allows you to write API tests that contain only HTTP request data and a human-readable set of rules for what the response should be. Such as:

    const result = await expect('https://jsonplaceholder.typicode.com/todos/1')
        .toMatch({
            '$..userId': when.each.is.number,
            '$..id': when.each.is.number,
            '$..title': when.each.is.string,
            '$..id': when.each.is.greaterThan(0)
        });  

Without having ever used this library you can probably guess what this does. The rules consist of key-value pairs, wherein the key is a [JSON path](https://support.smartbear.com/alertsite/docs/monitors/api/endpoint/jsonpath.html) and the value is a callback or literal value.
## Benefits
* Declarative API tests
* Easy to extend
* 100% code coverage of the library itself
## Limitations
HTTP API tests only
