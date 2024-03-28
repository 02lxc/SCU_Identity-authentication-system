// 导入express模块
const express = require("express");

// 引入path模块
let path = require("path");

// 解析HTTP请求的主体数据，创建 application/x-www-form-urlencoded 编码解析
let bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// 创建路由对象，并挂载具体的路由
const router = express.Router();

// 引入cookie,"enboy"作为密钥，用于对cookie进行签名
let util = require("util");
let cookieParser = require("cookie-parser");
router.use(cookieParser("enboy"));

// 导入加密模块
const crypto = require("crypto");
//signedCookies对象是cookie-parser的一个属性，用于访问已签名的cookie数据
const { signedCookies } = require("cookie-parser");

/**
 * 处理get请求的"/"路径，如果用户已经登录，那么跳转到authed.html，否则跳转到unauthed.html
 */
router.get("/", function (req, res, next) {
  let Path = path.resolve(__dirname, ".."); //代码文件的根路径
  if (req.signedCookies.isinline) {
    //如果cookie中有isinline字段，且值为1，说明已经登录
    if (req.signedCookies.isinline == 1) {
      res.sendFile(Path + "/views/authed.html");
    }
  } else {
    //如果cookie中没有isinline字段，或者值不为1，说明未登录
    res.sendFile(Path + "/views/unauthed.html");
  }
});

/**
 * 处理get请求的"/login.html"路径，如果用户已经登录，那么跳转到authed.html，否则跳转到login.html
 */
router.get("/login.html", function (req, res, next) {
  let Path = path.resolve(__dirname, ".."); //代码文件的根路径
  if (req.signedCookies.isinline) {
    if (req.signedCookies.isinline == 1) {
      res.sendFile(Path + "/views/authed.html");
    }
  } else {
    res.sendFile(Path + "/views/login.html");
  }
});

/**
 * 处理get请求的"/reg.html"路径，如果用户已经登录，那么跳转到authed.html，否则跳转到reg.html
 */
router.get("/reg.html", function (req, res, next) {
  let Path = path.resolve(__dirname, ".."); //代码文件的根路径
  if (req.signedCookies.isinline) {
    if (req.signedCookies.isinline == 1) {
      res.sendFile(Path + "/views/authed.html");
    }
  } else {
    res.sendFile(Path + "/views/reg.html");
  }
});

/**
 * 处理get请求的"/authcode.html"路径，如果用户已经登录，那么跳转到authed.html，否则跳转到login.html
 */
router.get("/authed.html", function (req, res, next) {
  let Path = path.resolve(__dirname, ".."); //代码文件的根路径
  if (req.signedCookies.isinline) {
    if (req.signedCookies.isinline == 1) {
      res.sendFile(Path + "/views/authed.html");
    }
  } else {
    res.sendFile(Path + "/views/login.html");
  }
});

/**
 * 处理get请求的"/unauthcode.html"路径，如果用户已经登录，那么跳转到authed.html，否则跳转到unauthed.html
 */
router.get("/unauthed.html", function (req, res, next) {
  let Path = path.resolve(__dirname, ".."); //代码文件的根路径
  if (req.signedCookies.isinline) {
    if (req.signedCookies.isinline == 1) {
      res.sendFile(Path + "/views/authed.html");
    }
  } else {
    res.sendFile(Path + "/views/unauthed.html");
  }
});

// 向外导出路由
module.exports = router;
