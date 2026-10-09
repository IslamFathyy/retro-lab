import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { analyzeReadme } from '../dist/analyzer.js';

function mkTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'readme-doctor-'));
}

describe('analyzeReadme', () => {
  let tmp;

  before(() => {
    tmp = mkTempDir();
    fs.writeFileSync(
      path.join(tmp, 'package.json'),
      JSON.stringify({ name: 'demo-app', scripts: { test: 'node --test', start: 'node index.js' } })
    );
    fs.writeFileSync(path.join(tmp, '.env.example'), 'API_PORT=3000\nSECRET_KEY=\n');
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('scores low when README is missing', () => {
    const result = analyzeReadme(tmp);
    assert.equal(result.readme.exists, false);
    assert.equal(result.score, 0);
    assert.ok(result.suggestions.length > 0);
    assert.ok(result.enabledSectionIds.includes('features'));
  });

  it('detects canonical sections', () => {
    fs.writeFileSync(
      path.join(tmp, 'README.md'),
      `# Demo

> Tagline

## Quick start
npm install

## 5-minute setup
npm start

## Prerequisites
Git

## Repository structure
src/

## Development ports
3000

## Features
API

## Security
no secrets

## Links
git
`
    );
    const result = analyzeReadme(tmp);
    assert.equal(result.sections.features, 'present');
    assert.equal(result.sections.development_ports, 'present');
    assert.ok(result.score >= 5);
    assert.deepEqual(result.envVarNames, ['API_PORT', 'SECRET_KEY']);
  });
});
