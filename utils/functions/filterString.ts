import _ from "lodash";

export function filterString(inputString: string) {
  return _.flow([
    (str: string) => str.replace(/[\n\r\t]+/g, ","), // Remove newlines, tabs, and carriage returns
    (str: string) => _.trim(str), // Trim leading and trailing whitespace
    (str: string) => str.replace(/\s+/g, " "), // Replace multiple spaces with a single space
  ])(inputString);
}
