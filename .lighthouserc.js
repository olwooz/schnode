module.exports = {
  ci: {
    collect: {
      staticDistDir: './build',
      url: ['http://localhost:3000'],
      numberOfRuns: 5,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
