/**
 * Created by gunjoe on 2017/2/3.
 */
const mongoose = require('mongoose'),
      crypto = require('crypto'),
      ASQ = require('asynquence');

//链接远程数据库
mongoose.connect("mongodb://104.194.93.138:27017/charmingHui");
//创建一个Schema
let CharmingUserSchema = new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true}
});
//创建用户模型进行操作
let CharmingUser = mongoose.model('CharmingUser',CharmingUserSchema);

//储存session_id
let sessions = {};

//序列化cookie的参数
let serialize = (name,val,opt) => {
    let pairs = [`${name}=${val}`];
    opt = opt || {};

    if (opt.maxAge) {
        pairs.push(`Max-Age=${opt.maxAge}`);
    }

    if (opt.domain) {
        pairs.push(`Domain=${opt.domain}`);
    }

    if (opt.path) {
        pairs.push(`Path=${opt.path}`);
    }

    if (opt.expires) {
        let exp = (new Date(opt.expires)).toUTCString();
        pairs.push(`Expires=${exp}`);
    }

    if (opt.httpOnly) {
        pairs.push("HttpOnly");
    }

    if (opt.secure) {
        pairs.push("Secure");
    }

    return pairs.join(";");
};

/**
*    session用户构造函数
*    属性：session_id、session_exp
*    方法：add_to_sessions、setCookie
*/
function UserSession(id,exp) {
    this.session_id = id;
    this.session_exp = exp;

    this.add_to_sessions = function () {
        let info = {};
        info["exp"] = this.session_exp;
        // 在服务器内存中存储session_id
        sessions[this.session_id] = info;
    };

    this.setCookie = function (res,opt) {
        res.setHeader("Set-Cookie",serialize("session_id",this.session_id,opt));
    }
}

exports.register = (req,res) => {
    let usr = req.query.usr,
        pwd = req.query.pwd;

    let usrExists = (done) => {
        CharmingUser.findOne({username:usr},(err,doc) => {
            if (err) {
                done.fail(err);
            }
            else {
                if (!doc) {
                    done();
                }
                else {
                    done.fail("exists");
                }
            }
        })
    };

    //用户插入
    let usrInsert = (done) => {
        //哈希加密
        let hash = crypto.createHash("md5");
        hash.update(pwd);
        pwd = hash.digest("hex");

        let user = new CharmingUser({
            username:usr,
            password:pwd
        });

        //保存注册用户数据
        user.save((err) => {
            if (err) {
                done.fail(err);
            }
            else {
                done();
            }
        });
    };

    let resSuccess = () => {
        let successJson = {
            "status":true,
            "info":"注册成功"
        };

        res.writeHead(200,{
            "Content-Type":"text/plain"
        });
        res.end(JSON.stringify(successJson));
    };

    let resFail = (err) => {
        if (err === "exists") {
            let failJson = {
                "status":false,
                "info":"该账户已存在"
            };

            res.writeHead(200,{
                "Content-Type":"text/plain"
            });
            res.end(JSON.stringify(failJson));
        }
        else {
            console.log(err);
        }
    };

    //注册用户序列
    ASQ()
        .then(usrExists)
        .then(usrInsert)
        .val(resSuccess)
        .or(resFail);

    //ES6,Promise与生成器实现异步流程控制
    // //用户是否存在
    // let usrExists = () => {
    //     return new Promise((resolve,reject) => {
    //         CharmingUser.findOne({username:usr},(err,doc) => {
    //             if (err) {
    //                 reject(err);
    //             }
    //             else {
    //                 if (!doc) {
    //                     resolve();
    //                 }
    //                 else {
    //                     reject();
    //                 }
    //             }
    //         })
    //     });
    // };
    //
    // //用户插入
    // let usrInsert = () => {
    //     return new Promise((resolve,reject) => {
    //         //哈希加密
    //         let hash = crypto.createHash("md5");
    //         hash.update(pwd);
    //         pwd = hash.digest("hex");
    //
    //         let user = new CharmingUser({
    //             username:usr,
    //             password:pwd
    //         });
    //
    //         //保存注册用户数据
    //         user.save((err) => {
    //             if (err) {
    //                 reject(err);
    //             }
    //             else {
    //                 resolve();
    //             }
    //         })
    //     });
    // };
    //
    // //查询用户并插入流程控制器
    // function *findUser() {
    //    try {
    //        yield usrExists();
    //        yield usrInsert();
    //    }
    //    catch(err) {
    //        console.error(err);
    //    }
    //
    // }
    //
    // //启动流程器
    // let it = findUser();
    //
    // //返回promise
    // let usr_exists_p = it.next().value;
    //
    // //等待用户是否存在的决议后执行异步用户插入
    // usr_exists_p.then(
    //     () => {
    //         //用户不存在则进入下一个生成器并返回对应得Promise
    //         let usr_insert_p = it.next().value;
    //
    //         //用户插入成功后返回相应信息，不成功则向生成器抛出错误
    //         usr_insert_p.then(
    //             () => {
    //                 let successJson = {
    //                     "status":true,
    //                     "info":"注册成功"
    //                 };
    //
    //                 res.writeHead(200,{"Content-Type":"text/plain"});
    //                 res.end(JSON.stringify(successJson));
    //             },
    //             (err) => {
    //                 it.throw(err);
    //             }
    //         )
    //     },
    //     () => {
    //         let failJson = {
    //             "status":false,
    //             "info":"该账户已存在"
    //         };
    //
    //         res.writeHead(200,{"Content-Type":"text/plain"});
    //         res.end(JSON.stringify(failJson));
    //     }
    // );
};

