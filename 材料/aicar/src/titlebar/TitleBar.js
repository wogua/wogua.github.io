"use strict";
let RequireRouter = require("./RequireRouter");
const CompositeView = RequireRouter.getRequire("yunos/ui/view/CompositeView");
const View = RequireRouter.getRequire("yunos/ui/view/View");

class TitleBar extends CompositeView {
    constructor() {
        super();
        this._page = null;
        this._titleTextView = null;
        this._backbutton = null;
    }

    init(page) {
        this._page = page;
		this._titleTextView = this.findViewById("title_bar_name");
        this._backbutton = this.findViewById("title_bar_backbt");
        this._backbutton.addEventListener("tap", (event) => {
            this._page.onBackKeyFromApp();
        });

        return this;
    }

    //隐藏titlebar
    hide() {
        this.visibility = View.Visibility.Hidden;
    }

    //显示titlebar
    show() {
        this.visibility = View.Visibility.Visible;
    }

    get title() {
		return this._titleTextView.text;
    }

    set title(t) {
        this._titleTextView.text = t;
    }

    showBackbutton() {
        this._backbutton.visibility = View.Visibility.Visible;
    }

    hideBackbutton() {
        this._backbutton.visibility = View.Visibility.Hidden;
    }
}

module.exports = TitleBar;
