


"use strict";

const HttpHelper = require("./net/HttpHelper");

var DatasProvider = {
    getHttpClient: function(config){
        if(!this._httpHelper){
            this._httpHelper = new HttpHelper(config);
        }
    }

    getFileClient: function(config){
		if(!this._fileClient){
            this._fileClient = new FileClient(config);
        }
    }

    getTcpClient: function(config){

    }
}

module.exports = DatasProvider;
