const { expect, when } = require('./index');

const runTests = async () => {
    const result = await expect('https://jsonplaceholder.typicode.com/todos/1')
        .toMatch({
            '$..userId': when.each.is.number,        
            '$..title': when.each.is.string
        });
    console.log('should return todos:');
    console.log(result);

    const result2 = await expect('https://jsonplaceholder.typicode.com/todos/1')
        .toMatch({
            '$..id': when.array.smallestNumberIs(0)
        });
    console.log('ids should start at 0');
    console.log(result2);

    const result3 = await expect('https://jsonplaceholder.typicode.com/todos/1')
        .toMatch({
            '$..title': 'My title'      
        });
    console.log('title should be My Title');
    console.log(result3);
}


runTests().then(() => { console.log('done') }).catch(e => {console.error(e)});