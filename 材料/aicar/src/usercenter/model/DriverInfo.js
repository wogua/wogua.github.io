
"use strict";

class AccountInfo{
	
	constructor(carsProve,driverLicence,drivingLicence) {
        this._carsProve = carsProve;
        this._driverLicence = driverLicence;
		this._drivingLicence = drivingLicence;
    }
	
	get carsProve(){
		return this._carsProve;
	}
	
	set carsProve(carsProve){
		this._carsProve = carsProve;
	}
	
	
	get driverLicence(){
		return this._driverLicence;
	}
	
	set driverLicence(driverLicence){
		this._driverLicence = driverLicence;
	}
	
	
	get drivingLicence(){
		return this._drivingLicence;
	}
	
	set drivingLicence(drivingLicence){
		this._drivingLicence = drivingLicence;
	}
}