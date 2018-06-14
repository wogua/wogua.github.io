


"use strict";



class TitleBar extends CompositeView{
	constructor(page) {
        super(page);
		this._page = page;
		this._title = "";
		this._backbutton = ;
        this.setupViews(page);
    }
	
	setupViews(page){
		const LayoutManager = Require.getRequire("yunos/ui/markup/LayoutManager");
        this._contentView = LayoutManager.loadSync("title_bar_container", {context: page});
		this._backbutton = _contentView.findViewById("title_bar_backbt");
		this._backbutton.addEventListener("tap",(event) => {
			_page.onBackKeyFromApp();
		});
        this.addChild(this._contentView);
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