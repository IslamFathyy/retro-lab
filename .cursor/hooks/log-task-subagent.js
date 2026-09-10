#!/usr/bin/env node
/**
 * Appends sub-agent activity when the Task tool completes (postToolUse).
 */
const {
  TRACKED_AGENTS,
  readHookInput,
  appendSubagentLog,
  appendHookDebug,
  matchSummary,
} = require('./load-subagent-log-common.js');

const HOOK_NAME = 'postToolUse';
const input = readHookInput();

if (!input || Object.keys(input).length === 0) {
  appendHookDebug(
    HOOK_NAME,
    'skip',
    'empty input (stdin/argv); CURSOR_PROJECT_DIR=' +
      (process.env.CURSOR_PROJECT_DIR || 'unset')
  );
  process.exit(0);
}

const toolName = String(input.tool_name || input.toolName || '');
if (toolName !== 'Task') {
  process.exit(0);
}

const toolInput = input.tool_input || input.toolInput || {};
const subagentType = String(toolInput.subagent_type || '').toLowerCase();

if (!TRACKED_AGENTS.has(subagentType)) {
  appendHookDebug(
    HOOK_NAME,
    'skip',
    `untracked Task subagent_type=${subagentType || 'n/a'}`
  );
  process.exit(0);
}

const agentName =
  toolInput.description || toolInput.subagent_type || 'unknown-agent';
const summary = extractSummary(
  input.tool_output || input.toolOutput,
  toolInput.prompt
);
const duration =
  input.duration != null ? `${input.duration}ms` : 'n/a';
const ts = new Date().toISOString();

const entry = [
  `[${ts}]`,
  `source=postToolUse`,
  `agent=${agentName}`,
  `type=${subagentType}`,
  `status=completed`,
  `duration=${duration}`,
  `summary=${summary}`,
].join(' | ');

appendSubagentLog(entry);
appendHookDebug(HOOK_NAME, 'logged', `type=${subagentType}`);
process.exit(0);

function extractSummary(toolOutput, prompt) {
  const text = normalizeToolOutput(toolOutput);
  const fromOutput = matchSummary(text);
  if (fromOutput) return fromOutput;
  const fromPrompt = matchSummary(String(prompt || ''));
  if (fromPrompt) return fromPrompt;
  return text ? text.slice(0, 500) : '(no summary returned)';
}

function normalizeToolOutput(toolOutput) {
  if (!toolOutput) return '';
  if (typeof toolOutput === 'object') {
    return JSON.stringify(toolOutput);
  }
  const raw = String(toolOutput);
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'string') return parsed;
    if (parsed && typeof parsed === 'object') {
      return String(
        parsed.result ||
          parsed.output ||
          parsed.message ||
          parsed.text ||
          JSON.stringify(parsed)
      );
    }
  } catch {
    // keep raw string
  }
  return raw;
}
