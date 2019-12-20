/**
 * @fileoverview - Example `.archlintrc.js` file
 * @description - For every rule enabled here, there should be a corresponding config file for the rule in a folder `.archlint`
 * @required
 * @author - Spencer Marx
 */
module.exports = {
  rules: {
    // ruleName : The kind of flag to throw on a failed test ("warning", "error")
    "namingConvention": "error"
  }
}