"use strict";

const HttpHelper = require("./net/HttpHelper");

var DatasProvider = {
    getHttpClient: function (config) {
        // if(!this._httpHelper){
        //     this._httpHelper = new HttpHelper(config);
        // }else{
        //     objectUtils = require(../utils/ObjectUtils.js);
        //     if(!objectUtils.isObjectValueEqual(this._httpHelper.config,config){
        //
        //     }
        // }
        this._httpHelper = new HttpHelper(config);
        return this._httpHelper;
    },
    //
    // getFileClient: function (config) {
    //     if (!this._fileClient) {
    //         this._fileClient = new FileClient(config);
    //     }
    //     return this._fileClient;
    // },

    getTcpClient: function (config) {

    }
}

module.exports = DatasProvider;
