const express = require('express');
const Application = require('./Application');
const db = require('../db');
const Logger = require('../Logger');
const Status = require('../Status');
const { slugify } = require('../slugify');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const status = await db.statuses.getByContent('waiting first response');
    const newApplicationData = {
      id: v4(),
      company: req.body.company,
      position: req.body.position,
      slug: `${slugify(company)}-${slugify(position)}`,
      link: req.body.link,
      description: req.body.description,
      statusId: status.id,
      createdAt: req.body.createdAt,
    }
    console.log('newApplication', newApplication);
    await db.applications.create(newApplicationData);
    const newApplication = new Application(newApplicationData);
    newApplication.setStatus(status);
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
