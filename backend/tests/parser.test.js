const { parseTranscript } = require('../src/utils/parser');

describe('Transcript parser - heuristic cases', () => {
  const cases = [
    {
      t: 'Create a high priority task to review pull request by tomorrow evening',
      expect: { priority: 'critical' },
    },
    {
      t: 'Add a task to update documentation by next Friday',
      expect: { priority: 'medium' },
    },
    {
      t: 'New critical task to fix production bug today',
      expect: { priority: 'critical', dueDate: expect.any(String) },
    },
    {
      t: 'Please create a task to refactor the auth module by next week',
      expect: { title: expect.any(String) },
    },
    {
      t: 'Add low priority: write unit tests',
      expect: { priority: 'low' },
    }
  ];

  cases.forEach(({ t, expect: ex }, idx) => {
    test(`case ${idx + 1}`, async () => {
      const parsed = await parseTranscript(t);
      expect(parsed).toBeDefined();
      Object.keys(ex).forEach((k) => {
        expect(parsed[k]).toEqual(ex[k]);
      });
    });
  });
});
