"use strict";

// const Page = RequireRouter.getRequire("yunos/page/Page");
const _cardsConfig = require("./CardsConfig");
let RequireRouter = require("./RequireRouter");
const CardStack = RequireRouter.getRequire("./CardStack");
let TAG = "AiCar/CardManager";
class CardManagerImpl {
    constructor(page) {
        this._page = page;
        this._cardContainer = null;
        this._curCard = null; //当前card
        this._cardViews = {}; // map for cardViews, key:id  value:card
        this._curStack = null; //当前Stack
        this._cardStacks = {}; //map for CardStack, key:id  value:CardStack
        this._isShow = false;
        this._isDestroy = false;
    }

    init(condContainer) {
        this._cardContainer = condContainer;
        // showCardByConfig(_cardsConfig.CAR_DOCTOR);
    }

    get isDestory() {
        return this._isDestroy;
    }

    isEmpty() {
        return this._curStack === null;
    }

    doShow() {
        if (this._curStack && !this._curStack.isShow) {
            this._curStack.doShow();
        }
    }

    doHide() {
        if (this._curStack && this._curStack.isShow) {
            this._curStack.doHide();
        }
    }

    doDestroy() {
        this.cleanCards();
        this._isDestroy = true;
    }

    /**
     * [doBackPress 处理返回事件]
     * @param  {[type]} forceFinish [description]
     * @return {[type]}             [true：消费掉返回事件； false：反之]
     */
    doBackPress(forceFinish) {
        if (this._isDestroy) {
            return false;
        }

        if (this._curStack) {
            if (this._curStack.doBackPress()) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    showCardByConfig(cardConfig) {
        let cardId = cardConfig.layout;
        let cardTitle = cardConfig.title;
        let cardPath = cardConfig.cardPath;
        let stackId = cardConfig.cardStack;

        if (!cardId || !stackId || !cardPath) {
            throw new Error("showCardByConfig error, cardId or stackId or cardPath is null");
        }

        let card = this.createCard(cardId, cardTitle, cardPath, stackId);

        //init cardStack if undefined
        if (this._cardStacks[stackId] == undefined) {
            this._cardStacks[stackId] = new CardStack(this._page, stackId, this._cardContainer);
        }
        let cardStack = this._cardStacks[stackId];

        this.showCardInStack(card, cardStack);
    }

    showCardById(cardId) {
        if (cardId) {
            throw new Error("showCardById error, cardId is null");
        }
        if (this._cardViews[cardId] === undefined) {
            let cardPath = this.getCardPathById(cardId);
            let stackId = this.getCardStackById(cardId);
            let CustomCard = require(cardPath);
            try{
                this._cardViews[cardId] = new CustomCard(this._page, cardId, stackId, this._cardContainer);
            }catch (e){
                this._cardViews[cardId] = null;
            }
        }
        let card = this._cardViews[cardId];

        this.showCard(card);
    }

    showCard(card) {
        if(!card){
            log.e("showCard failed because card is null");
            return;
        }
        let stackId = card.stackId;
        if (!stackId) {
            throw new Error("showCard faild, there is a bad card : " + card.title);
        }

        if (this._cardStacks[stackId] == undefined) {
            this._cardStacks[stackId] = new CardStack(this._page, stackId, this._cardContainer);
        }
        let cardStack = this._cardStacks[stackId];

        this.showCardInStack(card, cardStack);
    }

    showCardInStack(card, cardStack) {
        this._curCard = card;
        if (this._isDestroy) {
            if (card) {
                card.doDestroy();
            }
            return;
        }

        if (this._curStack.contentView === null) {
            log.E(TAG, "there no curStack contentView");
            return;
        }

        //show the stack
        if (this._curStack !== cardStack) {
            this._curStack = cardStack;
            this._cardContainer.removeAllChildren();
            this._cardContainer.addChild(this._curStack.contentView);
        }

        this._curStack.showCard(card);
    }

    // finishCard(card) {
    //     if (card) {
    //         card.finish();
    //     }
    // }

    cleanCards() {
        this._cardContainer.removeAllChildren();
        if (this._curStack) {
            this._curStack.doDestroy();
            this._curStack = null;
        }
        this._cardViews = {};
    }

    createCard(cardId, cardTitle, cardPath, stackId) {
        let card = null;
        //init card if undefined
        if (this._cardViews[cardId] === undefined) {
            if(!cardPath){
                return null;
            }
            let CustomCard = require(cardPath);
            try{
                this._cardViews[cardId] = new CustomCard(this._page, cardId, cardTitle, stackId, this._cardContainer);
            }catch (e) {
                log.E(TAG, "createCard failed, error path??? path="+cardPath);
                return null;
            }
        } else {
            card = this._cardViews[cardId];
        }
        return card;
    }

    getCardPathById(cardId) {
        for (var s in _cardsConfig){
            if(_cardsConfig[s].layout === cardId){
                return _cardsConfig[s].cardPath;
            }
        }
        return null;
    }

    getCardStackById(cardId) {
        for (var s in _cardsConfig){
            if(_cardsConfig[s].layout === cardId){
                return _cardsConfig[s].cardStack;
            }
        }
        return null;
    }
}

module.exports = CardManagerImpl;
