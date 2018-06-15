var request = require("request");

var options = {
    method: 'POST',
    url: 'http://172.26.161.97:85/iov_gw/api',
    headers: {
        // 'Postman-Token': 'b1ce5a05-9e08-4d01-a879-c80d994a193b',
        'Cache-Control': 'no-cache',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
    },
    formData: {
        userId: '1533',
        timestamp: '1529026103',
        sign: 'dfdffea6a0de4acc1bad2265e6fd5db8',
        api: 'iov.carDetectionL42P.carDetect',
        appCode: 'nissan',
        daId: 'DA24749B001640',
        projectType: 'l42p'
    }
};

request(options, function(error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});