exports.login = (req,res) => {
    let usr = req.query.usr,
        pwd = req.query.pwd;

    let hash = crypto.createHash("md5");
    hash.update(pwd);
    pwd = hash.digest("hex");

    let findUser = (done) => {
        CharmingUser.findOne({username:usr},(err,doc) => {
             if (err) {
                 done.fail(err);
             }
             else {
                 if (doc !== null){
                     if (doc.password === pwd){
                         done();
                     }
                     else {
                         done.fail("pwd_wrong");
                     }
                 }
                 else {
                     //不存在文件
                     done.fail("none");
                 }
             }
        });
    };

    let setSession = () => {
        let session_id = (new Date()).getTime() + Math.random(),
            //过期间隔
            exp = 24 * 60 * 60 * 1000,
            //cookie的过期时间设置为10s后
            session_exp = (new Date()).getTime() + exp,
            //写入cookie中session_id的参数选择
            cookie_opt = {
                expires:session_exp,
                httpOnly:true
            };

        //创建一个用户的session
        let userSession = new UserSession(session_id,session_exp);

        userSession.add_to_sessions();
        userSession.setCookie(res,cookie_opt);
    };

    let resSuccess = () => {
        let login_successful = {
            "status":true,
            "info":"登录成功"
        };

        res.writeHead(200,{
            "Content-Type":"text/plain"
        });
        res.end(JSON.stringify(login_successful));
    };

    let resFail = (err) => {
        //不存在用户名
        if (err === "none") {
            let failLogin = {
                "status":false,
                "info":"用户不存在，请注册"
            };

            res.writeHead(200,{
                "Content-Type":"text/plain"
            });
            res.end(JSON.stringify(failLogin));
        }

        //密码错误
        if (err === "pwd_wrong") {
            let failLogin = {
                "status":false,
                "info":"密码不正确"
            };

            res.writeHead(200,{
                "Content-Type":"text/plain"
            });
            res.end(JSON.stringify(failLogin));
        }

        console.log(err);
    };

    //用户登录任务序列
    ASQ()
        .then(findUser)
        .val(setSession)
        .val(resSuccess)
        .or(resFail);

    // //生成器间传递的值变量
    // let findUserDoc;
    //
    // let findUser = () => {
    //     CharmingUser.findOne({username:usr},(err,doc) => {
    //          if (err) {
    //              console.log(err.toString());
    //              res.writeHead(200,{
    //                  "Content-Type":"text/plain"
    //              });
    //              res.end(err.toString());
    //          }
    //          else {
    //              if (doc !== null){
    //                  findUserDoc = doc;
    //                  //用户存在则进行下一步的密码匹配
    //                  it.next();
    //              }
    //              else {
    //                  let failLogin = {
    //                      "status":false,
    //                      "info":"用户不存在，请注册"
    //                  };
    //
    //                  res.writeHead(200,{
    //                      "Content-Type":"text/plain"
    //                  });
    //                  res.end(JSON.stringify(failLogin));
    //              }
    //          }
    //     });
    // };
    //
    // let matchPwd = (doc) => {
    //     setTimeout(() => {
    //         if (doc.password === pwd){
    //             it.next();
    //         }
    //         else {
    //             let failLogin = {
    //                 "status":false,
    //                 "info":"密码不正确"
    //             };
    //
    //             res.writeHead(200,{
    //                 "Content-Type":"text/plain"
    //             });
    //             res.end(JSON.stringify(failLogin));
    //         }
    //     },0)
    // };
    //
    // let setSession = () => {
    //     setTimeout(() => {
    //         let session_id = (new Date()).getTime() + Math.random(),
    //             //过期间隔
    //             exp = 24 * 60 * 60 * 1000,
    //             //cookie的过期时间设置为10s后
    //             session_exp = (new Date()).getTime() + exp,
    //             //写入cookie中session_id的参数选择
    //             cookie_opt = {
    //                 expires:session_exp,
    //                 httpOnly:true
    //             };
    //
    //         //创建一个用户的session
    //         let userSession = new UserSession(session_id,session_exp);
    //
    //         userSession.add_to_sessions();
    //         userSession.setCookie(res,cookie_opt);
    //
    //         let login_successful = {
    //             "status":true,
    //             "info":"登录成功"
    //         };
    //
    //         res.writeHead(200);
    //         res.end(JSON.stringify(login_successful));
    //     },0)
    // };
    //
    // //登陆流程控制
    // function *login() {
    //     //查询用户是否存在
    //     yield findUser();
    //     //进行登陆匹配
    //     yield matchPwd(findUserDoc);
    //     //登陆成功后进行session设置
    //     yield setSession();
    // }
    //
    // //初始化生成器
    // let it = login();
    // it.next();
};

