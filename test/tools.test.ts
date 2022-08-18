import * as path from 'path';
import * as assert from 'assert';
import { shellTask, spawnAsPromise } from '../src/lib/tools';

suite('Tools tests', () => {
  test('shellTask returns correct output', async () => {
    const name = 'pip: fortls';
    const output = await shellTask(
      'python3',
      ['-m', 'pip', 'install', '--upgrade', '--force', 'fortls'],
      name
    );
    assert.strictEqual(output, `${name}: shell task completed successfully.`);
  });

  test('shellTask returns rejected promise', async () => {
    const name = 'pip: fortls';
    assert.rejects(shellTask('python3', ['-m', 'pip', 'install', 'fortls2'], name));
  });

  test('spawnAsPromise correct stdout, stderr output exit code 0', async () => {
    const [stdout, stderr] = await spawnAsPromise('node', [
      path.resolve(__dirname, './exit-code.js'),
    ]);
    assert.strictEqual(stdout, 'Hello World!');
    assert.strictEqual(stderr, 'No errors');
  });

  test('spawnAsPromise correct stdout, stderr output exit code 1', async () => {
    try {
      const [stdout, stderr] = await spawnAsPromise('node', [
        path.resolve(__dirname, './exit-code-err.js'),
      ]);
    } catch (error) {
      const [stdout, stderr] = error;
      assert.strictEqual(stdout, 'Hello World!');
      assert.strictEqual(stderr, 'Errors');
    }
  });

  test('spawnAsPromise correct stdout, stderr output exit code 1 with ignoreExitCode', async () => {
    const [stdout, stderr] = await spawnAsPromise(
      'node',
      [path.resolve(__dirname, './exit-code-err.js')],
      undefined,
      undefined,
      true
    );
    assert.strictEqual(stdout, 'Hello World!');
    assert.strictEqual(stderr, 'Errors');
  });
});
