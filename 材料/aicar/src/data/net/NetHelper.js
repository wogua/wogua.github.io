"use strict";

const HttpClient = require("yunos/net/HttpClient");
let opt = {url: "172.26.161.97:85/iov_gw/",
    method: HttpClient.Method.POST,
    priority: HttpClient.Priority.DefaultPriority};



class NetHelper{
    constructor() {
        this.netHelperImpl = null;
    }

    init(){

    }
    request(requestType,api){
        if(_request){

        }
    }
}

var NetHelper = {
    netHelperImpl:null,
    var gStoredObjects = {};
    init:function(){

    }

    getInstance:function(){
        this.netHelperImpl =
    }

}


module.exports = NetHelper;
