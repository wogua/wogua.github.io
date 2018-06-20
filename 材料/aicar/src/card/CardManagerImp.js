"use strict";

const Page = RequireRouter.getRequire("yunos/page/Page");
const _cardsConfig = require("../cards_config.js")；
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
        return this._curCard === null;
    }

    doShow() {
        if (this._curCard && !this._curCard.isShow) {
            this._curCard.doShow();
        }
    }

    doHide() {
        if (this._curCard && this._curCard.isShow) {
            this._curCard.doHide();
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

        if (this._curCard) {
            let card = this._curCard;
            if (card.)
                if (this._curCard.doBackPress(forceFinish)) {
                    return true;
                } else {
                    return false;
                }
        }
        return false;
    }

    doBackInStack(stackId) {
        let cardStack = _cardViews[stackId];
        if (cardStack) {
            cardStack
        }
    }

    showCardByConfig(cardConfig) {
        loadCard(cardConfig.layout, cardConfig.title cardConfig.cardStack);
    }

    loadCard(cardId, cardTitle, stackId) {
        if (cardId || stackId) {
            throw new Error("showCardById error, cardId or stackId is null");
        }

        //init card if undefined
        if (_cardViews[cardId] === undefined) {
            _cardViews[cardId] = new Card(this._page, cardId,cardTitle, stackId, this._cardContainer);
        }
        let card = _cardViews[cardId];

        //init cardStack if undefined
        if (this._cardStacks[stackId] == undefined) {
            this._cardStacks[stackId] = new CardStack(this._page, stackId, this._cardContainer);
        }
        let cardStack = this._cardStacks[stackId];

        showCardInStack(card, cardStack);
    }

    showCardById(cardId) {
        if (cardId) {
            throw new Error("showCardById error, cardId is null");
        }
        if (_cardViews[cardId] === undefined) {
            _cardViews[cardId] = new Card(this._page, cardId, stackId, this._cardContainer);
        }
        let card = _cardViews[cardId];

        showCard(card);
    }

    showCard(card) {
        if (_cardViews[cardId] === undefined) {
            _cardViews[cardId] = new Card(this._page, cardId, stackId, this._cardContainer);
        }
        let card = _cardViews[cardId];

        let stackId = card.stackId;
        if (!stackId) {
            throw new Error("showCard faild, there is a bad card : " + card.title);
        }

        if (this._cardStacks[stackId] == undefined) {
            this._cardStacks[stackId] = new CardStack(this._page, stackId, this._cardContainer);
        }
        let cardStack = this._cardStacks[stackId];

        showCardInStack(card, cardStack);
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
        if (_curStack !== cardStack) {
            this._curStack = cardStack;
            this._cardContainer.removeAllChildren();
            this._cardContainer.addChild(this._curStack.contentView);
        }

        cardStack.showCard(card);
    }

    finishCard(card) {
        if (card) {
            card.finish();
        }
    }

    cleanCards() {
        if (this._curCard) {
            try {
                this._cardContainer.removeChild(this._curCard.contentView);
            } catch (e) {}
            this._curCard.doDestroy();
            this._curCard = null;
            this._cardViews = {};
        }
    }
}

module.exports = CardManagerImpl;
