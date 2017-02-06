const http = require('http'),
      url = require('url');

/**
 *      开启服务器并通过请求类型分类进入不同的处理模块
 */
exports.start = function (reqMethod) {
    function onRequest(req,res) {
        let params = url.parse(req.url,true);
        //将处理得到的路径和查询字符串对象挂载到req上
        req.pathname = params.pathname;
        req.query = params.query;

        switch(req.method){
            case 'GET':
                reqMethod.getData(req,res);
                break;
            case 'POST':
                reqMethod.postData(req,res);
                break;
            default:

        }
    }

    let server = http.createServer(onRequest);

    server.listen(8080);
};

