#!/usr/bin/env node
const input = JSON.parse(require('fs').readFileSync(0, 'utf8') || '{}');
const cmd = (input.command || '').toLowerCase();
const blocked = ['rm -rf /', 'del /s', 'format ', 'git push --force', 'git reset --hard'];
if (blocked.some((b) => cmd.includes(b))) {
  console.log(JSON.stringify({ permission: 'deny', message: 'Blocked dangerous command (teaching guardrail).' }));
  process.exit(0);
}
console.log(JSON.stringify({ permission: 'allow' }));
