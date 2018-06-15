var request = require("request");

var options = {
    method: 'POST',
    url: 'http://172.26.161.97:85/iov_gw/api}',
    headers: {
        'Postman-Token': '75515a37-3c5c-4f8a-98d3-b6d2cfe13659',
        'Cache-Control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
        userName: '18898641237',
        password: 'abc123!!',
        api: 'iov331.app.userLogin',
        appCode: 'nissan'
    }
};

request(options, function(error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});
