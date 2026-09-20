import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectProject, detectEnvVarNames } from '../dist/detector.js';

describe('detectProject', () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-doctor-det-'));
    fs.writeFileSync(
      path.join(tmp, 'package.json'),
      JSON.stringify({
        name: 'my-lib',
        scripts: { dev: 'vite', test: 'vitest', build: 'tsc' },
      })
    );
    fs.writeFileSync(path.join(tmp, '.env.example'), 'DATABASE_URL=\n');
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('detects Node.js and npm scripts', () => {
    const info = detectProject(tmp);
    assert.equal(info.type, 'Node.js');
    assert.equal(info.name, 'my-lib');
    assert.equal(info.commands.test, 'vitest');
    assert.deepEqual(info.envVarNames, ['DATABASE_URL']);
  });

  it('reads env names only from .env.example', () => {
    const names = detectEnvVarNames(tmp);
    assert.deepEqual(names, ['DATABASE_URL']);
    assert.ok(!fs.existsSync(path.join(tmp, '.env')));
  });
});
