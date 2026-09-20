#!/usr/bin/env node
const { readHookInput, normalizePath, filePathFromInput } = require('./hook-common.js');

const input = readHookInput();
const file = normalizePath(filePathFromInput(input));

if (!file) {
  process.exit(0);
}

const basename = file.split('/').pop() || '';

const blocked =
  (/\.env$/i.test(basename) && basename.toLowerCase() !== '.env.example') ||
  /^\.env\.(?!example)/i.test(basename) ||
  /credentials\.json$/i.test(basename) ||
  /gcp-oauth\.keys\.json$/i.test(basename) ||
  /\.pem$/i.test(basename) ||
  /id_rsa$/i.test(basename) ||
  /\.pfx$/i.test(basename) ||
  /secrets\.json$/i.test(basename);

if (blocked) {
  console.error(
    `Blocked: do not create or edit secret/credential files via the agent (${file}). Use local env or a secret manager outside Git.`
  );
  process.exit(1);
}

process.exit(0);
