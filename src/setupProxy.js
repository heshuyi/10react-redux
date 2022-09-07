const proxy = require('http-proxy-middleware');

module.exports = function setProxy(app) {
  app.use(proxy('/api', {
    target: 'http://localhost:9090/',
    pathRewrite: {
      '^/api': '/',
    },
    // headers: {
    //   'wind.sessionid': 'baea790ea0a2495faa2b11e9d67be944',
    // },
  }));
};
