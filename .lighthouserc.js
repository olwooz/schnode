module.exports = {
  ci: {
    collect: {
      startServerCommand: 'pnpm start',
      url: ['http://localhost:3000'],
      numberOfRuns: 5,
      startServerReadyPattern: 'ready started server',
      startServerReadyTimeout: 30000,
      settings: {
        preset: 'desktop',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
