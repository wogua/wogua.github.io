"use strict";

const Page = RequireRouter.getRequire("yunos/page/Page");

class CardManager = {
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
