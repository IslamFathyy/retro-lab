/**
 * Bootstrap require for subagent log hooks when Cursor runs scripts from a temp copy.
 */
const fs = require('fs');
const path = require('path');

function resolveCommonPath() {
  const starts = [
    process.env.CURSOR_PROJECT_DIR,
    process.env.CLAUDE_PROJECT_DIR,
    process.cwd(),
    __dirname,
  ].filter(Boolean);

  for (const start of starts) {
    let dir = path.resolve(String(start));
    for (let i = 0; i < 10; i++) {
      const commonPath = path.join(dir, '.cursor', 'hooks', 'subagent-log-common.js');
      if (fs.existsSync(commonPath)) {
        return commonPath;
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  return path.join(__dirname, 'subagent-log-common.js');
}

module.exports = require(resolveCommonPath());
