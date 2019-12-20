/**
 * @fileoverview Rule - Naming Conventions
 * @author Spencer Marx
 */
/* eslint strict: ["error", "global"] */

"use strict";

// const walkFiles = require("recursive-readdir");
const { walkFiles } = require("../helpers/file.helper");
const regexUtil = require("../helpers/regex.helper");

class NamingConventionRule {
  constructor() {
    this.enums = {
      messages: {
        base: "Naming Convention Not Followed"
      }
    };
    this.userConfig = {};
    this.conventions = [];
  }

  accountForRelationStr({ targetParentDir, expectedName }) {
    let baseStr = "";
    const targetDirName = targetParentDir.dirName;

    switch (targetParentDir.relation) {
      case "parent":
        baseStr = `${targetDirName}/(.*)${expectedName.extension}`;
        break;
      default:
        baseStr = targetDirName;
    }
    return baseStr;
  }

  checkRegex(convention, files) {
    // Get Target Parent Directory
    const { targetParentDir, expectedName } = convention;
    let validFiles = [];
    let invalidFiles = [];
    const relationSearchStr = this.accountForRelationStr({
      targetParentDir,
      expectedName
    });
    const namingSearchStr = `${expectedName.body}${expectedName.extension}`;

    for (const file of files) {
      // Check if file is direct descendant of target parent
      const isDescendent = file.match(
        regexUtil.generateRegexFromStr({
          str: relationSearchStr,
          flags: "g"
        })
      );

      if (isDescendent) {
        // If file is descendent check if file is named properly
        const checkNaming = file.match(
          regexUtil.generateRegexFromStr({
            str: namingSearchStr,
            flags: "g"
          })
        );
        if (Array.isArray(checkNaming) && checkNaming.length > 0) {
          validFiles = [...validFiles, file];
        } else {
          invalidFiles = [...invalidFiles, file];
        }
      }
    }

    return {
      ruleObeyed: !(invalidFiles.length > 0),
      validFiles,
      invalidFiles
    };
  }

  async checkConventions() {
    const { conventions } = this;

    const folderPromises = [];
    for (const folder of this.userConfig.includedRootFolders) {
      const includedRootFolderPath = `${process.cwd()}/${folder}`; //eslint-disable-line
      folderPromises.push(walkFiles(includedRootFolderPath));
    }
    const filesPerFolder = await Promise.all(folderPromises);

    const allFileNames = filesPerFolder.reduce(function(prev, curr) {
      return prev.concat(curr);
    });

    const checkedConventions = [];
    for (const convention of conventions) {
      // Create convention object
      const checkedConvention = {
        name: convention.name,
        description: convention.description,
        testResults: {},
        errorMessage: convention.errorMessage
      };

      // Run convention check with regex
      checkedConvention.testResults = this.checkRegex(convention, allFileNames);

      checkedConventions.push(checkedConvention);
    }
    return checkedConventions;
  }

  buildErrorMessage({ convention }) {
    let baseStr = "";

    for (const file of convention.testResults.invalidFiles) {
      baseStr += `\t\t\t${file}\n`;
    }
    baseStr += `\n\t\t${convention.errorMessage}\n`;

    return baseStr;
  }

  createResultObject({ standardResult, conventions }) {
    const result = standardResult;
    for (const convention of conventions) {
      result.message += `\n\tWhen checking ${convention.name}...\n`;
      if (!convention.testResults.ruleObeyed) {
        // Test Failed
        result.ruleObeyed = false;

        // Where did it fail?
        result.loc[convention.name] = convention.testResults.invalidFiles;

        // Set the flag
        result.flag = this.flag;

        // Build the message
        const failsQty = convention.testResults.invalidFiles.length;
        result.message += `\n\t\tFailed ${failsQty} time${
          failsQty > 1 ? `s` : ``
        } at: \n${this.buildErrorMessage({
          convention
        })}`;
      } else {
        result.message += `\n\t\tAll tests passed\n`;
      }
    }
    return result;
  }

  async evaluate({ userConfig, flag, standardResult }) {
    this.userConfig = userConfig;
    this.conventions = userConfig.conventions;
    this.flag = flag;
    const checkedConventions = await this.checkConventions();
    // Get standard results object
    const result = this.createResultObject({
      standardResult,
      conventions: checkedConventions
    });
    return result;
  }
}

module.exports = NamingConventionRule;
