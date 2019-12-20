// Generates Regex Object
const generateRegexFromStr = ({ str, flags }) => {
  return new RegExp(str, flags);
};

//
const generateRegexFromArray = ({ arr, flags }) => {
  return new RegExp(arr.join, flags);
};

module.exports = {
  generateRegexFromStr,
  generateRegexFromArray
};
