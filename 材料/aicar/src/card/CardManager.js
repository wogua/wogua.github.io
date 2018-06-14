"use strict";

const Page = RequireRouter.getRequire("yunos/page/Page");

//所有的卡片的layout
const CARDS = {
	cardoctor:"card_cardoctor",
	"card_carservice",
	"card_messagecenter",
	"card_usercenter"
};

class CardManager = {
    width: null,
    height: null,

    init: function(w, h) {
        this.width = w;
        this.height = h;
    },
    cardManagerImpl: null,
    getInstance: function() {
        if (this.cardManagerImpl === null) {
            let CardManagerImpl = RequireRouter.getRequire("./CardManagerImpl");
            let Page = RequireRouter.getRequire("../HomePage");
            let page = Page.getInstance();
            this.cardManagerImpl = new CardManagerImpl(page);
        }
        return this.cardManagerImpl;
    }
};
module.exports = CardManager;
