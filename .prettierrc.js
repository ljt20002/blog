const standardPrettierConfig = require('@byted/prettier-config-standard');
module.exports = {
  ...standardPrettierConfig, 
  jsxBracketSameLine: false,
  endOfLine: 'auto',
};
