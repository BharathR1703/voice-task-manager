const express = require('express');
const { parseTranscript } = require('../utils/parser');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { transcript = '' } = req.body;
    if (typeof transcript !== 'string') return res.status(400).json({ error: 'Invalid transcript' });

    const parsed = await parseTranscript(transcript);
    res.json({ transcript, parsed });
  } catch (err) { next(err); }
});

module.exports = router;
