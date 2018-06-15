var http = require("http");
var querystring = require('querystring');

var options = {
    "method": "POST",
    "hostname": [
        "http://172.26.161.97:85/iov_gw/api"
    ],
    "headers": {
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        "Cache-Control": "no-cache",
        "Postman-Token": "e6cf8baf-d019-4ec7-8bc2-514a1313838c"
    }
};

var post_data = querystring.stringify({
    userName: '18898641237',
    password: 'abc123!!',
    api: 'iov331.app.userLogin',
    appCode: 'nissan'
});

var req = http.request(options, function(res) {
    var chunks = [];

    res.on("data", function(chunk) {
        chunks.push(chunk);
    });

    res.on("end", function() {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
    });
});

req.write(post_data);
req.end();
