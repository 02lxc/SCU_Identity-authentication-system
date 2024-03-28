// 导入express模块
const express = require("express");

// 数据库
mysql = require("mysql");
let pool = require("./db");

// 创建 application/x-www-form-urlencoded 编码解析
let bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// 创建路由对象，并挂载具体的路由
const login = express.Router();

// 引入cookie,"enboy"作为密钥，用于对cookie进行签名
let util = require("util");
let cookieParser = require("cookie-parser");
login.use(cookieParser("enboy"));

// 导入加密模块
const crypto = require("crypto");
const { signedCookies } = require("cookie-parser");

/**
 * 处理登录请求
 */
login.post("/login", urlencodedParser, function (req, res) {
  let email = req.body.email;
  let pwd = req.body.password;

  //用户输入的验证码
  let unauthcode = req.body.authcode;
  //用户的时间戳
  let req_timestamp = req.body.timestamp;

  //sha1散列
  let sha = crypto.createHash("sha1");
  let sha_code = sha.update(unauthcode).digest("hex");

  //cookie中的验证码赋值给rightcode
  let rightcode = req.signedCookies.code;

  //当前时间戳
  var currentTimestamp = Date.now();
  //计算差
  var timeDifference = currentTimestamp - req_timestamp;
  //如果差距大于50，可能是重放攻击
  if (timeDifference / 1000 > 50) {
    res.send("时间戳出现问题");
    return;
  }
  //  预处理语句查询数据库
  var timestamp_sql = "SELECT * FROM used where timestamp=?";
  var timestamp_SqlParams = [req_timestamp];

  // 查询时间戳是否被使用过
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("和mysql数据库建立连接失败");
    } else {
      connection.query(timestamp_sql, timestamp_SqlParams, function (err, timestamp_data) {
        connection.release();
        // 如果时间戳已经被使用过了
        if (timestamp_data.length > 0) {
          res.send("时间戳已经被使用");
          return;
        } else {
          // 将使用过的timastamp插入数据库
          var modSql = "INSERT INTO used (timestamp) VALUES(?)";
          var modSqlParams = [req_timestamp];
          connection.query(modSql, modSqlParams, function (err, result) {
            connection.release();
          });
          //   验证码比对
          if (rightcode != sha_code) {
            res.send("验证码错误");
            return;
          }
          // 将密码用sha1散列然后校对
          let hash = crypto.createHash("sha1");
          let newPas = hash.update(pwd).digest("hex");

          // 登录成功设置cookie
          // 预处理语句查询数据库
          var sql = "SELECT password FROM userinfo where email=?";
          var SqlParams = [email];
          // 校验密码
          pool.getConnection((err, connection) => {
            if (err) {
              console.log("和mysql数据库建立连接失败");
            } else {
              connection.query(sql, SqlParams, function (err, result) {
                connection.release();
                //先看查询报不报错
                if (err) {
                  console.log("[SELECT ERROR] - ", err.message);
                  return;
                }

                if (result.length > 0) {
                  // 校验密码，三个等号进行比较，要求比较的操作数在值上相等，还必须具有相同的数据类型
                  if (newPas === result[0].password) {
                    // 登录成功
                    // 销毁认证cookie
                    res.clearCookie("code");

                    // 将用户的电子邮件地址存储在cookie中
                    // 只通过HTTP协议传输，浏览器的JavaScript无法直接访问或修改该cookie，从而防止潜在的XSS
                    res.cookie("email", email, {
                      signed: true,
                      maxAge: 3000 * 1000, //过期时间为3000秒
                      httpOnly: true,
                    });

                    //表示用户处在已经登录的状态
                    res.cookie("isinline", 1, {
                      signed: true,
                      maxAge: 3000 * 1000,
                      httpOnly: true,
                    });
                    // 登录成功，跳转到登录界面
                    res.redirect('/authed.html')
                    return;
                  } else {
                    res.send("登录失败");
                    return;
                  }
                } else {
                  res.send("登录失败");
                  return;
                }
              });
            }
          });
        }
      });
    }
  });
});

// 将路由对象导出，使其可以在其他文件中引入和使用
module.exports = login;
