const { json } = require('body-parser');
var cors = require('cors');
const express = require('express');
const applicationsRouter = require('./applications/applicationsAPI');
const commentsRouter = require('./commentsAPI');
const Status = require('./Status');

const app = express();
const port = 8000;

app.use(json());
app.use(cors());
app.use('/applications', applicationsRouter);
app.use('/comments', commentsRouter);

// inconsistency
app.get('/statuses', async (req, res) => {
  const statuses = await Status.getAll();
  res.json(statuses);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})