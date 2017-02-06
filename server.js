const http = require('http'),
      url = require('url');

exports.start = function (reqMethod) {
    function onRequest(req,res) {
        let params = url.parse(req.url,true);
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

