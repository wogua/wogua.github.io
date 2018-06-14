"use strict";

/**
* 主卡片，可以通过stackview管理子card
*/
class StackCard extends Card{

    constructor(page) {
		this._page = page;
		this._rootView = null;
		this._subWindow = null;
		this._contentView = null;//每个卡片的主容器
		this._stackView = null;
		this.createStackView(page)；
    }

	get page(){
		return this._page;
	}

	get contentView(){
		return this._rootView;
	}

	set contentView(view){
		this._contentView.removeAllChildren();
		_rootView = view;
	}

	doShow(){

	}

	doHide(){

	}

	doDestroy(){

	}

	createStackView(page) {
        let StackView = RequireRouter.getRequire("yunos/ui/view/StackView");
        let stackView = new StackView(page);
        stackView.swipeable = false;
        var self = this;
        let popChildCB = function(view) {
            log.D(TAG, "sceneManagerImp popChildCB");
            if (self.isDestroy) {
                return;
            }
            if (view && view._yunosStackItem) {
                self.popChildCB(view._yunosStackItem);
                view.destroy(true);
            }
        };
        let pushChildCB = function(view) {
            log.I(TAG, "sceneManagerImp pushChildCB");
        };
        let pushChildFinishCB = function() {
            log.E(TAG, "sceneManagerImp pushChildFinishCB");
            if (self.isDestroy) {
                return;
            }
            self.showTopScene();
        };
        stackView.addEventListener("popchild", popChildCB);
        stackView.addEventListener("pushchild", pushChildCB);
        stackView.addEventListener("pushchildfinish", pushChildFinishCB);
        this._stackView = stackView;
    }
}
