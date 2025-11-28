require('dotenv').config(); // Add this at the top
const express = require('express');
const session = require('express-session');
const path = require('path');
const glob = require('glob');
const fileUpload = require('express-fileupload');
const { setApiBaseUrl } = require('../api');
const { setup } = require('./index.js');
const authRoutes = require('./routes/auth');
const tournamentRoutes = require('./routes/tournaments');
const planningRoutes = require('./routes/planning');
const importRoutes = require('./routes/planning-import');
const executionRoutes = require('./routes/execution');
const eventRoutes = require('./routes/events');
const chronicleRoutes = require('./routes/chronicle'); // added chronicle routes import

function startServer(port, restPort, restHost, bypassAuth) {
  setup(restHost, port, restPort)
  const API_BASE_URL = `http://${restHost}:${restPort}/api`;
  console.log('API_BASE_URL set to:', API_BASE_URL);
  setApiBaseUrl(API_BASE_URL);

  const app = express();
  app.use('/styles', express.static(__dirname + '/../public/styles'));
  app.use('/scripts', express.static(__dirname + '/../public/scripts'));

  // Dynamically register static routes for *.public.js files
  glob.sync(path.join(__dirname, '../templates/**/**/*.public.js')).forEach(filePath => {
    const fileName = path.basename(filePath);
    console.log(`Adding public script: /scripts/${fileName}`)
    app.get(`/scripts/${fileName}`, (req, res) => {
      res.sendFile(filePath);
    });
  });
  glob.sync(path.join(__dirname, '../templates/**/**/*.style.css')).forEach(filePath => {
    const fileName = path.basename(filePath);
    console.log(`Adding public style: /styles/${fileName}`)
    app.get(`/styles/${fileName}`, (req, res) => {
      res.sendFile(filePath);
    });
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileUpload());
  app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  if (bypassAuth) {
    app.use((req, res, next) => {
      req.session.user = { id: 1, name: 'TestUser', email: 'test@example.com' };
      next();
    });
  }

  // Mount routes
  app.use(authRoutes);
  app.use(tournamentRoutes);
  app.use(planningRoutes);
  app.use(importRoutes);
  app.use(executionRoutes);
  app.use(eventRoutes);
  app.use('/chronicle', chronicleRoutes); // added chronicle route mounting
  app.use('/api', require('./routes/api')); // Mount api routes

  console.log('Starting server on port:', port);
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  process.on('SIGTERM', shutDown);
  process.on('SIGINT', shutDown);

  function shutDown() {
    console.log('Received shutdown signal, closing server...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
    setTimeout(() => {
      console.error('Forcing shutdown.');
      process.exit(1);
    }, 5000);
  }
}

module.exports = { startServer };
