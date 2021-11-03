const express = require('express');
const Application = require('./Application');
const Status = require('../Status');
const Logger = require('../Logger');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newApplication = await Application.create(req.body);
    res.json(newApplication);
  } catch (error) {
    res.status(error.status || 400).json(error.message || 'Error creating application');
  }
});

// forget to catch error
router.get('/', async (req, res) => {
  const applications = await Application.getAll();
  res.json(applications);
});

// forget to catch error
router.get('/:slug', async (req, res) => {
  const application = await Application.getBySlug(req.params.slug);
  res.json(application);
});

// callback hell
router.patch('/:id', (req, res) => {
  console.log('in da patch');
  Application.getById(req.params.id)
    .then((application) => {
      const statusData = req.body.status;
      if (statusData.id) {
        Status.findById(statusData.id)
          .then((status) => {
            application.update({
              company: req.body.company,
              description: req.body.description,
              link: req.body.link,
              position: req.body.position,
              statusId: status.id,
            }).then(() => {
              application.setStatus(status);
              res.json(application);
            })
          })
      } else {
        Status.create({ content: statusData.content })
          .then((status) => {
            application.update({
              company: req.body.company,
              description: req.body.description,
              link: req.body.link,
              position: req.body.position,
              statusId: status.id,
            }).then(() => {
              application.setStatus(status);
              res.json(application);
            })
          })
      }
    });
});

module.exports = router;
