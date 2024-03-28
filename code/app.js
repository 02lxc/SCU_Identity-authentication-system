// 导入express模块
const express = require('express')
var app = express();
app.use("/public", express.static("public"));
// 导入路由模块
const authcode = require("./src/authcode");
const page = require("./src/page");
const login = require("./src/login");
const reg = require("./src/reg")
// 注册路由模块，给路由模块添加访问前缀
app.use("/", authcode, page, login, reg);

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("应用实例，访问地址为 http://localhost:%s", port);
});