/**
 * Created by gunjoe on 2017/2/3.
 */
const mongoose = require('mongoose'),
      crypto = require('crypto');

//链接远程数据库
mongoose.connect("mongodb://104.194.93.138:27017/charmingHui");
//创建一个Schema
let Charming_user_schema = new mongoose.Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true}
});
//创建用户模型进行操作
let Charming_user = mongoose.model('Charming_user',Charming_user_schema);

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

    //查询数据库
    Charming_user.findOne({username:usr},(err,doc) => {
        //生成findOne的promise判断查询过程是否出现错误
        let find_doc_promise = new Promise((resolve,reject) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(doc);
            }
        });

        //无错误则判断账号是否存在,不存在则将usr与pwd存入数据库
        find_doc_promise.then((doc) => {
            if (doc !== null) {
                let failJson = {
                    "status":false,
                    "info":"该账户已存在"
                };

                res.writeHead(200,{"Content-Type":"text/plain"});
                res.end(JSON.stringify(failJson));
            }
            else {
                //哈希加密
                let hash = crypto.createHash("md5");
                    hash.update(pwd);
                    pwd = hash.digest("hex");

                let user = new Charming_user({
                    username:usr,
                    password:pwd
                });

                //保存注册用户数据
                user.save((err) => {
                    if (err) {
                        res.writeHead(200,{"Content-Type":"text/plain"});
                        res.end(err.toString());
                    }
                    else {
                        let successJson = {
                            "status":true,
                            "info":"注册成功"
                        };

                        res.writeHead(200,{"Content-Type":"text/plain"});
                        res.end(JSON.stringify(successJson));
                    }
                })
            }

        },(err) => {
            res.writeHead(500,{"Content-Type":"text/plain"});
            res.write(err.toString());
            res.end();
        })
    })
};

exports.login = (req,res) => {
    let usr = req.query.usr,
        pwd = req.query.pwd;

    let hash = crypto.createHash("md5");
    hash.update(pwd);
    pwd = hash.digest("hex");

    //生成器间传递的值变量
    let findUserDoc;

    let findUser = () => {
        Charming_user.findOne({username:usr},(err,doc) => {
             if (err) {
                 console.log(err.toString());
                 res.writeHead(200,{
                     "Content-Type":"text/plain"
                 });
                 res.end(err.toString());
             }
             else {
                 if (doc !== null){
                     findUserDoc = doc;
                     //用户存在则进行下一步的密码匹配
                     it.next();
                 }
                 else {
                     let failLogin = {
                         "status":false,
                         "info":"用户不存在，请注册"
                     };

                     res.writeHead(200,{
                         "Content-Type":"text/plain"
                     });
                     res.end(JSON.stringify(failLogin));
                 }
             }
        });
    };

    let matchPwd = (doc) => {
        setTimeout(() => {
            if (doc.password === pwd){
                it.next();
            }
            else {
                let failLogin = {
                    "status":false,
                    "info":"密码不正确"
                };

                res.writeHead(200,{
                    "Content-Type":"text/plain"
                });
                res.end(JSON.stringify(failLogin));
            }
        },0)
    };

    let setSession = () => {
        setTimeout(() => {
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

            let login_successful = {
                "status":true,
                "info":"登录成功"
            };

            res.writeHead(200);
            res.end(JSON.stringify(login_successful));
        },0)
    };

    //登陆流程控制
    function *login() {
        //查询用户是否存在
        yield findUser();
        //进行登陆匹配
        yield matchPwd(findUserDoc);
        //登陆成功后进行session设置
        yield setSession();
    }

    //初始化生成器
    let it = login();
    it.next();

};

exports.session_login = (req,res) => {
    let cookies = req.headers.cookie,
        session_id;

    //获取cookie中的session_id
    cookies.split(";").forEach((cookie) => {
        let item = cookie.split("=");
        if (item[0] === " session_id"){
            session_id = item[1];
        }
    });

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

        res.writeHead(200);
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
};