"use strict";

/**
* 全屏的卡片
*/
class FullCard extends Card{

    constructor(page) {
		this._page = page;
		this._rootView = null;
		this._subWindow = null;
		this._contentView = null;//每个卡片的主容器
    }
	
	get page(){
		return this._page;
	}
	
	get contentView(){
		return this._rootView;
	}
	
	set contentView(view){
		this._contentView.removeAllChildren();
		_rootView = view;
	}
	
	doShow(){
		
	}
	
	doHide(){
		
	}
	
	doDestroy(){
		
	}
}
