// 注册

// 导入express模块，用于构建Web应用程序的框架，提供了一些方便的方法和函数
const express = require("express");

// 引入path模块，是Node.js的核心模块，用于处理文件路径和目录路径相关的操作
let path = require("path");

// 用于管理和提供数据库连接
mysql = require("mysql");
let pool = require("./db");

// 解析HTTP请求的主体数据，创建 application/x-www-form-urlencoded 编码解析
let bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// 创建路由对象，并挂载具体的路由
const reg = express.Router();

// 引入cookie,"enboy"作为密钥，用于对cookie进行签名
let util = require("util");
let cookieParser = require("cookie-parser");
reg.use(cookieParser("enboy"));

// 导入加密模块
const crypto = require("crypto");
//signedCookies对象是cookie-parser的一个属性，用于访问已签名的cookie数据
const { signedCookies } = require("cookie-parser");


/**
 * 处理POST请求的"/reg"路径，用于处理用户注册
 */
reg.post("/reg", urlencodedParser, function (req, res, next) {
  let email = req.body.email;
  let pwd = req.body.password;

  // 创建了一个SHA1散列对象，用于对密码进行加密
  let sha = crypto.createHash("sha1");
  let newPas = sha.update(pwd).digest("hex");

  //查询数据库中是否存在具有相同邮箱的用户
  var sql = "SELECT email FROM userinfo where email=?";
  var SqlParams = [email];

  // 查询是否被注册了
  pool.getConnection((err, connection) => {
    if (err) {
      console.log("和mysql数据库建立连接失败");
    } else {
      connection.query(sql, SqlParams, function (err, result) {
        if (err) {
          console.log("[SELECT ERROR] - ", err.message);
          return;
        }
        // 校验是否被注册
        if (result.length != 0) {
          // 结果长度不为零，那么已经被注册，返回注册页面
          res.send('<script>alert("该邮箱已被注册");window.location.href="/reg.html";</script>');
          return; // 返回注册界面
        } else {
          // 未被注册，则插入新的数据

          var modSql = "INSERT INTO userinfo (email,password) VALUES(?,?)";
          var modSqlParams = [email, newPas];

          // 将新用户的邮箱和密码插入到数据库中
          connection.query(modSql, modSqlParams, function (err, result) {

            //释放数据库连接，将连接返回连接池
            connection.release();
            if (err) {
              console.log("[UPDATE ERROR] - ", err.message);
              return;
            }
            // 注册成功，跳转到登录界面
            res.send(
                "<h2>注册成功!</h2>" +
                "<p> <span id = \"time\">5</span>秒后，跳转到登录页面</p>" +
                " <script>" +
                "var time = 5 ;" +
                "function showTime (){" +
                "time--;" +
                "if(time<=0){" +
                "location.href = '/login.html' " +
                "}\n" +
                "var sp = document.getElementById(\"time\");" +
                "sp.innerHTML = time ;" +
                "}\n" +
                "var id = setInterval(showTime,1000);" +
                "</script>\n"  );
          });
        }
      });
    }
  });
});

//将路由对象reg导出，使其可以在其他文件中引入和使用
module.exports = reg;
