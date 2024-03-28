// 导入express模块
const express = require("express");

// 应用文件，用于生成 SVG 格式的验证码图片
const svgCaptcha = require("svg-captcha");

// 引入path模块，是Node.js的核心模块，用于处理文件路径和目录路径相关的操作
let path = require("path");

// 创解析HTTP请求的主体数据，创建 application/x-www-form-urlencoded 编码解析
let bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// 创建路由对象，并挂载具体的路由
const authcode = express.Router();

// 引入cookie,"enboy"作为密钥，用于对cookie进行签名
let util = require("util");
let cookieParser = require("cookie-parser");
authcode.use(cookieParser("enboy"));

// 导入加密模块
const crypto = require("crypto");
//signedCookies对象是cookie-parser的一个属性，用于访问已签名的cookie数据
const { signedCookies } = require("cookie-parser");

/**
 * 处理GET请求的"/authcode"路径，用于处理验证码
 */
authcode.get("/authcode", (req, res) => {
  const captcha = svgCaptcha.create();
  generatedCaptcha = captcha.text;
  timestamp_of_code = Date.now();

  // sha1散列验证码
  let sha = crypto.createHash("sha1");
  let sha_code = sha.update(generatedCaptcha).digest("hex");

  // 将签名和时间戳存入cookie
  res.cookie("code", sha_code, {
    signed: true,
    maxAge: 2000 * 1000,//过期时间
    httpOnly: true,//只能通过 HTTP 请求访问该 Cookie
  });
  // 将验证码的 SVG 图片作为响应发送给客户端
  res.type("svg").send(captcha.data);
});

// 将路由对象导出，使其可以在其他文件中引入和使用
module.exports = authcode
