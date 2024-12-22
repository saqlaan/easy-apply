import _ from "lodash";

export function filterString(inputString: string) {
  // Remove newlines, carriage returns, tabs, and extra spaces
  return _.flow([
    (str) => str.replace(/[\n\r\t]+/g, ","), // Remove newlines, tabs, and carriage returns
    (str) => _.trim(str), // Trim leading and trailing whitespace
    (str) => str.replace(/\s+/g, " "), // Replace multiple spaces with a single space
  ])(inputString);
}
