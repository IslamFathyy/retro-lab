/**
 * Shared helpers for policy hooks (stdin JSON input, path normalization).
 */
const fs = require('fs');

function readHookInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    if (!raw.trim()) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function normalizePath(filePath) {
  return String(filePath || '').replace(/\\/g, '/');
}

function filePathFromInput(input) {
  return input.filePath || input.path || input.file || '';
}

module.exports = {
  readHookInput,
  normalizePath,
  filePathFromInput,
};