exports.sessionLogin = (req,res) => {
    let cookies = req.headers.cookie,
        session_id;

    setImmediate(() => {
        if (cookies) {
            //获取cookie中的session_id
            cookies.split(";").forEach((cookie) => {
                let item = cookie.split("=");
                if (item[0] === " session_id"){
                    session_id = item[1];
                }
            });
        }

        let hasSession = () => sessions[session_id];

        if (hasSession()){
            let login_successful = {
                "status":true,
                "info":"保持登录状态"
            };

            /**
             *      重新设置session的expires
             *      并重新设置cookie
             */
            let exp = 24 * 60 * 60 * 1000,
                session_exp = (new Date()).getTime() + exp,
                //cookie的过期时间设置为10s后
                cookie_opt = {
                    expires:session_exp,
                    httpOnly:true
                };

            res.setHeader("Set-Cookie",serialize("session_id",session_id,cookie_opt));

            res.writeHead(200,{
                "Content-Type":"text/plain"
            });
            res.end(JSON.stringify(login_successful));

        }
        else {
            let login_fail = {
                "status":false,
                "info":"请重新登陆"
            };

            res.writeHead(200,{
                "Content-Type":"text/plain"
            });
            res.end(JSON.stringify(login_fail));
        }
    });
};

exports.session_del = (req,res) => {
    let cookies = req.headers.cookie;

    setImmediate(() => {
        //获取cookie中的session_id
        cookies.split(";").forEach((cookie) => {
            let item = cookie.split("=");
            if (item[0] === " session_id"){
                //删除sessions中的id
                delete sessions[item[1]];

                let del_success = {
                    "status":true,
                    "info":"删除成功"
                };
                res.writeHead(200,{
                    "Content-Type":"text/plain"
                });
                res.end(JSON.stringify(del_success));
            }
        });
    });

};