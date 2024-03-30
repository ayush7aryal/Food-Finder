const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://food-finder-jade.vercel.app',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // This line removes '/api' from the request path
            },
        })
    );
};

