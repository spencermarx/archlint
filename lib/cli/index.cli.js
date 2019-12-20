/**
 * @fileoverview Main CLI
 * @author Spencer Marx
 */
/* eslint no-console:off */
/* eslint strict: ["error", "global"] */

"use strict";

const chalk = require("chalk");
// const spinner = require("ora");

class CLI {
  constructor() {
    this.baseMessages = {
      error: {
        baseMessage: "Error ======",
        color: "red"
      },
      warning: {
        baseMessage: "Warning ======",
        color: "yellow"
      },
      print: {
        baseMessage: "",
        color: "green"
      }
    };
  }

  log({ type, message }) {
    const category = type || "print";
    const { color, baseMessage } = this.baseMessages[category];
    const fullMessage = baseMessage
      ? `\t${baseMessage} \n${message}`
      : `${message}`;
    console.log(chalk[color](fullMessage));
  }

  printResults(testResults) {
    // Get results
    const results = testResults;

    for (const result of results) {
      if (result.ruleObeyed) {
        // Valid Test
        this.log({ message: result.message });
      } else {
        // Cache type
        let type;

        switch (result.flag) {
          case "warning":
            // Failed Test + Warning Flag
            type = "warning";
            break;
          case "error":
            // Failed Tesst + Error Flag
            type = "error";
            break;
          default:
            type = null;
        }

        this.log({ type, message: result.message });
      }
    }
  }
}

module.exports = CLI;
