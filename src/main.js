/* eslint-disable no-console */
'use strict';

const { createServer } = require('./createServer');
const { db } = require('./utils/db');
const closeWithGrace = require('close-with-grace');

const app = createServer();

const server = app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Server is running on localhost:3000');
});

/** @type {import('close-with-grace').CloseWithGraceCallback} */
const cleanUp = async ({ err, signal }, done) => {
  if (err) {
    console.error('Closing server with error', err);
  } else {
    console.log(`${signal} received, closing server`);
  }

  server.close(async () => {
    await db.end();
    console.log('Server isclosed');
    done();
  });
};

// Gracefully closing the server and database when the process is terminated
closeWithGrace({ delay: 10000 }, cleanUp);
