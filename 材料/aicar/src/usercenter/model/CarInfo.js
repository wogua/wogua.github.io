
"use strict";

class CarInfo{
	
	constructor(vinId,engineId) {
        this._vinId = vinId;
        this._engineId = engineId;
    }
	
	get vinId(){
		return this._vinId;
	}
	
	set vinId(vinId){
		this._vinId = vinId;
	}
	
	get engineId(){
		return this._engineId;
	}
	
	set engineId(engineId){
		this._engineId = engineId;
	}
}