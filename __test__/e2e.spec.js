const { expect:expectRequest, when } = require('../index');

describe('End to end tests', () => {
    it('should pass', async () => {
        const result = await expectRequest('https://jsonplaceholder.typicode.com/todos/1')
            .toMatch({
                "$..userId": when.each.is.number,
                "$..id": when.each.is.number,
                "$..title": when.each.is.string,
                "$..id": when.each.is.greaterThan(0)
            });

        expect(result.isMatch).toBe(true);
    });
});