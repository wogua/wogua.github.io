"use strict";

const HttpClient = require("yunos/net/HttpClient");
let opt = {url: "172.26.161.97:85/iov_gw/",
    method: HttpClient.Method.POST,
    priority: HttpClient.Priority.DefaultPriority};



class HttpHelper extends IDataHelper{
    constructor(config) {
		//通过config初始化cb和opt
        this._requestCb = null;
		this._dataCb = null;
		this._completeCb = null;
        this._opt = {};
		
		this._requestClient = new HttpClient(_opt);
    }

	getData(...args){
		//解析参数调用request
	}

	putData(...args){
		//解析参数调用request
	}

    request(api) {
        if (this._requestClient) {
            this._requestClient.on("response",_responseCb);
			this._requestClient.on("data",_dataCb);
            this._requestClient.on("complete",_completeCb);
			
			this._requestClient.connect(_connectCb);
        }
    }

    getRequestClient(config){
		return this._requestClient;
	}
}

module.exports = HttpHelper;
