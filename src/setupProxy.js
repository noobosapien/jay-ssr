const {createProxyMiddleware} = require("http-proxy-middleware");

module.exports = function(app){
    app.use(
        ["/api/users", 
        "/api/users/*", 
        "/api/*",
        "/auth/*", 
        "/category/*", 
        "/shop/*", 
        "/cpi", 
        "/search/*", 
        "/admin/*", 
        '/product/*',
        '/subTotal',
        '/_cart',
        '/viewOrder',
        '/latestProd',
        '/hotProd',
        '/mostBroughtProd',
        '/postcode',
        '/shippingCost'
        ],
        createProxyMiddleware({
            target: "http://localhost:3001"
        })
    );
}