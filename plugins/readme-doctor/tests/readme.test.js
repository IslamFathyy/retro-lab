import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { alignReadme, generateReadme } from '../dist/readme.js';

describe('canonical README generation', () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-doctor-imp-'));
    fs.writeFileSync(
      path.join(tmp, 'package.json'),
      JSON.stringify({
        name: 'fixme',
        description: 'Demo API service',
        scripts: { test: 'node --test', start: 'node server.js', dev: 'node --watch server.js' },
      })
    );
    fs.writeFileSync(path.join(tmp, '.env.example'), '# HTTP port\nPORT=3000\nDATA_ROOT=./data\n');
    fs.mkdirSync(path.join(tmp, 'src', 'routes'), { recursive: true });
    fs.writeFileSync(
      path.join(tmp, 'src', 'routes', 'api.routes.js'),
      `import { Router } from 'express';\nconst router = Router();\nrouter.get('/health', () => {});\nrouter.post('/items', () => {});\nexport default router;\n`
    );
    fs.writeFileSync(
      path.join(tmp, 'src', 'app.js'),
      `import routes from './routes/api.routes.js';\napp.use('/api', routes);\n`
    );
    fs.mkdirSync(path.join(tmp, '.cursor', 'rules'), { recursive: true });
    fs.writeFileSync(
      path.join(tmp, '.cursor', 'rules', 'testing.mdc'),
      '---\ndescription: Run tests before commit\n---\n'
    );
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('generateReadme creates canonical README with Features after Development ports', () => {
    const result = generateReadme(tmp);
    assert.equal(result.success, true);
    assert.equal(result.created, true);

    const readme = fs.readFileSync(path.join(tmp, 'README.md'), 'utf8');
    const portsIdx = readme.indexOf('## Development ports');
    const featuresIdx = readme.indexOf('## Features');
    assert.ok(portsIdx >= 0);
    assert.ok(featuresIdx > portsIdx);
    assert.match(readme, /### HTTP API capabilities/);
    assert.match(readme, /PORT/);
  });

  it('generateReadme throws when README exists', () => {
    assert.throws(() => generateReadme(tmp), /already exists/);
  });

  it('alignReadme updates existing README and preserves tagline', () => {
    fs.writeFileSync(path.join(tmp, 'README.md'), '# fixme\n\n> Custom tagline here.\n\n## Old\n');
    const result = alignReadme(tmp);
    assert.equal(result.created, false);
    assert.ok(fs.existsSync(path.join(tmp, 'README.md.backup')));
    const readme = fs.readFileSync(path.join(tmp, 'README.md'), 'utf8');
    assert.match(readme, /Custom tagline here/);
    assert.match(readme, /## Features/);
  });
});

describe('static site fixture', () => {
  let tmp;

  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'readme-doctor-web-'));
    fs.writeFileSync(
      path.join(tmp, 'package.json'),
      JSON.stringify({ name: 'web-ui', scripts: { start: 'npx serve' } })
    );
    fs.writeFileSync(path.join(tmp, 'index.html'), '<html><title>Home</title></html>');
  });

  after(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  it('includes UI features without API section', () => {
    generateReadme(tmp);
    const readme = fs.readFileSync(path.join(tmp, 'README.md'), 'utf8');
    assert.match(readme, /### User interface/);
    assert.match(readme, /index\.html/);
  });
});
