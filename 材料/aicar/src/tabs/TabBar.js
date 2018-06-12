


"use strict";

const TABTYPE = {
    CARDOCTOR: "CARDOCTOR",
    CARSERVICE: "CARSERVICE",
    MESSAGECENTER: "MESSAGECENTER",
    USERCENTER: "USERCENTER"
};

//tabs 对应的布局文件
const TABLAYOUT = {
    CARDOCTOR: "CARDOCTOR",
    CARSERVICE: "CARSERVICE",
    MESSAGECENTER: "MESSAGECENTER",
    USERCENTER: "USERCENTER"
};


class TabBar extends CompositeView{
	constructor(page) {
        super(page);
		this._page = page;
		this._tabs = {};//map{key:tabId, value:TabView}
        this.initChild();
    }
	
	
	onTabClick(tabView){
		tabId = getTabId(tabView);
		_page.onTabChanged(tabId);
	}
}