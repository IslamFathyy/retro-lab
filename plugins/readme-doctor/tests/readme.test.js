import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { improveReadme } from '../dist/readme.js';

describe('improveReadme (comprehensive)', () => {
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

  it('generates single README with all sections inline', () => {
    const result = improveReadme(tmp);
    assert.equal(result.success, true);
    assert.deepEqual(result.generatedDocs, []);
    assert.equal(fs.existsSync(path.join(tmp, 'docs', 'API.md')), false);

    const readme = fs.readFileSync(path.join(tmp, 'README.md'), 'utf8');
    assert.match(readme, /## API/);
    assert.match(readme, /GET.*\/api\/health/);
    assert.match(readme, /## Cursor/);
    assert.match(readme, /## Project structure/);
    assert.match(readme, /PORT/);
  });
});
