import assert from 'node:assert/strict';
import { afterEach, mock, test } from 'node:test';
import { getModelList, getModelSource } from '../src/utils/modelList.js';

afterEach(() => mock.restoreAll());

test('requests a fresh list with GET and keeps server order', async () => {
  const signal = new AbortController().signal;
  const models = [
    { name: 'my-assistant', model: 'qwen3:4b', parent: '' },
    { name: 'llama3.2:3b', model: 'llama3.2:3b', parent: '' },
  ];
  const request = mock.method(globalThis, 'fetch', async () =>
    new Response(JSON.stringify(models)));

  assert.deepEqual(await getModelList(signal), models);
  assert.deepEqual(request.mock.calls[0].arguments, [
    '/model-list', { method: 'GET', signal, cache: 'no-store' },
  ]);
});

test('accepts an empty list', async () => {
  mock.method(globalThis, 'fetch', async () => new Response('[]'));
  assert.deepEqual(await getModelList(), []);
});

test('reports non-200 responses without claiming Ollama is down', async () => {
  for (const status of [204, 400, 404, 500, 503]) {
    mock.method(globalThis, 'fetch', async () => new Response(null, { status }));
    await assert.rejects(getModelList(), new RegExp(`HTTP ${status}`));
    mock.restoreAll();
  }
});

test('reports network failure as a backend connection problem', async () => {
  mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(getModelList(), /check that the backend is running/);
});

test('preserves cancellation so closing the menu is not a failure', async () => {
  const aborted = new DOMException('Aborted', 'AbortError');
  mock.method(globalThis, 'fetch', async () => { throw aborted; });
  await assert.rejects(getModelList(), (error) => error === aborted);
});

test('rejects unfinished or incompatible response bodies without crashing rendering', async () => {
  for (const body of [
    '', '<html>Not found</html>', '{"models":[]}', '[null]', '["qwen3:4b"]',
    '[{"name":"","model":"qwen3:4b","parent":""}]',
    '[{"name":"qwen3:4b","model":null,"parent":""}]',
    '[{"name":"qwen3:4b","model":"qwen3:4b"}]',
  ]) {
    mock.method(globalThis, 'fetch', async () => new Response(body));
    await assert.rejects(getModelList(), /JSON array of model objects/);
    mock.restoreAll();
  }
});

test('cloud names hide both model and parent sources', () => {
  assert.equal(getModelSource({ name: 'gpt-oss:120b-cloud', model: 'gpt-oss:120b', parent: 'base' }), '');
  assert.equal(getModelSource({ name: 'MyCloudModel', model: 'base', parent: 'parent' }), '');
});

test('a distinct model takes priority over the parent', () => {
  assert.equal(getModelSource({ name: 'assistant', model: 'qwen3:4b', parent: 'another-base' }), 'qwen3:4b');
  assert.equal(getModelSource({ name: 'assistant', model: 'qwen3:4b', parent: 'assistant' }), 'qwen3:4b');
});

test('a distinct parent is used when model matches name or is empty', () => {
  assert.equal(getModelSource({ name: 'assistant', model: 'assistant', parent: 'qwen3:4b' }), 'qwen3:4b');
  assert.equal(getModelSource({ name: 'assistant', model: '', parent: 'qwen3:4b' }), 'qwen3:4b');
});

test('only the name appears when no distinct source exists', () => {
  assert.equal(getModelSource({ name: 'qwen3:4b', model: 'qwen3:4b', parent: '' }), '');
  assert.equal(getModelSource({ name: 'qwen3:4b', model: 'qwen3:4b', parent: 'qwen3:4b' }), '');
  assert.equal(getModelSource({ name: 'qwen3:4b', model: '', parent: '' }), '');
});
