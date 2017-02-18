/**
*   用于分离请求方式
*
* */
const path = require('path'),
      fs = require('fs'),
      crypto = require('crypto'),
      ASQ = require('asynquence');

const account = require('./charming_account/account'),
      getImg = require('./charming_get_img/get_img');

//判断是否直接访问域名
let isHomepage = (req) => req.pathname.slice(-1) === '/';

//返回Content-Type
let rtnContentType = (type) => {
    switch(type){
        case "html":
            type = "text/html";
            break;
        case "css":
            type = "text/css";
            break;
        case "js":
            type = "application/x-javascript";
            break;
        case "jpg":
            type = "image/jpeg";
            break;
        case "png":
            type = "image/png";
            break;
        case "gif":
            type = "image/gif";
            break;
        case "ico":
            type = "image/x-icon";
            break;
        default:
            throw new Error("Please add fileExt");
    }
    return type;
};

//返回相应文件到client
let rtnFile = (req,res,ext) => {
    let pathname = req.pathname,
        filePath = path.join(process.cwd(),pathname),
        type = ext ? ext.slice(1) : "unknow";

    //返回对应尾缀的content-type
    type = rtnContentType(type);

    let existsPath = (done) => {
        fs.exists(filePath,function (exists) {
            if (!exists){
                done.fail("don't has this file");
            }
            else {
                done();
            }
        });
    };

    let rtnFile = (done) => {
        // //存储buf块
        // let chunks = [];
        // //最终需要传输的buf的长度
        // let size = 0;
        // let rs = fs.createReadStream(filePath);
        // //接收静态文件数据
        // rs.on('data',(chunk) => {
        //     chunks.push(chunk);
        //     size += chunk.length;
        // });
        // rs.on('end',() => {
        //     let buf = Buffer.concat(chunks,size);
        //     done(buf);
        // });

        //创建管道流返回相应文件到浏览器
        let rs = fs.createReadStream(filePath);
        res.writeHead(200,{
            "Content-Type":type
        });
        rs.pipe(res);
        rs.on("error",(err) => {
             done.fail(err);
        });
    };

    // let rtn_file = (file) => {
    //     res.writeHead(200,{
    //         "Content-Type":type
    //     });
    //     res.end(file);
    // };

    let resFail = (err) => {
        console.log(err);
        res.writeHead(404,{
            "Content-Type":"text/plain"
        });
        res.end(err)
    };

    // 返回对应请求文件的异步流程序列
    ASQ()
        .then(existsPath)
        .then(rtnFile)
        // .val(rtn_file)
        .or(resFail);

};

//以get方式请求
exports.getData = (req,res) => {
    let pathname = req.pathname;

    //文件尾缀
    let ext = path.extname(pathname);

    //判断是否有ext、有则返回相应尾缀的文件
    if (ext) {
        //访问指定路径文件
        setImmediate(() => {
            rtnFile(req,res,ext);
        },0);
    }
    else {
        //判断是否直接访问ip或域名、不是则进入相应方法
        if (isHomepage(req)){
            setImmediate(() => {
                req.pathname += 'index.html';
                //更新ext以便返回相应文件
                ext = path.extname(req.pathname);
                rtnFile(req,res,ext);
            },0);

        }
        else {

            //获取主页图片路径
            if (/\/vps_homepage$/.test(pathname)){
                getImg.get_homepage(req,res);
            }
            //获取女士列表的图片路径
            if (/\/women_clothing$/.test(pathname)){
                getImg.get_list_img(req,res);
            }

            //测试ajax跨域
            if(/\/test$/.test(pathname)){
                console.log("ajax有请求");
                res.setHeader("Access-Control-Allow-Origin","*");
                res.writeHead(200,{
                    "Content-Type":"text/plain"
                });
                res.end("123");
            }

            //测试管道
            if (/\/pipe$/.test(pathname)){
                console.log("进入管道");
                let stream = fs.createReadStream('./test.js');
                stream.pipe(res);
                    // res.writeHead(200,{
                    //     "Content-Type":"text/plain"
                    // });
                    // res.end();

            }
        }
    }



};

//以post方式请求
exports.postData = (req,res) => {
    let pathname = req.pathname;

    //注册
    if (/\/register$/.test(pathname)){
        account.register(req,res);
    }

    //登陆
    if (/\/login$/.test(pathname)){
        account.login(req,res);
    }

    //session状态登录
    if (/\/session$/.test(pathname)){
        account.sessionLogin(req,res);
    }

};

//以delete方式请求
exports.delData = (req,res) => {
    let pathname = req.pathname;
    //session删除
    if (/\/session_del$/.test(pathname)){
        account.session_del(req,res);
    }
};

//以put方式请求
exports.putData = (req,res) => {

};