"use strict";
let RequireRouter = require("./RequireRouter");
const ICard = RequireRouter.getRequire("./ICard");
const View = RequireRouter.getRequire("yunos/ui/view/View");
let CardManager = RequireRouter.getRequire("./card/CardManager");
/**
*卡片的具体实现
*/
class Card extends ICard{
    constructor(page,id,cardTitle,stackId,cardContainer) {
        super();
		this._page = page;
		this._id = id;
        this._stackId = stackId;
        this._title = cardTitle;
		this._cardContainer = cardContainer;//card容器控件

        let LayoutManager = RequireRouter.getRequire("yunos/ui/markup/LayoutManager");
        if(id){
            this._contentView = LayoutManager.loadSync(id, {
                context: page
            });
        }
    }

	get page(){
		return this._page;
	}

	get id(){
		return this._id;
	}

	set id(id){
		this._id = id;
	}

    get stackId(){
		return this._stackId;
	}

	set stackId(stackId){
		this._stackId = stackId;
	}

    get contentView(){
		return this._contentView;
	}

	set contentView(contentView){
		this._contentView = contentView;
	}

	doShow(){
		super.doShow();
		if (this._contentView) {
            this._contentView.visibility = View.Visibility.Visible;
        }
	}

	doHide(){
		super.doShow();
		if (this._contentView) {
            this._contentView.visibility = View.Visibility.Hidden;
        }
	}

	doDestroy(){
		super.doShow();
        if (this._contentView) {
            this._contentView.destroyAll();
            this._contentView.destroy(true);
            this._contentView = null;
        }
        this._page = null;
	}

    doBackPress(){
        if(this._stackId){//调用对应的_stackId做出栈操作
            CardManager.getInstance().doBackInStack(this._stackId);
        }else{//已经是栈顶card
            this._page.hidePageInApp();
        }
    }

}

module.exports = Card;
