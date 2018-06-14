


"use strict";

const TAB_TYPE = {
    CARDOCTOR: "CARDOCTOR",
    CARSERVICE: "CARSERVICE",
    MESSAGECENTER: "MESSAGECENTER",
    USERCENTER: "USERCENTER"
};

//tabs 对应的card
const TAB_CARD = {
    CARDOCTOR: "card_cardoctor",
    CARSERVICE: "card_carservice",
    MESSAGECENTER: "card_messagecenter",
    USERCENTER: "card_usercenter"
};


class TabBar extends CompositeView{
	constructor(page) {
        super(page);
		this._page = page;
		this._tabs = {};//map{key:tabId, value:TabView}
        this.setupViews(page);
    }

	setupViews(page){
		const LayoutManager = Require.getRequire("yunos/ui/markup/LayoutManager");
        this._contentView = LayoutManager.loadSync("tab_bar_container", {context: page});

        this.addChild(this._contentView);
        return this;
	}

	onTabClick(tabView){
		tabId = getTabId(tabView);
		_page.onTabChanged(tabId);
	}
}
