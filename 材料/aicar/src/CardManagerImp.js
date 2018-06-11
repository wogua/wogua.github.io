"use strict";

const Page = RequireRouter.getRequire("yunos/page/Page");

class CardManagerImpl{
	constructor(page) {
		this._page = page;
		this._cardView = null;//当前card
		this._isShow = false;
        this._isDestroy = false;
	}
	
	get isDestory(){
		return this._isDestroy;
	}
	
	isEmpty(){
		return this._cardView === null;
	}
	
	doShow(){
		if (this._cardView && !this._cardView.isShow) {
            this._cardView.doShow();
        }
	}
	
	doHide(){
		if (this._cardView && this._cardView.isShow) {
            this._cardView.doHide();
        }
	}
	
	doDestroy(){
		this.cleanScenes();
        this._isDestroy = true;
	}
	
	doBackPress(forceFinish){
		if (this._isDestroy) {
            return;
        }
		
		if (this._cardView) {
            if (this._cardView.doBackPress(forceFinish)) {
                return true;
            } else {
                return false;
            }
        }
		return false;
	}
	
	showCard(card){
		if (this._isDestroy) {
            if (scene) {
                scene.doDestroy();
            }
            return;
        }
		
		if (scene.contentView === null) {
            scene.doDestroy();
            log.E(TAG, "there no card view");
            return;
        }
		
		if (!this._cardView) {
            this._cardView = new NormalCard(this._page);
            if (this._isShow) {
                this._cardView.doShow();
            }
            let self = this;
            this._cardView.finishCallBack = function (stackItem) {
                if (self._isDestroy) {
                    return;
                }
                self._page.stopPage();
            };
            this._page.window.removeAllChildren();
            this._page.window.addChild(this._cardView.contentView);
        }
	}
	
	finishCard(card){
		if (this._cardView) {
            this._cardView.finishScene(scene, true);
        }
	}
	
	cleanCards(){
		if(this._cardView){
			try {
                this._page.window.removeChild(this._cardView.contentView);
            } catch (e) {}
			this._cardView.doDestroy();
			this._cardView = null;
		}
	}
}

module.exports = CardManagerImpl;