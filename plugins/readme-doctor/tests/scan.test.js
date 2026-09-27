import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { scanProject } from '../dist/scan/index.js';

describe('scanProject', () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-doctor-scan-'));
    fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify({ name: 'scan-me', scripts: { test: 'vitest' } }));
    fs.mkdirSync(path.join(tmp, 'data'), { recursive: true });
    fs.mkdirSync(path.join(tmp, 'tests'), { recursive: true });
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('detects structure and scripts', () => {
    const scan = scanProject(tmp);
    assert.equal(scan.name, 'scan-me');
    assert.equal(scan.hasDataDir, true);
    assert.equal(scan.hasTests, true);
    assert.ok(scan.topLevelNotes.data);
  });
});
