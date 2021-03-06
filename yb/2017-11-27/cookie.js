var debug = require('debug')('xxx');
var http = require('http');
var uuid = require('uuid/v4');
var session = {};

http.createServer(function (req, res) {
  debug('log:' + req.headers);
  var cookie = req.headers['cookie'];//登录产生用户信息
  var user;
  var index = -1;
  var sid;
  if (cookie) {
    var cookies = cookie.split('; ');
    debug('log:' + cookie);
    debug('log:' + cookies);
    if (cookies) {
      for (var i = 0; i < cookie.length; i++) {
        if (cookies[i].indexOf('sid') === 0) {
          sid = cookies[i].split('=')[1];
          debug('log:' + sid);
          index = i;
          break;
        }
      }
      debug('log:' + 'index =' + index);
      if (index !== -1) {
        user = session[sid];
      }
    }
  }

  if (!user) {
    user = {
      id: uuid(),
      username: 'user-' + new Date().getTime(),
      password: 'password'
    };

    //生成sid
    sid = uuid();
    //保存用户信息
    session[sid] = user;
    res.writeHead(200, {
      'Set-Cookie': 'sid=' + sid,
      'Content-Type': 'text/plain'
    });
  }
  res.write('Your name is' + user.username + '\n');
  res.write('Hello World!');
  res.end();
}).listen(8080);