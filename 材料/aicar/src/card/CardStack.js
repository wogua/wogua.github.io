"use strict";

/**
* 卡片栈，通过stackview管理card
*/
class CardStack{

    constructor(page,stackId,parentView) {
		this._stackView = this.createStackView(page);
        this._stacklist = [];
        this._contentView = this._stackView；
    }

	createStackView(page) {
        /**
         * [StackView （堆栈视图）是一种以堆栈的方式对子视图进行管理的容器视图。
         * 主要通过 pushChild 和 popChild 插入或者删除子视图，先入先出（FIFO）]
         */
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
        return stackView;
    }

    popChildCB(card) {
        log.D(TAG, "sceneManagerImp popChildCB 00000");
        if (card) {
            this.removeChild(card);
        }
        if (this._stackView.children.length > 0 || this._stacklist.length > 0) {
            if (!this.checkFinishStack()) {
                this.showTopCard();
            }
        } else {
            this._page.stopPage();
        }
    }

    removeChild(card) {
        for (let i = this._stacklist.length - 1; i >= 0; i--) {
            let current = this._stacklist[i];
            if (!card || current === card) {
                this.hideShowSence(current);
                this.clearYunosStackInfo(current);
                current.doDestroy();
                this._stacklist.splice(i, 1);
                if (item) {
                    return;
                }
            }
        }
    }

    checkFinishStack() {
        let poptoIndex = -1;
        for (let i = this._stacklist.length - 1; i >= 0; i--) {
            if (this._stacklist[i].isfinish) {
                poptoIndex = i;
            } else {
                break;
            }
        }
        if (poptoIndex > 0) {
            // for (let i = this._stacklist.length - 1; i >= poptoIndex; i--) {
            // this._stacklist[i].ispop = true;
            // }
            let popitem = this._stacklist[poptoIndex - 1];
            // if (!popitem.ispop) {
            // log.E(TAG, "checkFinishStack pop");
            this._stackView.popToChild(popitem.contentView);
            // }
            return true;
        } if (poptoIndex === 0) {
            this._hasAllFinish = true;
            if (this._finishCB) {
                this._finishCB(this);
                this._finishCB = null;
            }
            return true;
        } else {
            return false;
        }
    }

    showCard(card){

    }

    showTopCard(){

    }

}
