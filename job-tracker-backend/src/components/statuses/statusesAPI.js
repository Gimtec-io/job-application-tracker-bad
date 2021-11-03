const express = require('express');
const Status = require('./Status');

const router = express.Router();

// Get all
router.get('/', async (req, res) => {
  const statuses = await Status.getAll();
  res.json(statuses);
});

module.exports = router;
