#!/usr/bin/env node
/**
 * Appends a sub-agent completion entry to .cursor/logs/subagent-activity.log
 * Triggered by subagentStop hook (see hooks.json).
 */
const {
  TRACKED_AGENTS,
  readHookInput,
  appendSubagentLog,
  appendHookDebug,
} = require('./load-subagent-log-common.js');

const HOOK_NAME = 'subagentStop';
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

const subagentType = String(
  input.subagent_type || input.agent_type || ''
).toLowerCase();

const description = String(input.description || '').toLowerCase();
const isTracked =
  TRACKED_AGENTS.has(subagentType) ||
  TRACKED_AGENTS.has(description) ||
  [...TRACKED_AGENTS].some(
    (name) => description.includes(name) || subagentType.includes(name)
  );

if (!isTracked) {
  appendHookDebug(
    HOOK_NAME,
    'skip',
    `untracked type=${subagentType || 'n/a'} description=${description || 'n/a'}`
  );
  process.exit(0);
}

const agentName =
  input.description ||
  input.subagent_type ||
  input.agent_type ||
  'unknown-agent';

const rawSummary =
  input.summary ||
  input.last_assistant_message ||
  extractSubagentSummary(input.task) ||
  '(no summary returned)';

const summary = String(rawSummary).replace(/\s+/g, ' ').trim().slice(0, 2000);
const status = input.status || 'unknown';
const duration =
  input.duration_ms != null ? `${input.duration_ms}ms` : 'n/a';
const ts = new Date().toISOString();

const entry = [
  `[${ts}]`,
  `source=subagentStop`,
  `agent=${agentName}`,
  `type=${input.subagent_type || input.agent_type || 'n/a'}`,
  `status=${status}`,
  `duration=${duration}`,
  `summary=${summary}`,
].join(' | ');

appendSubagentLog(entry);
appendHookDebug(HOOK_NAME, 'logged', `type=${subagentType} status=${status}`);
process.exit(0);

function extractSubagentSummary(task) {
  if (!task) return '';
  const match = String(task).match(/SUBAGENT_SUMMARY:\s*(.+)/i);
  return match ? match[1] : '';
}
