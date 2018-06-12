"use strict";

const Page = RequireRouter.getRequire("yunos/page/Page");

class CardManagerImpl{
	constructor(page) {
		this._page = page;
		this._curCard = null;//当前card
		this._cards = {};// map for cards, key:id  value:card
		this._isShow = false;
        this._isDestroy = false;
	}
	
	get isDestory(){
		return this._isDestroy;
	}
	
	isEmpty(){
		return this._curCard === null;
	}
	
	doShow(){
		if (this._curCard && !this._curCard.isShow) {
            this._curCard.doShow();
        }
	}
	
	doHide(){
		if (this._curCard && this._curCard.isShow) {
            this._curCard.doHide();
        }
	}
	
	doDestroy(){
		this.cleanScenes();
        this._isDestroy = true;
	}
	
	doBackPress(forceFinish){
		if (this._isDestroy) {
            return false;
        }
		
		if (this._curCard) {
            if (this._curCard.doBackPress(forceFinish)) {
                return true;
            } else {
                return false;
            }
        }
		return false;
	}
	
	showCardById(cardId){
		let map = _cards;
		if (_cards[cardId] === null) {
			
		}
		card = 
	}
	
	showCard(card){
		if (this._isDestroy) {
            if (scene) {
                card.doDestroy();
            }
            return;
        }
		
		if (scene.contentView === null) {
            scene.doDestroy();
            log.E(TAG, "there no card view");
            return;
        }
		
		if (!this._curCard) {
            this._curCard = new NormalCard(this._page);
            if (this._isShow) {
                this._curCard.doShow();
            }
            let self = this;
            this._curCard.finishCallBack = function (stackItem) {
                if (self._isDestroy) {
                    return;
                }
                self._page.stopPage();
            };
            this._page.window.removeAllChildren();
            this._page.window.addChild(this._curCard.contentView);
        }
	}
	
	finishCard(card){
		if (this._curCard) {
            this._curCard.finishScene(scene, true);
        }
	}
	
	cleanCards(){
		if(this._curCard){
			try {
                this._page.window.removeChild(this._curCard.contentView);
            } catch (e) {}
			this._curCard.doDestroy();
			this._curCard = null;
		}
	}
}

module.exports = CardManagerImpl;