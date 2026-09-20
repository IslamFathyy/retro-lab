import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  resolveProjectPath,
  safeReadFile,
  safeBackupReadme,
  safeWriteReadme,
} from '../dist/security.js';

describe('security', () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-doctor-sec-'));
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('rejects non-existent project path', () => {
    assert.throws(() => resolveProjectPath(path.join(tmp, 'nope')), /does not exist/);
  });

  it('blocks reads outside project root', () => {
    assert.throws(() => safeReadFile(tmp, '../outside'), /outside project/);
  });

  it('backs up and writes README only', () => {
    fs.writeFileSync(path.join(tmp, 'README.md'), '# Old\n');
    const backup = safeBackupReadme(tmp);
    assert.ok(backup?.endsWith('README.md.backup'));
    safeWriteReadme(tmp, '# New\n');
    assert.equal(fs.readFileSync(path.join(tmp, 'README.md'), 'utf8'), '# New\n');
    assert.equal(fs.readFileSync(path.join(tmp, 'README.md.backup'), 'utf8'), '# Old\n');
  });
});
