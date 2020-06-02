module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000/'],
      startServerCommand: 'npm start',
      startServerReadyPattern: 'listen|Ready',
      startServerReadyTimeout: 60000,
      numberOfRuns: 5,
      chromeFlags: '--ignore-certificate-errors'
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};