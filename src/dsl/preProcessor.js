module.exports = (text) =>
  text
    .replace(/^\s*/gm, "")
    .replace(/\s*$/gm, "")
    .replace(/\/\*\*.+\*\*\//gm, "")
    .split("\n");
