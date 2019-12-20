const fs = require("fs");
const path = require("path");
const util = require("util");
const regexUtil = require("./regex.helper");

// We're on an earlier version of node, therefore we must promisify fs methods
const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

const findFilePath = async (dir, fileName) => {
  const filePaths = await module.exports.walkFiles(dir);
  return filePaths.find(file =>
    file.match(
      regexUtil.generateRegexFromStr({
        str: fileName,
        flags: "gi"
      })
    )
  );
};

const findArchlintrc = async () => {
  const archlintrcPath = await module.exports.findFilePath(
    process.cwd(),
    ".archlintrc.js"
  );
  return `${archlintrcPath}`;
};

const walkFiles = async dir => {
  const type = typeof dir;
  if (type === "string") {
    let files = await readdir(dir);
    files = await Promise.all(
      files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await stat(filePath);
        if (stats.isDirectory()) return walkFiles(filePath);
        if (stats.isFile()) return filePath;
      })
    );
    return files.reduce(
      (all, folderContents) => all.concat(folderContents),
      []
    );
  }
  throw Error("Target start directory for walkFiles() is not of type 'string'");
};

module.exports = {
  walkFiles,
  findFilePath,
  findArchlintrc
};
