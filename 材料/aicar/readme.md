# AiCar

 李俊创建于2018.6.5
 
 应用于端云一体化产品，VOS_lite项目

 AiCar 即为爱车管家应用
 
 主要功能车辆检测，车辆服务，违章查询，维修保养等功能

 /**
 * Copyright (C) 2017 Alibaba Group Holding Limited. All Rights Reserved.
 */
"use strict";
/* jshint -W098 */
/* jshint -W126 */
let TAG = "NormalStack";

let RequireRouter = require("../RequireRouter");
let StackItem = RequireRouter.getRequire("./sceneservice/StackItem");
class NormalStack extends StackItem{
    constructor(page) {
        // ._count = 0;
        super();
        this._stackView = this.createStackView(page);
        this._current = null;
        this._stacklist = [];
        this.contentView = this._stackView;
        this._hasAllFinish = true;
    }

    popChildCB(stackItem) {
        log.D(TAG, "sceneManagerImp popChildCB 00000");
        if (stackItem) {
            this.removeChild(stackItem);
        }
        if (this._stackView.children.length > 0 || this._stacklist.length > 0) {
            if (!this.checkFinishStack()) {
                this.showTopScene();
            }
        } else if (this._finishCB) {
            this._finishCB(this);
            this._finishCB = null;
        }
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
        return stackView;
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
    removeChild(item) {
        for (let i = this._stacklist.length - 1; i >= 0; i--) {
            let current = this._stacklist[i];
            if (!item || current === item) {
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

    showTopScene() {
        log.E(TAG, "showTopScene 0000000");
        let topItem = this.peekStackItem();
        if (topItem && topItem !== this._current && this._isShow) {
            this.hideShowSence();
            this._current = topItem;
            if (!topItem.isShow && this._isShow) {
                log.E(TAG, "showTopScene 33333333");
                topItem.doShow();
            }
        }
    }
    hideShowSence(scene) {
        if (!scene) {
            scene = this._current;
        }
        if (this._current && scene === this._current) {
            if (this._current.isShow) {
                this._current.doHide();
            }
            this._current = null;
        }
    }
    findNextValidItem(targetItem) {
        let isFindTarget = false;
        for (let i = this._stacklist.length - 1; i >= 0; i--) {
            let item = this._stacklist[i];
            if (!isFindTarget) {
                if (targetItem === item) {
                    isFindTarget = true;
                }
            } else if (!item.isfinish) {
                return i;
            }
        }
        return -1;
    }
    popToValidChild(popItem) {
        log.E(TAG, "popToValidChild");
        if (this.isDestroy || !popItem) {
            return;
        }
        let item = this.peekStackItem();
        if (popItem === item) {
            this._stackView.popChild(this._stackView.children && this._stackView.children.length > 1 && NormalStack.IS_ANIMATION);
        } else {
            // find item in stacklist
            let popIndex = this.findNextValidItem(popItem);
            if (popIndex >= 0) {
                // for (let i = this._stacklist.length - 1; i > popIndex; i--) {
                // this._stacklist[i].ispop = true;
                // }
                popItem = this._stacklist[popIndex];
                let popView = popItem.contentView;
                this._stackView.popToChild(popView);
            }
        }
    }
    finishScene(scene, forceFinish) {
        let item = this.peekStackItem();
        if (item) {
            if (item instanceof NormalStack) {
                item.finishScene(scene);
            } else if (item === scene) {
                if (!this.doBackPress(forceFinish)) {
                    if (this._finishCB) {
                        this._finishCB(this);
                        this._finishCB = null;
                    }
                }
            }
        }
    }
    get count() {
        return this._stacklist.length;
    }
    // item will be Scene or NavigationView
    push(stackItem) {
        this._hasAllFinish = false;
        stackItem.contentView._yunosStackItem = stackItem;
        this._stacklist.push(stackItem);
        this._stackView.pushChild(stackItem.contentView, this._stacklist.length > 1 && NormalStack.IS_ANIMATION);
    }
    getTopStackItem() {
        let item = this.peekStackItem();
        return item;
    }
    doShow() {
        super.doShow();
        this.showTopScene();
    }
    doHide() {
        super.doHide();
        this.hideShowSence();
    }
    doBackPress(forceFinish) {
        log.D(TAG, "navigationView doBackPress");
        if (this.isDestroy) {
            return;
        }
        if (!forceFinish && this._current && this._current.doBackPress()) {
            return true;
        }
        if (this._stackView && this._stackView.children && this._stackView.children.length > 1) {
            let popView = this._stackView.popChild(NormalStack.IS_ANIMATION);
            if (popView && popView._yunosStackItem) {
                this.hideShowSence(popView._yunosStackItem);
            }
            return true;
        }
        return false;
    }
    peekStackItem() {
        if (this._stackView) {
            let view = this._stackView.peekChild();
            if (view) {
                return view._yunosStackItem;
            }
        }
        return null;
    }
    clearYunosStackInfo(item) {
        if (item) {
            item.contentView._yunosStackItem = null;
        }
    }
    doDestroy() {
        // must re
        super.doDestroy();
        log.D(TAG, "doDestroy NavigationStack");
        this.hideShowSence();
        if (this._stackView) {
            this._stackView.destroy(true);
            this._stackView = null;
        }
        this.removeChild();
        this._finishCB = null;
    }
    set finishCallBack(callback) {
        this._finishCB = callback;
    }
    get finishCallBack() {
        return this._finishCB;
    }
    get isfinish() {
        if (this._hasAllFinish) {
            return true;
        } else {
            this.checkFinishStack();
            return this._hasAllFinish;
        }
    }
}
NormalStack.IS_ANIMATION = true;
module.exports = NormalStack;
