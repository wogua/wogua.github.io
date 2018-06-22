"use strict";
let Require = require("../RequireRouter");
const CompositeView = Require.getRequire("yunos/ui/view/CompositeView");
const TabConfig = require("./TabConfig");
const GridLayout = require("yunos/ui/layout/GridLayout");
const Resource = Require.getRequire("yunos/content/resource/Resource");
class TabBar extends CompositeView {
    constructor() {
        super();
        this._page = null;
        this._tabs = {}; //map{key:tabId, value:TabView}
    }

    init(page) {
        this._page = page;

        var layout = new GridLayout();
        layout.rows = 1;
        layout.columns = 4;
        this.layout = layout;

        let LayoutManager = Require.getRequire("yunos/ui/markup/LayoutManager");
        this._tabs = null;
        for (let tab in TabConfig) {
            let config = TabConfig[tab];
            let textView = LayoutManager.loadSync("tab_item_view", { context: page });
            textView.text = Resource.getInstance().getString(config.title);
            this.addChild(textView);
            textView.addEventListener("tap", this.onTabClick.bind(this, tab));
            textView
            this._tabs[tab] = textView;
        }

        return this;
    }

    onTabClick(tabId) {
        this._page.onTabChanged(tabId);
    }
}

module.exports = TabBar;
