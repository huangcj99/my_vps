const server = require('./server'),
      method = require('./method');

let reqMethod = {
    getData:method.getData,
    postData:method.postData
};

server.start(reqMethod);