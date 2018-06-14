


"use strict";

const HttpHelper = require(".HttpHelper");

var DatasProvider = {
    getHttpClient: function(config){
		//判断config
        if(!this._httpHelper){
            this._httpHelper = new HttpHelper(config);
        }
    }

    getFileClient: function(config){
		if(!this._fileHelper){
            this._fileHelper = new FileHelper(config);
        }
    }

    getTcpClient: function(config){

    }
}

module.exports = DatasProvider;
