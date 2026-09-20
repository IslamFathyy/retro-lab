#!/usr/bin/env node
/**
 * afterFileEdit — block agent edits to stored feedback files (privacy guardrail).
 * Feedback must enter via API; original text must never change in place.
 */
const { readHookInput, normalizePath, filePathFromInput } = require('./hook-common.js');

const input = readHookInput();
const file = normalizePath(filePathFromInput(input));

function isFeedbackDataFile(filePath) {
  return /retro-api\/data\/retrospectives\/[^/]+\/feedback\/[^/]+\.json$/i.test(
    filePath
  );
}

if (!file || !isFeedbackDataFile(file)) {
  process.exit(0);
}

// If hook supplies before/after payloads, block only when text changed.
const oldContent = input.old_content || input.oldContent || input.before || null;
const newContent = input.new_content || input.newContent || input.after || null;

if (oldContent != null && newContent != null) {
  try {
    const before = typeof oldContent === 'string' ? JSON.parse(oldContent) : oldContent;
    const after = typeof newContent === 'string' ? JSON.parse(newContent) : newContent;
    if (before.text !== after.text) {
      console.error(
        'Blocked: feedback "text" must not be modified. Use API to add new items; never rewrite originals (privacy rule).'
      );
      process.exit(1);
    }
    process.exit(0);
  } catch {
    // Fall through to path-based block if parse fails
  }
}

// Path-based guard: no direct agent edits to feedback storage files.
console.error(
  `Blocked: do not edit feedback data files directly (${file}). Submit via POST /api/retrospectives/{id}/feedback. Original text must never change.`
);
process.exit(1);
