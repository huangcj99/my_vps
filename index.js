const server = require('./server'),
      method = require('./router');

let reqMethod = {
    getData:method.getData,
    postData:method.postData,
    delData:method.delData,
    putData:method.putData
};

server.start(reqMethod);