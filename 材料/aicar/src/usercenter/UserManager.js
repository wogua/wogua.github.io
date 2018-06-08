
"use strict";


var UserManager = {
	
	userManagerImpl:null,
	
    getInstance: function(){
        if(!this.userManagerImpl){
            this.userManagerImpl = new UserManagerImpl();
        }
    }
}

module.exports = UserManager;
