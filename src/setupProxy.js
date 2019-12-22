const proxy = require("http-proxy-middleware");

//代理所有请求会包含首页'/'的GET请求（在本地:3000），目前只将axios发送请求时（后台:8080）转发
module.exports = function(app) {
  console.log("proxy");
  app.use(
    proxy("/api", {
      target: "http://127.0.0.1:8080",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": ""
      }
    })
  );
};
