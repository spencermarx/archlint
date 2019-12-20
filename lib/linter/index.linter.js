/**
 * @fileoverview Main Linter Engine
 * @author Spencer Marx
 */
/* eslint no-console:off */
/* eslint strict: ["error", "global"] */

"use strict";

const CLIGenerator = require("../cli/index.cli");
const TestGenerator = require("../rule-testers/index.ruleTester");

// Initialize ClLI
const CLI = new CLIGenerator();
// Initialize Rule Tester
const RuleTester = new TestGenerator();

class LintEngine {
  constructor() {
    this.userInput = {};
    this.rules = [];
    this.testResults = [];
    this.resultSummary = {
      valid: 0,
      invalid: 0
    };
  }

  /**
   * @description -
   */
  configureRules() {
    const userRules = this.userInput;

    for (const userRule in userRules) {
      if (Object.prototype.hasOwnProperty.call(userRules, userRule)) {
        // Get Appropriate Rule from Rules
        const StandardRule = require(`../rules/${userRule}.rule.js`); // eslint-disable-line
        // Get User Configs & Flags

        const userConfig = require(`${process.cwd()}/.archlint/${userRule}.archlint.js`); // eslint-disable-line
        const flag = userRules[userRule];

        if (!StandardRule) {
          this.throwError(`No such rule as ${userRule.rule}`);
          break;
        }
        // Attach flag property from User
        this.rules.push({ StandardRule, userConfig, flag });
      }
    }
  }

  checkForErrors() {
    const errorsArray = [];
    // Check if any failed results with error flag
    for (const result of this.testResults) {
      if (!result.ruleObeyed && result.flag === "error") {
        errorsArray.push(result);
      }
    }
    return errorsArray;
  }

  async run(userInput) {
    CLI.log({ message: "Running Linter..." });

    // Store User Input
    this.userInput = userInput;

    // Determine which rules to run against
    this.configureRules();

    // Test Each Rule
    for (const [index, rule] of this.rules.entries()) {
      CLI.log({
        message: `Testing Rule ${index + 1} of ${this.rules.length}: ${
          rule.userConfig.rule
        }`
      });
      const testResult = await RuleTester.test(rule); // eslint-disable-line
      this.testResults.push(testResult);
    }
    // Print Final Results
    CLI.printResults(this.testResults);

    // Handle Errors
    const errors = this.checkForErrors();

    if (errors.length < 1) {
      // End Linter
      CLI.log({ message: "Linting Complete" });
    } else {
      // Handle Failed 'Error' Test Results
      console.error("Linter failed due to the above errors");
      process.exit(2);
    }
  }
}

module.exports = LintEngine;
