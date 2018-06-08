
"use strict";

class AccountInfo{
	
	constructor(name,uri,pkg) {
        this._name = uri;
        this._uri = uri;
		this._pkg = pkg;
    }
	
	get name(){
		return this._name;
	}
	
	set name(name){
		this._name = name;
	}
	
	get uri(){
		return this._uri;
	}
	
	set uri(uri){
		this._uri = uri;
	}
	
	get pkg(){
		return this._pkg;
	}
	
	set pkg(pkg){
		this._pkg = pkg;
	}
}