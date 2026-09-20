#!/usr/bin/env node
const fs = require('fs');
const input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}');
const file = input.filePath || input.path || '';
if (!file.endsWith('.json')) process.exit(0);
try {
  if (fs.existsSync(file)) JSON.parse(fs.readFileSync(file, 'utf8'));
  process.exit(0);
} catch (err) {
  console.error(`Invalid JSON after edit: ${file} — ${err.message}`);
  process.exit(1);
}
