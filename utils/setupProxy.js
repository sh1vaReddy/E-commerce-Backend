const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(proxy("/api/**", { // https://github.com/chimurai/http-proxy-middleware
    target: "http://127.0.0.1:4000",
    secure: false
  }));
};