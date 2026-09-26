import assert from 'node:assert/strict';
import test from 'node:test';
import { projectSchema, toProjectFormData } from '../src/utils/projectForm.js';
import { getResumeFileUrl, safeHttpUrl } from '../src/utils/safeUrl.js';

const values = {
  title: 'Example project', shortDescription: 'A short project summary',
  description: 'A useful description of the project', category: 'web',
  technologies: [' React ', 'Node'], featured: false, status: 'completed', order: 0,
};

test('new projects serialize a valid unpublished flag by default', () => {
  const data = toProjectFormData(projectSchema.parse(values));
  assert.equal(data.get('published'), 'false');
  assert.equal(data.get('featured'), 'false');
  assert.deepEqual(data.getAll('technologies'), ['React', 'Node']);
  assert(![...data.values()].includes('undefined'));
});

test('editing can publish and unpublish, and clear optional links', () => {
  for (const published of [true, false]) {
    const parsed = projectSchema.parse({ ...values, published, githubUrl: '', liveUrl: '' });
    const data = toProjectFormData(parsed);
    assert.equal(data.get('published'), String(published));
    assert.equal(data.get('githubUrl'), '');
    assert.equal(data.get('liveUrl'), '');
  }
});

test('replacement images are uploaded; existing URLs are not sent as files', () => {
  const file = new File(['synthetic'], 'example.png', { type: 'image/png' });
  assert.equal(toProjectFormData({ ...values, image: file }).get('image').name, 'example.png');
  assert.equal(toProjectFormData({ ...values, image: 'https://example.com/a.png' }).get('image'), null);
});

test('resume links read the backend file object and support old URL fields', () => {
  assert.equal(getResumeFileUrl({ file: { url: 'https://example.com/resume.pdf' } }), 'https://example.com/resume.pdf');
  assert.equal(getResumeFileUrl({ url: 'https://example.com/old.pdf' }), 'https://example.com/old.pdf');
  assert.equal(getResumeFileUrl(null), null);
});

test('resume links reject active content, relative URLs, and invalid data', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', 'file:///tmp/test', '//evil.test', '/api/resume', {}, null, '']) {
    assert.equal(safeHttpUrl(url), null);
  }
  assert.equal(safeHttpUrl('http://localhost:5000/resume.pdf'), 'http://localhost:5000/resume.pdf');
});
