#!/usr/bin/env node
/**
 * @fileoverview Main CLI that is run via the eslint command.
 * @author Spencer Marx
 */
/* eslint no-console:off */
/* eslint strict: ["error", "global"] */

"use strict";

const main = async () => {
  try {
    // Initialize Linter
    const { findArchlintrc } = require("../lib/helpers/file.helper"); // eslint-disable-line
    const LintEngine = require("../lib/linter/index.linter"); // eslint-disable-line

    const linter = new LintEngine();

    // Find path to .archlintrc.js file
    const archlintPath = await findArchlintrc();
    const masterConfig = require(archlintPath); // eslint-disable-line

    // Path to main rules file
    const { rules } = masterConfig;

    if (!rules) {
      throw Error("No rules found");
    }

    // Run linter with rules
    linter.run(rules);
  } catch (error) {
    // Handle Main Error
    console.error(`Main Script Failed: ${JSON.stringify(error)}`);
    process.exit(2);
  }
};

// Run Main
main();
