/**
 * Shared utilities for sub-agent logging hooks.
 * Log path: CURSOR_PROJECT_DIR (walk to .cursor/hooks.json) or __dirname fallback.
 */
const fs = require('fs');
const path = require('path');

const TRACKED_AGENTS = new Set([
  'feedback-analyst',
  'improvement-advisor',
  'verifier',
]);

function resolveProjectRoot() {
  const starts = [
    process.env.CURSOR_PROJECT_DIR,
    process.env.CLAUDE_PROJECT_DIR,
    process.cwd(),
    __dirname,
  ].filter(Boolean);

  for (const start of starts) {
    let dir = path.resolve(String(start));
    for (let i = 0; i < 10; i++) {
      const hooksFile = path.join(dir, '.cursor', 'hooks.json');
      if (fs.existsSync(hooksFile)) {
        return dir;
      }
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }

  return path.resolve(__dirname, '..', '..');
}

const PROJECT_ROOT = resolveProjectRoot();
const LOG_DIR = path.join(PROJECT_ROOT, '.cursor', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'subagent-activity.log');
const DEBUG_LOG_FILE = path.join(LOG_DIR, 'hook-events.log');

function readHookInput() {
  const fromArgv = readInputFromArgv();
  if (fromArgv && Object.keys(fromArgv).length > 0) {
    return fromArgv;
  }

  const fromStdin = readInputFromStdin();
  if (fromStdin && Object.keys(fromStdin).length > 0) {
    return fromStdin;
  }

  return {};
}

function readInputFromArgv() {
  const arg = process.argv[2];
  if (!arg) return null;
  try {
    if (fs.existsSync(arg)) {
      return JSON.parse(fs.readFileSync(arg, 'utf8'));
    }
    return JSON.parse(arg);
  } catch {
    return null;
  }
}

function readInputFromStdin() {
  if (process.stdin.isTTY) {
    return null;
  }

  try {
    if (typeof fs.readSync === 'function') {
      const chunks = [];
      const buf = Buffer.alloc(64 * 1024);
      let bytesRead = 0;

      try {
        while ((bytesRead = fs.readSync(0, buf, 0, buf.length, null)) > 0) {
          chunks.push(Buffer.from(buf.slice(0, bytesRead)));
        }
      } catch {
        const single = fs.readFileSync(0, 'utf8');
        return parseJsonObject(single);
      }

      if (chunks.length === 0) {
        return null;
      }

      return parseJsonObject(Buffer.concat(chunks).toString('utf8'));
    }

    return parseJsonObject(fs.readFileSync(0, 'utf8'));
  } catch {
    return null;
  }
}

function parseJsonObject(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function appendLine(filePath, entry) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, entry + '\n', 'utf8');
}

function appendSubagentLog(entry) {
  appendLine(LOG_FILE, entry);
}

function appendHookDebug(hookName, message, extra) {
  const ts = new Date().toISOString();
  const detail = extra ? ` | ${extra}` : '';
  appendLine(DEBUG_LOG_FILE, `[${ts}] | hook=${hookName} | ${message}${detail}`);
}

function matchSummary(text) {
  const match = String(text).match(/SUBAGENT_SUMMARY:\s*(.+)/i);
  if (!match) return '';
  return match[1].replace(/\s+/g, ' ').trim().slice(0, 2000);
}

function loadCommon() {
  return module.exports;
}

module.exports = {
  TRACKED_AGENTS,
  PROJECT_ROOT,
  LOG_FILE,
  DEBUG_LOG_FILE,
  readHookInput,
  appendSubagentLog,
  appendHookDebug,
  matchSummary,
  resolveProjectRoot,
  loadCommon,
};
