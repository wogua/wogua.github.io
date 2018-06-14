"use strict";

/**
*卡片的具体实现
*/
class Card extends ICard{

    constructor(page) {
		this._page = page;
		this._id = null;
		this._rootView = null;
		this._subWindow = null;
		this._contentView = null;
		this._leftItem = null;
		this._rightItem = null;
    }

	get page(){
		return this._page;
	}

	get id(){
		return this._id;
	}

	set id(id){
		this._id = id;
	}

	get contentView(){
		return this._rootView;
	}

	set contentView(view){
		this._contentView.removeAllChildren();
		_rootView = view;
	}

	get subWindow() {
        return this._subWindow;
    }
    set subWindow(subWindow) {
        this._subWindow = subWindow;
    }

	closeWindow() {
        if (this._subWindow) {
            this._subWindow.removeAllChildren();
            this._subWindow.destroy();
            this._subWindow = null;
        }
    }

	doShow(){
		super.doShow();
		if (this._subWindow) {
            this._subWindow.show();
        }
	}

	doHide(){
		super.doShow();
		if (this._subWindow) {
            this._subWindow.hide();
        }
	}

	doDestroy(){
		super.doShow();
		if (this._rightItem) {
            this._rightItem.destroy();
            this._rightItem = null;
        }
        if (this._leftItem) {
            this._leftItem.destroy();
            this._leftItem = null;
        }
        if (this._rootView) {
            this._rootView.destroyAll();
            this._rootView.destroy(true);
            this._rootView = null;
        }
        this._page = null;
	}

    doBackPress(){
        _page.cardManagerImpl.showCard(_leftItem);
    }
	
}
