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
  });

  it('detects present sections', () => {
    fs.writeFileSync(
      path.join(tmp, 'README.md'),
      `# Demo

## Installation
npm install

## Usage
npm start

## Development
npm run dev

## Environment
See .env.example

## Testing
npm test
`
    );
    const result = analyzeReadme(tmp);
    assert.equal(result.sections.installation, 'present');
    assert.equal(result.sections.testing, 'present');
    assert.ok(result.score >= 5);
    assert.deepEqual(result.envVarNames, ['API_PORT', 'SECRET_KEY']);
  });
});
