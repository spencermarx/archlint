/**
 * @fileoverview Main Rule Tester
 * @author Spencer Marx
 */
/* eslint no-console:off */
/* eslint strict: ["error", "global"] */

"use strict";

class RuleTester {
  generateStandardResult() {
    return {
      ruleObeyed: true,
      loc: {},
      flag: "",
      message: ""
    };
  }

  /**
   * @description - Runs a test based on the standard evaluate() on a rule module
   * @param {Object} rule - the standard rule module
   * @returns {Object} - The test result
   */
  async test({ StandardRule, userConfig, flag }) {
    const Rule = new StandardRule();
    // Get rule and run evaluation
    const ruleEvaluation = await Rule.evaluate({
      userConfig,
      flag,
      standardResult: this.generateStandardResult()
    });

    return ruleEvaluation;
  }
}

module.exports = RuleTester;
