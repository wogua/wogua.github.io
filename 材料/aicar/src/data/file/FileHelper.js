// "use strict";
//
// const fs = require("fs");
//
// class FileHelper extends IDataHelper {
//     constructor(config) {
//         this.writeCb = null;
//         this.readCb = null;
//         this._opt = {}; //"utf8"
//     }
//
//     get config (){
//
//     }
//     set config (config){
//
//     }
// 
//     getData(...args) {
//         fs.readFile(args[0], _opt[0], readCb);
//     }
//
//     putData(...args) {
//         fs.writeFile(args[0], writeCb);
//     }
//
//     getRequestClient(config) {
//         return this._requestClient;
//     }
//
// 	delete(fileName){
// 		fs.unlinkSync(fileName);
// 	}
//
// }
// module.exports = FileHelper;
