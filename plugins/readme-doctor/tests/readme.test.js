import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { improveReadme } from '../dist/readme.js';

describe('improveReadme', () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-doctor-imp-'));
    fs.writeFileSync(
      path.join(tmp, 'package.json'),
      JSON.stringify({ name: 'fixme', scripts: { test: 'npm test', start: 'node server.js' } })
    );
    fs.writeFileSync(path.join(tmp, '.env.example'), 'PORT=\n');
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('creates README with scaffold when missing', () => {
    const result = improveReadme(tmp);
    assert.equal(result.success, true);
    assert.equal(result.created, true);
    const content = fs.readFileSync(path.join(tmp, 'README.md'), 'utf8');
    assert.match(content, /## Installation/);
    assert.match(content, /npm test/);
    assert.match(content, /PORT/);
  });

  it('does not invent API endpoints', () => {
    const content = fs.readFileSync(path.join(tmp, 'README.md'), 'utf8');
    assert.ok(!content.includes('POST /api'));
    assert.ok(!content.includes('GET /'));
  });
});
