const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  console.log("proxy");
  app.use(
    proxy("/auth", {
      target: "http://127.0.0.1:8080",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/auth": ""
      }
    })
  );
};
