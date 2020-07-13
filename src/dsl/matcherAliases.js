const { matchersForPrimitives, matcherFactoriesForPrimitives, matcherFactoriesForArrays } = require("../matchers");

module.exports = {
  matchersForPrimitives: [
    { matcher: matchersForPrimitives.array, aliases: ["is an array"] },
    {
      matcher: matchersForPrimitives.boolean,
      aliases: ["is a boolean", "is a bool", "is true or false"],
    } /* different length aliases can be parsing problem, need to check in order of length */,
    { matcher: matchersForPrimitives.defined, aliases: ["is defined", "exists"] },
    { matcher: matchersForPrimitives.falsy, aliases: ["is false", "is falsy"] },
    {
      matcher: matchersForPrimitives.nonEmptyString,
      aliases: ["is a non-empty string", "is a nonempty string", "is a non empty string"],
    },
    { matcher: matchersForPrimitives.number, aliases: ["is a number"] },
    { matcher: matchersForPrimitives.object, aliases: ["is an object"] },
    { matcher: matchersForPrimitives.string, aliases: ["is a string", "is text"] },
    { matcher: matchersForPrimitives.truthy, aliases: ["is true", "is truthy"] },
    { matcher: matchersForPrimitives.undefined, aliases: ["is undefined"] },
  ],
  matcherFactoriesForPrimitives: [
    { matcherFactory: matcherFactoriesForPrimitives.anyOf, aliases: ["is any of"] },
    { matcherFactory: matcherFactoriesForPrimitives.greaterThan, aliases: [">", "is greater than"] },
    {
      matcherFactory: matcherFactoriesForPrimitives.greaterThanOrEqual,
      aliases: [">=", "is greater than or equal", "is greater than or equal to"],
    },
    { matcherFactory: matcherFactoriesForPrimitives.lessThan, aliases: ["<", "is less than"] },
    {
      matcherFactory: matcherFactoriesForPrimitives.lessThanOrEqual,
      aliases: ["<=", "is less than or equal", "is less than or equal to"],
    },
    { matcherFactory: matcherFactoriesForPrimitives.matchingRegex, aliases: ["is matching regex"] },
    { matcherFactory: matcherFactoriesForPrimitives.not, aliases: ["is not"] },
    { matcherFactory: matcherFactoriesForPrimitives.stringContaining, aliases: ["contains this text:"] },
  ],
  matcherFactoriesForArrays: [
    { matcherFactory: matcherFactoriesForArrays.countEquals, aliases: ["has total count of"] },
    {
      matcherFactory: matcherFactoriesForArrays.countGreaterThan,
      aliases: ["has total count greater than", "has total count >"],
    },
    {
      matcherFactory: matcherFactoriesForArrays.countGreaterThanOrEqual,
      aliases: [
        "has total count greater than or equal",
        "has total count greater than or equal to",
        "has total count >=",
      ],
    },
    {
      matcherFactory: matcherFactoriesForArrays.countLessThan,
      aliases: ["has total count <", "has total count less than"],
    },
    {
      matcherFactory: matcherFactoriesForArrays.countLessThanOrEqual,
      aliases: ["has total count <=", "has total count less than or equal", "has total count less than or equal to"],
    },
    {
      matcherFactory: matcherFactoriesForArrays.doesntHave,
      aliases: ["does not have", "does not have a"],
    },
    {
      matcherFactory: matcherFactoriesForArrays.eachItemHas,
      aliases: ["each item has", "each item has a"],
    },
    {
      matcherFactory: matcherFactoriesForArrays.has,
      aliases: ["has", "has a"],
    },
  ],
};
