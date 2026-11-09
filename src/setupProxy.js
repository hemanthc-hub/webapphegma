const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // ONLY proxy actual backend API routes to the Python server.
  // We explicitly do NOT proxy /assets. If an image is missing locally, 
  // it should just return a 404 instead of opening hundreds of TCP connections 
  // to the Python backend and crashing the OS with EADDRNOTAVAIL.
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
    })
  );

  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
    })
  );
};
