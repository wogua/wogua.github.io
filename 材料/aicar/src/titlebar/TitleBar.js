"use strict";

class TitleBar extends CompositeView{
	constructor() {
        super();
		this._page = null;
		this._title = "";
		this._backbutton = ;
    }

	init(page){
		this._page = page;
		// const LayoutManager = Require.getRequire("yunos/ui/markup/LayoutManager");
        // this._contentView = LayoutManager.loadSync("title_bar_container", {context: page});
		this._backbutton = this.findViewById("title_bar_backbt");
		this._backbutton.addEventListener("tap",(event) => {
			_page.onBackKeyFromApp();
		});
        return this;
	}

	//隐藏titlebar
	hide(){

	}

	//显示titlebar
	show(){

	}

	get title(){

	}

	set title(t){
		this._title = t;
	}

	showBackbutton(){
		this._backbutton.visibility = View.Visibility.Visible;
	}

	hideBackbutton(){
		this._backbutton.visibility = View.Visibility.Hidden;
	}
}
